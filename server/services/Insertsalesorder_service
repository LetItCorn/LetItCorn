// services/Insertsalesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 등록
const addSalesOrder = async (orderData) => {
    const { 
        sorderCode, 
        clientName, 
        clientMgr, 
        itemName, 
        sorderCount, 
        warehouseName, 
        deliveryDate 
    } = orderData;
    
    await mariadb.query('insertSalesOrder', [
        sorderCode, 
        clientName, 
        clientMgr, 
        itemName, 
        sorderCount, 
        warehouseName, 
        deliveryDate
    ]).catch(err => {
        console.error(err);
        throw err;
    });
    
    return { success: true, message: '주문서가 등록되었습니다.' };
};