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
const equipment = require('./sqls/equipment.js');
const processes = require('./sqls/processes.js');
const defectCodes = require('./sqls/defect_codes.js');
const commonCodes = require('./sqls/common_codes.js');
const employees = require('./sqls/employees.js');
const materials = require('./sqls/materials.js'); 
const lotInventory  = require('./sqls/lot_inventory.js');
const purchaseorders = require('./sqls/purchaseorders.js');
const materialOrderDetail= require('./sqls/material_order_details.js');
const materialQCList  = require('./sqls/material_qc.js');
const materialQCInput = require('./sqls/material_qc_input.js');
const mOrder = require('./sqls/m_order.js');
const mInbound = require('./sqls/mInbound.js');
const modal = require('./sqls/modal.js');
const salesorder = require('./sqls/salesorder.js');
<<<<<<< HEAD
const Insertsorder = require('./sqls/Insertsalesorder.js');
=======
const qcInspections = require('./sqls/qcInspections.js');
const mOutbound        = require('./sqls/mOutbound.js');
const mOrderDetail = require('./sqls/m_order_detail.js');
const mOrderDetailIn = require('./sqls/m_order_detail_insert.js');
const qcHistory = require('./sqls/qcHistory.js');
const mReturns = require('./sqls/m_returns.js');
const materialStock = require('./sqls/materials_stock.js');
const outboundPicking = require('./sqls/mOutboundPicking.js');
const outboundCandidates = require('./sqls/outbound_candidates.js');
>>>>>>> 59554fbb8935f69576135f3b992c06f70eafd19f

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
  ...equipment,
  ...processes,
  ...defectCodes,
  ...commonCodes,
  ...employees,
<<<<<<< HEAD
    ...materials,
    ...lotInventory,
    ...purchaseorders,
    ...materialOrderDetail,
    ...materialQCList,
    ...materialQCInput,
    ...mOrder,
    ...mInbound,
    ...modal,
      ...salesorder,
      ...Insertsorder,
=======
  ...materials,
  ...lotInventory,
  ...purchaseorders,
  ...materialOrderDetail,
  ...materialQCList,
  ...materialQCInput,
  ...mOrder,
  ...mInbound,
  ...modal,
  ...salesorder,
  ...qcInspections,
  ...mOutbound,
  ...mOrderDetail,
  ...mOrderDetailIn,
  ...qcHistory,
  ...mReturns,
  ...materialStock,
  ...outboundPicking,
  ...outboundCandidates,
>>>>>>> 59554fbb8935f69576135f3b992c06f70eafd19f
}
