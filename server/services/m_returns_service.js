// server/services/m_returns_service.js
const db = require('../database/mapper');
const {
  selectReturnsList,
  insertReturn
} = require('../database/sqlList.js');

/**
 * 전체 반품 목록 조회
 */
async function findAllReturns() {
  return await db.query('selectReturnsList', []);
}

/**
 * 반품 등록
 * @param {{
 *   return_id: string,
 *   moder_id: string,
 *   mater_code: string,
 *   return_date: string,
 *   manager: string,
 *   reason: string,
 *   status: string
 * }} info
 */
async function addReturn(info) {
  const {
    return_id,
    moder_id,
    mater_code,
    return_date,
    manager,
    reason,
    status
  } = info;

  const params = [
    return_id,
    moder_id,
    mater_code,
    return_date,
    manager,
    reason,
    status
  ];

  const res = await db.query('insertReturn', params);
  return { isSuccess: res && res.affectedRows > 0 };
}

module.exports = {
  findAllReturns,
  addReturn
};
