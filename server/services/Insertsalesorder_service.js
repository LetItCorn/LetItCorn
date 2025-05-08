// services/Insertsalesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 등록
const addSalesOrder = async (orderData) => {
    const { 
      sorderCode, 
      clientCode, // client_name 대신 clientCode
      itemCode, // item_name 대신 itemCode 
      deliveryDate,
      sorderCount,
      status = '계획됨', // 기본값 설정
      empId // warehouse_name은 제외
    } = orderData;
    
    await mariadb.query('insertSalesOrder', [
      sorderCode, 
      clientCode,
      itemCode, 
      deliveryDate,
      sorderCount,
      status,
      empId
    ]).catch(err => {
      console.error(err);
      throw err;
    });
    
    return { success: true, message: '주문서가 등록되었습니다.' };
  };

module.exports = {
    addSalesOrder,
};