const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

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

// 품질 검사 결과 저장 및 상태 업데이트
const saveInspectionResult = async (payload) => {
    let conn;
    try {
        conn = await mariadb.getConnection();
        
        // 트랜잭션 시작
        await conn.beginTransaction();
        
        // 첫 번째 항목의 정보 추출
        const firstItem = payload[0];
        const mainInfo = {
            inst_no: firstItem.inst_no, // 지시 번호
            lot_cnt: firstItem.lot_cnt,
            process_code: firstItem.process_code || 'PC999',
            qc_date: firstItem.qc_date || new Date().toISOString().slice(0, 10),
            inspector: firstItem.inspector || 'unknown'
        };
        
        console.log('검사자 정보:', mainInfo.inspector);
        
        // 각 검사 항목에 대해 프로시저 호출
        for (const item of payload) {
            // 프로시저 파라미터 설정
            const params = [
                mainInfo.process_code, // str1: process_code
                item.test_no, // str2: item_code
                mainInfo.inspector, // str3: emp_id
                item.qc_result, // str4: qc_stat
                mainInfo.lot_cnt, // str5: lot_cnt
                item.unit_name || '', // str6: unit_name
                item.test_res // str7: res_log
            ];
            
            // INSERTQCLOG 프로시저 호출 - 각 항목마다 별도로 호출
            await conn.query('CALL INSERTQCLOG(?, ?, ?, ?, ?, ?, ?)', params);
            
            console.log(`항목 ${item.test_no} 저장 완료`);
        }
        
        // 상태 업데이트 및 재고 업데이트
        if (mainInfo.inst_no) {
            // 1. 지시 정보 가져오기
            const instResult = await conn.query(`
                SELECT i.item_code, i.iord_no, ih.inst_head
                FROM inst as i
                JOIN inst_header as ih
                    ON i.inst_head = ih.inst_head
                WHERE i.inst_no = ?
            `, [mainInfo.inst_no]);
            
            if (instResult && instResult.length > 0) {
                const { item_code, iord_no, inst_head } = instResult[0];
                
                console.log(`지시 정보: item_code=${item_code}, iord_no=${iord_no}, inst_head=${inst_head}`);
                
                // 2. inst 테이블에서 특정 LOT 번호만 상태 업데이트 (컬럼명 수정: inst_stat -> ins_stat)
                const updateInstResult = await conn.query(`
                    UPDATE inst
                    SET ins_stat = 'J05'
                    WHERE inst_no = ? AND lot_cnt = ?
                `, [mainInfo.inst_no, mainInfo.lot_cnt]);
                
                if (updateInstResult.affectedRows === 0) {
                    console.warn('업데이트할 inst 레코드를 찾을 수 없습니다:', mainInfo.inst_no, mainInfo.lot_cnt);
                } else {
                    console.log(`inst 상태 업데이트 완료: ins_stat = C01 (inst_no: ${mainInfo.inst_no}, lot_cnt: ${mainInfo.lot_cnt})`);
                    
                    // 3. finishedproduct 테이블의 current_stock 업데이트
                    await conn.query(`
                        UPDATE finishedproduct
                        SET current_stock = current_stock + ?
                        WHERE item_code = ?
                    `, [iord_no, item_code]);
                    
                    console.log(`재고 업데이트 완료: item_code=${item_code}, 추가 수량=${iord_no}`);
                }
            } else {
                console.warn(`지시 정보를 찾을 수 없습니다: inst_no=${mainInfo.inst_no}`);
            }
        } else {
            console.warn('inst_no가 제공되지 않아 상태 업데이트 및 재고 업데이트를 건너뜁니다.');
        }
        
        // 트랜잭션 커밋
        await conn.commit();
        
        console.log('모든 항목 저장 및 상태 업데이트 완료');
        
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