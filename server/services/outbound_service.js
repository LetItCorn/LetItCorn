// server/services/outbound_service.js
/**
 *  자재 출고 서비스
 *  - 생산지시 기반 LOT 후보 조회
 *  - 재고 검증 후 출고 INSERT
 *  - 출고 취소(롤백)
 *  - 피킹 리스트 PDF 생성
 */
const mariadb         = require('../database/mapper.js');
const materialService = require('./material_service.js');
const { queryFormat } = require('../utils/converts.js');
const PDFDocument     = require('pdfkit');

/* ────────────────────────────────────────────────────────── */
/* 1) 출고 이력 전체                                              */
async function findAllOutbounds() {
  return await mariadb.query('selectOutboundList');
}

/* ────────────────────────────────────────────────────────── */
/* 2) 생산지시 기반 LOT 후보 조회                                 */
async function findOutboundCandidates(instHead) {
  return await mariadb.query('selectOutboundCandidatesByInst', [instHead]);
}

/* ────────────────────────────────────────────────────────── */
/* 3) 출고 INSERT + 상태 변경                                     */
async function addOutbound(info) {
  const {
    inst_head, mout_id, mater_code, mout_qty,
    mout_date, mout_checker, lot_cnt, mater_lot
  } = info;

  /* 3-1) 재고 검증 */
  const material = await materialService.findMaterialByCode(mater_code);
  if (!material) return { isSuccess: false, error: '존재하지 않는 자재' };
  if (mout_qty > material.current_stock)
    return { isSuccess: false, error: '재고 부족' };

  /* 3-2) 트랜잭션 */
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    /* (a) 출고 INSERT */
    await conn.query(
      mariadb.selectedQuery('insertOutbound', [mout_id, mater_code, mout_qty,
                                              mout_date, mout_checker, lot_cnt, mater_lot]),
      [mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot]
    );

    /* (b) inst_header → 자재입고 로 상태 변경 */
    await conn.query(
      `UPDATE inst_header SET inst_stat='자재 입고'
       WHERE inst_head = ? AND inst_stat='대기'`,
      [inst_head]
    );

    await conn.commit();
    return { isSuccess: true };
  } catch (err) {
    await conn.rollback();
    console.error('addOutbound error', err);
    return { isSuccess: false, error: 'DB 오류' };
  } finally {
    conn.release();
  }
}

/* ────────────────────────────────────────────────────────── */
/* 4) 출고 롤백                                                   */
async function cancelOutbound(moutId) {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    const [row] = await conn.query(
      mariadb.selectedQuery('selectOutboundOne', [moutId]), [moutId]
    );
    if (!row) { await conn.rollback(); return false; }

    await conn.query(
      `UPDATE m_inbound
         SET min_oqty = min_oqty - ?
       WHERE min_id = ? AND mater_code = ?`,
      [row.mout_qty, row.lot_cnt, row.mater_code]
    );

    await conn.query(
      `UPDATE material
         SET current_stock = current_stock + ?
       WHERE mater_code = ?`,
      [row.mout_qty, row.mater_code]
    );

    await conn.query(
      mariadb.selectedQuery('deleteOutbound', [moutId]), [moutId]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/* ────────────────────────────────────────────────────────── */
/* 5) 피킹 리스트 PDF                                             */
async function generatePickingListPDF(ids, res) {
  const conn = await mariadb.getConnection();
  try {
    const sql = `
      SELECT o.mout_id, o.mater_code, m.mater_name, o.mout_qty,
             o.lot_cnt,  o.mater_lot,
             DATE_FORMAT(o.mout_date,'%Y-%m-%d') AS mout_date,
             o.mout_checker
        FROM m_outbound o
        JOIN material m USING(mater_code)
       WHERE o.mout_id IN (${ids.map(() => '?').join(',')})
       ORDER BY o.mout_date, o.mout_id
    `;
    const rows = await conn.query(sql, ids);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="picking_list.pdf"');
    doc.pipe(res);

    doc.fontSize(18).text('피킹 리스트', { align: 'center' });
    doc.moveDown();

    const header = ['출고ID','자재코드','자재명','수량','LOT#','LOT번호','날짜','담당자'];
    const widths = [80,80,120,40,50,80,80,80];
    let y = doc.y;
    header.forEach((h,i)=>doc.text(h, 40+widths.slice(0,i).reduce((a,b)=>a+b,0), y, {width:widths[i],align:'center'}));
    doc.moveDown();

    rows.forEach(r=>{
      const vals = [r.mout_id,r.mater_code,r.mater_name,r.mout_qty,
                    r.lot_cnt,r.mater_lot,r.mout_date,r.mout_checker];
      let x=40, rowY=doc.y;
      vals.forEach((v,i)=>{doc.text(String(v),x,rowY,{width:widths[i],align:'center'}); x+=widths[i];});
      doc.moveDown();
    });
    doc.end();
  } catch (err) {
    console.error('PDF error', err);
    res.status(500).send('PDF 생성 오류');
  } finally {
    conn.release();
  }
}

/* ────────────────────────────────────────────────────────── */
module.exports = {
  findAllOutbounds,
  findOutboundCandidates,
  addOutbound,
  cancelOutbound,
  generatePickingListPDF
};
