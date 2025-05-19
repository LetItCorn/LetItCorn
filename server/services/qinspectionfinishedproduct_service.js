const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// finishedproduct 앞에 q를 붙였습니다.

// J04 생산완료 전체 조회
const findAllQFinishedProduct = async () => {
    let list = await mariadb.query('selectQFinishedProductList')
        .catch(err => console.error(err));
    return list;
};

// 품질 검사 항목 리스트 조회
const inspectionQFProductList = async () => {
    let list = await mariadb.query('InspectionFProductList')
        .catch(err => console.error(err));
    return list;
}

// 품질 검사 결과 저장 - INSERTQCLOG 프로시저를 각 항목마다 별도로 호출
const saveInspectionResult = async (payload) => {
    let conn;
    try {
        conn = await mariadb.getConnection();
        
        // 트랜잭션 시작
        await conn.beginTransaction();
        
        // 첫 번째 항목의 정보 추출
        const firstItem = payload[0];
        const mainInfo = {
            inst_no: firstItem.inst_no,
            lot_cnt: firstItem.lot_cnt,
            process_code: firstItem.process_code || 'PC999',
            qc_date: firstItem.qc_date || new Date().toISOString().slice(0, 10),
            inspector: firstItem.inspector || 'unknown'
        };
        
        // 각 검사 항목에 대해 프로시저 호출
        for (const item of payload) {
            // 프로시저 파라미터 설정
            const params = [
                mainInfo.process_code, // str1: process_code
                item.test_no, // str2: item_code
                mainInfo.inspector, // str3: emp_id
                item.qc_result, // str4: qc_stat
                mainInfo.lot_cnt, // str5: lot_cnt
                item.unit || '', // str6: unit
                item.test_res // str7: res_log
            ];
            
            // INSERTQCLOG 프로시저 호출 - 각 항목마다 별도로 호출
            await conn.query('CALL INSERTQCLOG(?, ?, ?, ?, ?, ?, ?)', params);
        }
        
        // 트랜잭션 커밋
        await conn.commit();
        
        return { success: true, message: '검사 결과가 저장되었습니다.' };
    } catch (err) {
        // 오류 발생 시 롤백
        if (conn) {
            await conn.rollback();
        }
        console.error('검사 결과 저장 중 오류:', err);
        throw err;
    } finally {
        // 연결 반환
        if (conn) {
            conn.release();
        }
    }
};

module.exports = {
    findAllQFinishedProduct,
    inspectionQFProductList,
    saveInspectionResult
};