// server/services/outbound_service.js

const { query, getConnection, selectedQuery } = require('../database/mapper.js');
const { queryFormat } = require('../utils/converts.js');
const materialService = require('./material_service.js');
const PDFDocument = require('pdfkit');

/**
 * 전체 출고 이력 조회
 */
async function findAllOutbounds() {
  return await query('selectOutboundList', []);
}

/**
 * 출고 후보 조회 (입고 LOT 기반)
 */
async function findOutboundCandidates() {
  return await query('selectOutboundCandidates', []);
}

/**
 * 출고 등록
 * @param {{
 *   mout_id: string,
 *   mater_code: string,
 *   mout_qty: number,
 *   mout_date: string,
 *   mout_checker: string,
 *   lot_cnt: string,
 *   mater_lot: string
 * }} info
 */
async function addOutbound(info) {
  const {
    mout_id,
    mater_code,
    mout_qty,
    mout_date,
    mout_checker,
    lot_cnt,
    mater_lot
  } = info;

  // 1) 재고 검증
  const material = await materialService.findMaterialByCode(mater_code);
  if (!material) {
    return { isSuccess: false, error: '존재하지 않는 자재입니다.' };
  }
  if (mout_qty > material.current_stock) {
    return { isSuccess: false, error: '현재 재고보다 큰 수량은 출고할 수 없습니다.' };
  }

  // 2) 출고 등록
  const params = [
    mout_id,
    mater_code,
    mout_qty,
    mout_date,
    mout_checker,
    lot_cnt,
    mater_lot
  ];
  const res = await query('insertOutbound', params);
  return { isSuccess: res && res.affectedRows > 0 };
}

/**
 * 출고 롤백 (삭제) — 트랜잭션으로 입고·재고 되돌리기
 */
async function cancelOutbound(moutId) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // 1) 기존 출고 레코드 조회
    const rows = await conn.query(
      selectedQuery('selectOutboundOne', [moutId]),
      [moutId]
    );
    if (!rows.length) {
      await conn.rollback();
      return false;
    }
    const { mout_qty, lot_cnt, mater_code } = rows[0];

    // 2) m_inbound.min_oqty 롤백
    await conn.query(
      `UPDATE m_inbound
        SET min_oqty = min_oqty - ?
      WHERE min_id = ? AND mater_code = ?`,
      [mout_qty, lot_cnt, mater_code]
    );

    // 3) material.current_stock 롤백
    await conn.query(
      `UPDATE material
        SET current_stock = current_stock + ?
      WHERE mater_code = ?`,
      [mout_qty, mater_code]
    );

    // 4) 출고 레코드 삭제
    await conn.query(
      selectedQuery('deleteOutbound', [moutId]),
      [moutId]
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

/**
 * 피킹 리스트 PDF 생성
 * @param {string[]} ids - 출력할 mout_id 목록
 * @param {Response} res - Express 응답 객체
 */
async function generatePickingListPDF(ids, res) {
  const conn = await getConnection();
  try {
    // 1) 데이터 조회
    const sql = `
      SELECT
        o.mout_id,
        o.mater_code,
        m.mater_name,
        o.mout_qty,
        o.lot_cnt,
        o.mater_lot,
        DATE_FORMAT(o.mout_date,'%Y-%m-%d') AS mout_date,
        o.mout_checker
      FROM m_outbound o
      JOIN material m ON m.mater_code = o.mater_code
      WHERE o.mout_id IN (${ids.map(() => '?').join(',')})
      ORDER BY o.mout_date, o.mout_id
    `;
    const records = await conn.query(sql, ids);

    // 2) PDF 세팅
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="picking_list.pdf"');
    doc.pipe(res);

    // 3) 제목
    doc.fontSize(18).text('피킹 리스트 (Picking List)', { align: 'center' });
    doc.moveDown();

    // 4) 테이블 헤더
    const headers = ['출고ID','자재코드','자재명','수량','LOT#','LOT 번호','날짜','담당자'];
    const widths = [80,80,120,60,60,80,80,80];
    let x = doc.x, y = doc.y;
    doc.fontSize(12);
    headers.forEach((h,i) => {
      doc.text(h, x, y, { width: widths[i], align: 'center' });
      x += widths[i];
    });
    doc.moveDown();

    // 5) 테이블 데이터
    records.forEach(r => {
      x = doc.x;
      const rowY = doc.y;
      [
        r.mout_id,
        r.mater_code,
        r.mater_name,
        r.mout_qty.toString(),
        r.lot_cnt,
        r.mater_lot,
        r.mout_date,
        r.mout_checker
      ].forEach((val,i) => {
        doc.text(val, x, rowY, { width: widths[i], align: 'center' });
        x += widths[i];
      });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('피킹 리스트 PDF 생성 오류:', err);
    if (!res.headersSent) {
      res.status(500).send('PDF 생성 중 오류가 발생했습니다.');
    }
  } finally {
    conn.release();
  }
}

module.exports = {
  findAllOutbounds,
  findOutboundCandidates,
  addOutbound,
  cancelOutbound,
  generatePickingListPDF,
};
