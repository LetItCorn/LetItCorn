const selectMOrderList = `
SELECT
  m.moder_id,
  m.mater_code,
  m.moder_qty,
  DATE_FORMAT(m.moder_date, '%Y-%m-%d') AS moder_date,
  m.moder_req,
  m.receiver,
  m.reference,
  DATE_FORMAT(m.due_date, '%Y-%m-%d') AS due_date,
  m.payment_term,
  m.partner_name,
  m.ceo_name,
  m.address,
  m.business_type,
  m.contact
FROM m_order m
ORDER BY m.moder_date DESC
`;

const selectMOrderOne = `
SELECT *
  FROM m_order
  WHERE moder_id = ?
`;

const insertMOrder = `
INSERT INTO m_order (
  moder_id,
  mater_code,
  moder_qty,
  moder_date,
  moder_req,
  receiver,
  reference,
  due_date,
  payment_term,
  partner_name,
  ceo_name,
  address,
  business_type,
  contact
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const updateMOrder = `
UPDATE m_order
  SET ?
  WHERE moder_id = ? AND mater_code = ?
`;

const deleteMOrder = `
DELETE FROM m_order
  WHERE moder_id = ? AND mater_code = ?
`;

module.exports = {
  selectMOrderList,
  selectMOrderOne,
  insertMOrder,
  updateMOrder,
  deleteMOrder
};