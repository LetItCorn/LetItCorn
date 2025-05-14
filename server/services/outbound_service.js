// server/services/outbound_service.js
/**
 *  자재 출고 서비스
 *  - 생산지시 기반 LOT 후보 조회
 *  - 재고 검증 후 출고 INSERT
 *  - 출고 취소(롤백)
 *  - 피킹 리스트 PDF 생성
 */
const mariadb         = require('../database/mapper.js');
const PDFDocument     = require('pdfkit');

/* ────────────────────────────────────────────────────────── */
/* 1) 출고 이력 전체                                              */
async function findAllOutbounds() {
  return await mariadb.query('selectOutboundList'); 
}

/* ────────────────────────────────────────────────────────── */
/* 2) 생산지시 기반 LOT 후보 조회                                 */
async function findOutboundCandidates(instHead) {
  return await mariadb.query('selectOutboundCandidatesByInstHead', [instHead]);
}

/* ────────────────────────────────────────────────────────── */
/* 3) 출고 INSERT + 상태 변경                                     */
async function addOutboundsForInstruction(payload) {
  const { instHead, records } = payload;
  if (!records?.length) return { isSuccess:false, message:'records 비어 있음' };

  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    /* ① 건별 재고·가용수량 검증 및 INSERT */
    for (const rec of records) {
      /* (a) 현재고 확인 */
      const [mat] = await conn.query(
        'SELECT current_stock FROM material WHERE mater_code = ? FOR UPDATE',
        [rec.mater_code]
      );
      if (!mat || mat.current_stock < rec.mout_qty)
        throw new Error(`재고 부족: ${rec.mater_code}`);

      /* (b) m_outbound INSERT */
      const params = [
        rec.lot_cnt + '-' + Date.now(),    // mout_id 생성
        rec.mater_code,
        rec.mout_qty,
        rec.mout_date,
        rec.mout_checker,
        rec.lot_cnt,
        rec.mater_lot
      ];
      await conn.query(
        mariadb.selectedQuery('insertOutbound', params), params
      );

      /* (c) LOT 사용량 증가 */
      await conn.query(
        mariadb.selectedQuery('updateInboundOqty',
          [rec.mout_qty, rec.lot_cnt, rec.mater_code]),
        [rec.mout_qty, rec.lot_cnt, rec.mater_code]
      );

      /* (d) 자재 현재고 차감 */
      await conn.query(
        mariadb.selectedQuery('updateMaterialStockDeduct',
          [rec.mout_qty, rec.mater_code]),
        [rec.mout_qty, rec.mater_code]
      );
    }

    /* ② 생산지시 상태를 ‘자재 입고(J02)’ 로 업데이트 */
    await conn.query(
      `UPDATE inst_header
          SET inst_stat = '자재 입고'
        WHERE inst_head = ?
          AND inst_stat = '대기'`,
      [instHead]
    );

    await conn.commit();
    return { isSuccess:true };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] addOutboundsForInstruction ERROR', err);
    return { isSuccess:false, message:err.message };
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
  addOutboundsForInstruction,
  cancelOutbound,
  generatePickingListPDF
};
