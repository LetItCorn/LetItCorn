// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
// 에시 const books = require('./sqls/books.js');
const plans = require('./sqls/plans.js');
const plan = require('./sqls/plan.js');
const inst = require('./sqls/inst.js');
const instH = require('./sqls/instHead.js');
const instM = require('./sqls/inst_modal.js');
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
const Insertsorder = require('./sqls/Insertsalesorder.js');
const qcInspections = require('./sqls/qcInspections.js');
const mOutbound        = require('./sqls/mOutbound.js');
const mOrderDetail = require('./sqls/m_order_detail.js');
const mOrderDetailIn = require('./sqls/m_order_detail_insert.js');
const qcHistory = require('./sqls/qcHistory.js');
const mReturns = require('./sqls/m_returns.js');
const materialStock = require('./sqls/materials_stock.js');
const outboundInst   = require('./sqls/outbound_candidates_inst.js');
const instructionSql = require('./sqls/instruction.js');
const instHeadersSql = require('./sqls/inst_headers.js');
const clients = require('./sqls/clients.js');
const sqt = require('./sqls/Insertsqt.js');
const customer = require('./sqls/customer.js');
const instructionsOpen = require('./sqls/instructions_open.js');
const materialmains = require('./sqls/materialmains.js');
const finishedproduct = require('./sqls/finishedproduct.js');
const checkwfpdhistory = require('./sqls/checkwfpdhistory.js');
const insertfproduct = require('./sqls/insertfinishedproduct.js');
const qinspectionfproduct = require('./sqls/qinspectionfinishedproduct.js');
const processLog = require('./sqls/prLog.js');
const semiOutbound   = require('./sqls/semi_outbound.js');
const semiQc = require('./sqls/semi_qc.js');
const semiInboundSql = require('./sqls/semi_inbound.js');
const semiProductSql = require('./sqls/semi_product.js');
const qcMgr = require('./sqls/qcMgr.js')



module.exports = {
  // 펼침연산자(spread operator, ...)을 활용해 객체의 필드를 다른 객체로 쉽게 복사
  ...plans,
  ...plan,
  ...inst,
  ...instH,
  ...instM,
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
  ...Insertsorder,
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
  ...outboundInst,
  ...instructionSql,
  ...instHeadersSql,
  ...clients,
  ...sqt,
  ...customer,
  ...instructionsOpen,
  ...materialmains,
  ...finishedproduct,
  ...checkwfpdhistory,
  ...insertfproduct,
  ...qinspectionfproduct,
  ...processLog,
  ...semiOutbound,
  ...semiQc,
  ...semiInboundSql,
  ...qcMgr,
}
