const mariadb = require("../database/mapper.js");
const dayjs = require("dayjs");

const findByInst = async (instNo) => {
  let list = await mariadb.query("selectInst", instNo);
  return list;
};

const getLastNumberFromResult = (rows, field, prefix) => {
  if (!Array.isArray(rows) || rows.length === 0 || !rows[0][field]) return 1;
  const lastCode = rows[0][field];
  const lastNumber = parseInt(lastCode.replace(prefix, ""), 10);
  return isNaN(lastNumber) ? 1 : lastNumber + 1;
};

// 생산지시 번호 생성(inst)
const getNextInstNo = async (conn) => {
  const today = dayjs().format("YYMMDD");
  const prefix = `PIN${today}`;
  const rows = await conn.query(
    `SELECT inst_no FROM inst WHERE inst_no LIKE ? ORDER BY inst_no DESC LIMIT 1 FOR UPDATE`,
    [`${prefix}%`]
  );
  const nextNo = getLastNumberFromResult(rows, "inst_no", prefix);
  return `${prefix}${String(nextNo).padStart(2, "0")}`;
};
// 생산지시 번호 생성 (inst_head)
const getNextInstHead = async (conn) => {
  const today = dayjs().format("YYMMDD");
  const prefix = `PIHN${today}`;
  const rows = await conn.query(
    `SELECT inst_head FROM inst_header WHERE inst_head LIKE ? ORDER BY inst_head DESC LIMIT 1 FOR UPDATE`,
    [`${prefix}%`]
  );
  const nextNo = getLastNumberFromResult(rows, "inst_head", prefix);
  return `${prefix}${String(nextNo).padStart(2, "0")}`;
};
// LOT 번호 생성
const getNextLotNo = async (conn) => {
  const today = dayjs().format("YYMMDD");
  const prefix = `LOT${today}`;
  const rows = await conn.query(
    `SELECT lot_cnt FROM inst WHERE lot_cnt LIKE ? ORDER BY lot_cnt DESC LIMIT 1 FOR UPDATE`,
    [`${prefix}%`]
  );
  const nextNo = getLastNumberFromResult(rows, "lot_cnt", prefix);
  return `${prefix}${String(nextNo).padStart(2, "0")}`;
};

// 수기작성용 가상 계획번호 생성기
const getManualPlanHead = async (conn, prefix = "PMAN") => {
  let date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  let base = `${prefix}${date}`;
  let result = await conn.query(
    `SELECT COUNT(*) AS count FROM plan_header WHERE plans_head LIKE ?`,
    [`${base}%`]
  );
  const count = result[0].count + 1;
  return `${base}${String(count).padStart(2, "0")}`;
};

// 등록
const registerInst = async ({ header, details }) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    const grouped = {};
    for (const row of details) {
      const key = row.plans_head || "manual";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    }
    // 1. 수기 계획번호 생성 (없을 때만)
    for (const [plansHeadKey, rows] of Object.entries(grouped)) {
      let plansHead = plansHeadKey === "manual" ? null : plansHeadKey;

      if (!plansHead) {
        plansHead = await getManualPlanHead(conn);
        const first = rows[0];
        await conn.query(
          `INSERT INTO plan_header (plans_head, plan_start, plan_end, plan_stat, plans_reg, planer)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            plansHead,
            first.plan_start,
            first.plan_end,
            "K02",
            first.plan_start,
            header.inster || "관리자",
          ]
        );
      }

      // 2. inst_head 생성
      const instHead = await getNextInstHead(conn);
      const instStart = new Date(rows[0].plan_start).toISOString().slice(0, 10);

      await conn.query(
        `INSERT INTO inst_header (inst_head, inst_start, inst_stat, plans_head, inster)
       VALUES (?, ?, ?, ?, ?)`,
        [instHead, instStart, "J01", plansHead, header.inster || "관리자"]
      );

      // 3. 지시 상세 등록
      for (const row of rows) {
        const instNo = await getNextInstNo(conn);
        const lotNo = await getNextLotNo(conn);

        await conn.query(
          `INSERT INTO inst (
          inst_no, lot_cnt, plans_vol, iord_no, process_header, out_od,
          inst_head, item_code, item_name, ins_stat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            instNo,
            lotNo,
            row.plans_vol,
            row.iord_no,
            row.process_header,
            row.out_od || "N",
            instHead,
            row.item_code || "",
            row.item_name || "",
            "J01",
          ]
        );
      }

      // 4. 계획 상태 업데이트
      await conn.query(
        `UPDATE plan_header SET plan_start = ?, plan_end = ?, plan_stat = ? WHERE plans_head = ?`,
        [rows[0].plan_start, rows[0].plan_end, "K02", plansHead]
      );
    }

    await conn.commit();
    return { success: true };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("생산지시 트랜잭션 오류:", err.sqlMessage || err.message);
    console.error("SQL:", err.sql || "알 수 없는 위치");
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const modifyInst = async (instNo, instInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // plans_head가 없으면 inst 테이블에서 조회
    if (!instInfo.plans_head) {
      const [row] = await conn.query(
        `SELECT ih.plans_head 
         FROM inst i
         JOIN inst_header ih ON i.inst_head = ih.inst_head
         WHERE i.inst_no = ?`,
        [instNo]
      );
      if (!row) throw new Error("plans_head 조회 실패");
      instInfo.plans_head = row.plans_head;
    }
    // inst 테이블 수정
    await conn.query(
      `UPDATE inst 
       SET lot_cnt = ?, item_name = ?, iord_no = ?, process_header = ?, out_od = ? 
       WHERE inst_no = ?`,
      [
        instInfo.lot_cnt,
        instInfo.item_name,
        instInfo.iord_no,
        instInfo.process_header,
        instInfo.out_od,
        instNo,
      ]
    );
    // plan_header 날짜 동기화 (문자열 -> DATE 강제 변환)
    if (instInfo.plans_head) {
      await conn.query(
        `UPDATE plan_header 
         SET plan_start = STR_TO_DATE(?, '%Y-%m-%d'), 
             plan_end = STR_TO_DATE(?, '%Y-%m-%d') 
         WHERE plans_head = ?`,
        [instInfo.plan_start, instInfo.plan_end, instInfo.plans_head]
      );
      // inst_header 날짜 동기화 (문자열 -> DATE 강제 변환)
      await conn.query(
        `UPDATE inst_header 
         SET inst_start = STR_TO_DATE(?, '%Y-%m-%d') 
         WHERE inst_head = (SELECT inst_head FROM inst WHERE inst_no = ?)`,
        [instInfo.plan_start, instNo]
      );
    }
    await conn.commit();
    return {
      isUpdated: true,
      instInfo,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
const removeInst = async (instNo) => {
  let result = await mariadb.query("deleteInst", instNo);
  return result;
};

module.exports = {
  findByInst,
  registerInst,
  modifyInst,
  removeInst,
  getNextInstHead,
  getNextInstNo,
  getNextLotNo,
};
