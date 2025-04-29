// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
// 에시 const books = require('./sqls/books.js');
const plans = require('./sqls/plans.js');
const plan = require('./sqls/plan.js');
const inst = require('./sqls/inst.js');
const instH = require('./sqls/instHead.js');
const qcLog = require('./sqls/pQcLog.js');
const prLogDt = require('./sqls/prLogDt.js');
const prLog = require('./sqls/processLog.js');
const testQc = require('./sqls/testQc.js');
//const products = require('./sqls/products.js');
const items = require('./sqls/items.js');
const users = require('./sqls/user.js');
const boms = require('./sqls/boms.js');
const materials = require('./sqls/materials.js'); 
const lotInventory  = require('./sqls/lot_inventory.js');
const purchaseorders = require('./sqls/purchaseorders.js');
const inboundOut  = require('./sqls/inbound_outbound.js');
const materialOrders = require('./sqls/material_orders.js');
const materialOrderDetail= require('./sqls/material_order_details.js');
const outboundCandidates = require('./sqls/outbound_candidates.js');
const materialQCList  = require('./sqls/material_qc.js');
const materialQCInput = require('./sqls/material_qc_input.js');

module.exports = {
  // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
  ...plans,
  ...plan,
  ...inst,
  ...instH,
  ...qcLog,
  ...prLogDt,
  ...prLog,
  ...testQc,
  //...products,
  ...items,
  ...users,
  ...boms,
    ...materials,
    ...lotInventory,
    ...purchaseorders,
    ...inboundOut,
    ...materialOrders,
    ...materialOrderDetail,
    ...outboundCandidates,
    ...materialQCList,
    ...materialQCInput,
}
