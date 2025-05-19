const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const { convertObjToQuery } = require('../utils/converts.js');

const findAllInstHead = async ({ startDate, endDate }) => {
    let list = await mariadb.query("selectInstHeadList", [startDate, endDate]);
    return list;
   };
const findByInstHead = async (instHeadNo) => {
     let list = await mariadb.query("selectInstHeaderById", [instHeadNo]);
     return list;
    };
const modifyInstHead = async (instHeadNo, instHeadInfo) => {
  let data = [instHeadInfo, instHeadNo];
  let resInfo = await mariadb.query("updateInstHead", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    instHeadInfo.no = instHeadNo;
    result = {
      isUpdated: true,
      instHeadInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeInstHead = async (instHeadNo) => {
   let result = await mariadb.query("deleteInstHead", instHeadNo);
   return result;
  };
  const deleteInstCascade = async (instHeadNo, plansHead) => {
    const conn = await mariadb.getConnection();
    try {
      await conn.beginTransaction();  
    // plans_head 조회
    const [planRow] = await conn.query(
      `SELECT plans_head FROM inst_header WHERE inst_head = ?`,
      [instHeadNo]
    );
    const plansHead = planRow?.plans_head;
    // 하위 inst 삭제
    await conn.query(`DELETE FROM inst WHERE inst_head = ?`, [instHeadNo]);
    // inst_header 삭제 (대기 상태만)
    await conn.query(
      `DELETE FROM inst_header WHERE inst_head = ? AND inst_stat = 'J01'`,
      [instHeadNo]
    );
    if (plansHead) {
      const [cntRow] = await conn.query(
        `SELECT COUNT(*) as cnt FROM inst_header WHERE plans_head = ?`,
        [plansHead]
      );
      const remaining = cntRow?.cnt || 0;
      if (remaining === 0) {
        await conn.query(
          `UPDATE plan_header SET plan_stat = 'K01' WHERE plans_head = ?`,
          [plansHead]
        );
      }
    }
    await conn.commit();
    return { isSuccessed: true };
  } catch (err) {
    await conn.rollback();
    return { isSuccessed: false, error: err.message };
  } finally {
    conn.release();
  }
};

module.exports = {
  findAllInstHead,
  findByInstHead,
  modifyInstHead,
  removeInstHead,
  deleteInstCascade,
}
