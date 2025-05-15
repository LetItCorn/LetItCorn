const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require("../utils/converts.js");

const findByInst = async (instNo) => {
  let list = await mariadb.query("selectInst", instNo);
  return list;
};

// 생산지시 번호 생성(inst)
const getNextInstNo = async (conn, prefix = "PIN") => {
  let date = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // yymmdd
  let base = `${prefix}${date}`;
  let result = await conn.query(
    `SELECT COUNT(*) AS count FROM inst WHERE inst_no LIKE ?`,
    [`${base}%`]
  );
  const count = result[0].count + 1;
  return `${base}${String(count).padStart(2, "0")}`;
};

// 생산지시 번호 생성 (inst_head)
const getNextInstHead = async (conn, prefix = "PIHN") => {
  let date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  let base = `${prefix}${date}`;
  let result = await conn.query(
    `SELECT COUNT(*) AS count FROM inst_header WHERE inst_head LIKE ?`,
    [`${base}%`]
  );
  let count = result[0].count + 1;
  return `${base}${String(count).padStart(2, "0")}`;
};
// LOT 번호 생성
const getNextLotNo = async (conn, prefix = "LOT") => {
  let date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  let base = `${prefix}${date}`;
  let result = await conn.query(
    `SELECT COUNT(*) AS count FROM inst WHERE lot_cnt LIKE ?`,
    [`${base}%`]
  );
  let count = result[0].count + 1;
  return `${base}${String(count).padStart(3, "0")}`;
};

//등록
const registerInst = async ({ header, details }) => {
  let conn;
  try {
    conn = await mariadb.getConnection(); // 커넥션 생성
    await conn.beginTransaction(); // 트랜잭션 시작

    // 1. 지시 헤더번호 생성
    let instHead = await getNextInstHead(conn);
    const startDate = new Date(details[0].plan_start)
      .toISOString()
      .slice(0, 10);
    //const endDate = new Date(details[0].plan_end).toISOString().slice(0, 10);

    // 2. 지시 헤더 등록
    await conn.query(
      `INSERT INTO inst_header (inst_head, inst_start, inst_stat, plans_head, inster)
       VALUES (?, ?, ?, ?, ?)`,
      [
        instHead,
        startDate,
        "J01", // 지시 상태코드 (J01 = 대기)
        header.plans_head,
        header.inster || "관리자",
      ]
    );
    console.log(mariadb.query);

    // 3. 선택된 plan 상세 목록 루프
    for (let row of details) {
      let instNo = await getNextInstNo(conn);
      let lotNo = await getNextLotNo(conn);
      console.log(mariadb.query);
      // 3-1. 지시 디테일 등록
      await conn.query(
        `INSERT INTO inst (inst_no, lot_cnt, plans_vol, iord_no, process_header, out_od, inst_head, item_code, item_name, ins_stat)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          instNo,
          lotNo,
          row.plans_vol,
          row.iord_no,
          row.process_header,
          row.out_od,
          instHead,
          row.item_code,
          "J01",
        ]
      );
      console.log(mariadb.query);

      // 3-2. 해당 계획(plan_header) 상태 "진행중(K02)", 공정 시작, 종료날짜 를 변경
      await conn.query(
        `UPDATE plan_header SET plan_start = ?, plan_end = ?,plan_stat = ? WHERE plans_head = ?`,
        [header.plan_start, header.plan_end, "K02", header.plans_head]
      );
      console.log(mariadb.query);
    }

    await conn.commit(); // 정상 수행 시 커밋
    return { success: true };
  } catch (err) {
    if (conn) await conn.rollback(); // 에러 시 롤백
    console.error("생산지시 트랜잭션 오류:", err);
    throw err;
  } finally {
    if (conn) conn.release(); // 커넥션 해제
  }
};
//수정
const modifyInst = async (instNo, instInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // plans_head가 안나와서 inst 테이블에서 땡겨오기용
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
    // inst 테이블 업데이트
    const data = [
      instInfo.lot_cnt,
      instInfo.process_header,
      instInfo.out_od,
      instNo,
    ];
    const resInst = await conn.query(
      "UPDATE inst SET lot_cnt = ?, process_header = ?, out_od = ? WHERE inst_no = ?",
      data
    );
    // plan_header 날짜 업데이트
    await conn.query(
      `
      UPDATE plan_header
      SET plan_start = ?, plan_end = ?
      WHERE plans_head = ?
    `,
      [instInfo.plan_start, instInfo.plan_end, instInfo.plans_head]
    );
    
    //inst_header도 plan_start와 맞춰서 inst_start 동기화
    await conn.query(
      `UPDATE inst_header
       SET inst_start = ?
       WHERE inst_head = (
         SELECT i.inst_head
         FROM inst i
         WHERE i.inst_no = ?
       )`,
      [instInfo.plan_start, instNo]
    );

    await conn.commit();

    return {
      isUpdated: resInst.affectedRows > 0,
      instInfo,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
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
