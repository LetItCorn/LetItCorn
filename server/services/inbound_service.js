const { query, getConnection, selectedQuery } = require('../database/mapper.js');
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
async function addInbound(inboundInfo) {
    /**
    * 1단계) m_inbound INSERT
    * 2단계) INSERT 가 성공(affectedRows > 0)하면
     *        material.current_stock 을 누적 갱신
     */
  
    // insertInbound 에 들어갈 파라미터 순서 정의
    const cols = [
      'min_id','mater_code','min_qty','min_date','min_checker',
      'mater_lot','min_edate','min_stock','min_oqty','test_no'
    ];
    const data = convertObjToAry(inboundInfo, cols);
  
    // 1) 입고 기록 저장
    const ins = await mariadb.query('insertInbound', data);
    if (!(ins && ins.affectedRows > 0)) {
      return { isSuccess: false };
    }
  
    // 2) 자재 current_stock 누적 갱신
    await mariadb.query(
      'updateMaterialStock',
      [ inboundInfo.min_qty, inboundInfo.mater_code ]
    );
  
    return { isSuccess: true };
  }

module.exports = {
  findAllInbounds,
  addInbound
};
