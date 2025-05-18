// M_ORDER 테이블 관련 SQL 정의

/* 전체 목록 */
const selectMOrderList = `
SELECT
  h.moder_id,
  h.moder_date,
  h.moder_req,
  h.receiver,
  h.reference,
  h.due_date,
  h.payment_term,
  h.partner_name,
  h.ceo_name,
  h.address,
  h.business_type,
  h.contact,

  d.mater_code,
  d.qty                              AS moder_qty,

  /* ── 누적 입고수량 계산 ── */
  IFNULL((
    SELECT SUM(i.min_qty)
      FROM m_inbound i
      WHERE i.moder_id   = h.moder_id
      AND i.mater_code = d.mater_code
  ), 0)                              AS received_qty,

  /* ── 입고 상태 계산 ── */
  CASE
    WHEN
      IFNULL((
        SELECT SUM(i.min_qty)
          FROM m_inbound i
          WHERE i.moder_id   = h.moder_id
          AND i.mater_code = d.mater_code
      ),0) = 0
    THEN 'PENDING'                   -- 전혀 입고되지 않음
    WHEN
      IFNULL((
        SELECT SUM(i.min_qty)
          FROM m_inbound i
          WHERE i.moder_id   = h.moder_id
          AND i.mater_code = d.mater_code
      ),0) < d.qty
    THEN 'PARTIAL'                   -- 일부 입고
    ELSE 'COMPLETE'                  -- 전량 입고
  END                                 AS inbound_status

FROM m_order         h            -- 헤더
JOIN m_order_detail  d ON d.moder_id = h.moder_id
ORDER BY h.moder_date DESC, h.moder_id, d.mater_code;
`;

/* 단일 헤더 */
const selectMOrderOne = `
SELECT
  moder_id,
  moder_date,
  moder_req,
  receiver,
  reference,
  due_date,
  payment_term,
  reg_number,
  partner_name,
  ceo_name,
  address,
  business_type,
  contact
FROM m_order
WHERE moder_id = ?
`;

const insertMOrder = `
INSERT INTO m_order (
  moder_id,
  moder_date,
  moder_req,
  receiver,
  reference,
  due_date,
  payment_term,
  reg_number,
  partner_name,
  ceo_name,
  address,
  business_type,
  contact
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const updateMOrder = `
UPDATE m_order
  SET ?
WHERE moder_id = ?
`;

const deleteMOrder = `
DELETE FROM m_order
WHERE moder_id = ?
`;

module.exports = {
  selectMOrderList,
  selectMOrderOne,
  insertMOrder,
  updateMOrder,
  deleteMOrder
};
