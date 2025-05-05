const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const dayjs = require('dayjs');

const findByPlan = async (planNo) => {
     let list = await mariadb.query("selectPlansOne", planNo);
     return list;
    };

    const getNextPlanHead = async (conn, today) => {
      const [result] = await conn.query(
        `SELECT COUNT(*) AS count FROM plan_header WHERE plans_head LIKE ?`,
        [`PPHN${today}%`]
      );
      const count = result.count + 1;
      return `PPHN${today}${count.toString().padStart(2, "0")}`;
    };
    async function getNextPlanNo(conn, today) {
      const [row] = await conn.query(
        `SELECT COUNT(*) as count FROM plans WHERE plan_no LIKE ?`,
        [`PPN${today}%`]
      );
      return row.count;
    }    
const addNewPlan = async ({ header, details }) => {
      let conn = await mariadb.getConnection();
      await conn.beginTransaction();
    
      try {
        const today = dayjs().format("YYMMDD");        
        const planHead = await getNextPlanHead(conn, today);        
        const headerParams = [
          planHead,
          header.plan_start,
          header.plan_end,
          header.plan_stat || "K01",
          header.plans_reg || dayjs().format("YYYY-MM-DD"),
          header.planer || "관리자",
        ];    
        await conn.query(
          `INSERT INTO plan_header (plans_head, plan_start, plan_end, plan_stat, plans_reg, planer)
           VALUES (?, ?, ?, ?, ?, ?)`,
          headerParams
        );        
        let count = await getNextPlanNo(conn, today);    
        for (let i = 0; i < details.length; i++) {
          const planNo = `PPN${today}${(count + i + 1).toString().padStart(2, "0")}`;
          const item = details[i];    
          const values = [
            planNo,
            planHead,
            item.sorder_code,
            item.item_code,
            item.plans_vol,
            item.delivery_date,
            item.item_name,
          ];    
          await conn.query(
            `INSERT INTO plans (plan_no, plans_head, porder_seq, item_code, plans_vol, delivery_date, item_name)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            values
          );    
          await conn.query(
            `UPDATE salesorder SET status = '계획됨' WHERE sorder_code = ?`,
            [item.sorder_code]
          );
        }    
        await conn.commit();
        return { isSuccessed: true, message: "등록 성공" };    
      } catch (err) {
        await conn.rollback();
        console.error("❌ 등록 실패:", err);
        return { isSuccessed: false, message: "등록 실패", error: err };
      } finally {
        conn.release();
      }
    };
module.exports = {
  findByPlan,
  addNewPlan,
}
