const mariadb = require('../database/mapper.js');
// 객체를 배열로 변환하는 유틸
const { convertObjToAry } = require('../utils/converts.js'); 

// 전체 입고 이력 조회
// -mapper.query를 통해 sqls/minbound의 selectInboundList 실행
// 결과(rows)를 그대로 반환
async function findAllInbounds() {
  // 'selectInboundList'는 mapper.js에 정의된 식별자(key)
  return await mariadb.query('selectInboundList');
}

// 단건 입고 등록
// @param {Object} inbound - 입고 정보 객체
// @returns {Object} 처리 결과 {isSuccess: boolean}
async function addInbound(inboundInfo) {
  // sql에 바인딩할 컬럼 순서를 정의 하는 변수
  const cols = [
    'min_id','mater_code','min_qty','min_date','min_checker',
    'mater_lot','min_edate','min_stock','min_oqty','test_no'
  ];

  // inboundInfo 객체를 cols 순서대로 배열로 변환
  const data = convertObjToAry(inboundInfo, cols);

  // mapper.query로 insertInbound 쿼리 실행 
  const res = await mariadb.query('insertInbound', data);

  // 영향 받은 행이 1이상이면 성공으로 간주
  return { isSuccess: res && res.affectedRows > 0 };
}
/**
 * 위의 코드의 정확한 흐름
 * 1. 클라이언트로부터 inboundInfo 객체 수신
 * 
 * 2. sql 바인딩 순서(cols) 정의
 * 
 * 3. convertObjToAry(inboundInfo, cols) 호출 -> data 배열 생성
 * 
 * 4. mariadb.query('insertInbound', data) 호출 -> insert 실행
 * 
 * 5. insert 결과(res) 수신
 * 
 * 6. res.affectedRows > 0 판단 -> isSuccess 결정
 * 
 * 7. {isSuccess} 객체 반환
 */


module.exports = {
  findAllInbounds,
  addInbound
};