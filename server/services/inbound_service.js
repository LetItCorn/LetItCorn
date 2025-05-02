const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 전체 입고 이력 조회
async function findAllInbounds() {
  return await mariadb.query('selectInboundList');
}

// 입고 등록
async function addInbound(inboundInfo) {
  // 컬럼 순서대로 배열 생성
  const cols = [
    'min_id','mater_code','min_qty','min_date','min_checker',
    'mater_lot','min_edate','min_stock','min_oqty','test_no'
  ];
  const data = convertObjToAry(inboundInfo, cols);
  const res = await mariadb.query('insertInbound', data);
  return { isSuccess: res && res.affectedRows > 0 };
}

module.exports = {
  findAllInbounds,
  addInbound
};