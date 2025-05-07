// services/salesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 전체 조회
const findAllSalesOrders = async () => {
    let list = await mariadb.query('selectSalesOrderList')
        .catch(err => console.error(err));
    return list;
};

// 주문서 코드로 조회
const findSalesOrderByCode = async (orderCode) => {
    let order = await mariadb.query('selectSalesOrderOne', ['', orderCode, '', '', ''])
        .catch(err => console.error(err));
    return order[0]; // 단일 결과 반환
};

// 주문서 검색 조건별 조회
const findSalesOrdersByCondition = async (conditions) => {
    let { deliveryDate, orderCode, clientName, itemName, clientMgr } = conditions;
    
    // 기본값 처리
    deliveryDate = deliveryDate || '';
    orderCode = orderCode || '';
    clientName = clientName || '';
    itemName = itemName || '';
    clientMgr = clientMgr || '';
    
    let orders = await mariadb.query('selectSalesOrderOne', [deliveryDate, orderCode, clientName, itemName, clientMgr])
        .catch(err => console.error(err));
    return orders;
};

// 주문서 수정
const updateSalesOrderInfo = async (orderCode, updateData) => {
    const { 
        clientName, 
        itemName, 
        deliveryDate, 
        sorderCount, 
        status
    } = updateData;
    
    await mariadb.query('updateSalesOrder', [
        clientName, 
        itemName, 
        deliveryDate, 
        sorderCount, 
        status, 
        orderCode
    ]).catch(err => {
        console.error(err);
        throw err;
    });
    
    return { success: true, message: '주문서가 수정되었습니다.' };
};

// 주문서 삭제
const removeSalesOrder = async (orderCode) => {
    await mariadb.query('deleteSalesOrder', [orderCode])
        .catch(err => {
            console.error(err);
            throw err;
        });
    
    return { success: true, message: '주문서가 삭제되었습니다.' };
};

// 거래처 목록 조회
const findAllClients = async () => {
    let clients = await mariadb.query('selectClientList')
        .catch(err => console.error(err));
    return clients;
};

// 품목 목록 조회
const findAllItems = async () => {
    let items = await mariadb.query('selectItemList')
        .catch(err => console.error(err));
    return items;
};

// 창고 목록 조회
const findAllWarehouses = async () => {
    let warehouses = await mariadb.query('selectWarehouseList')
        .catch(err => console.error(err));
    return warehouses;
};

// 정렬 기능
const findSalesOrdersBySort = async (sortType) => {
    let query;
    
    switch (sortType) {
        case 'delivery_date':
            query = 'selectSalesOrderByDeliveryDate';
            break;
        case 'sorder_code':
            query = 'selectSalesOrderBySorderCode';
            break;
        case 'client_name':
            query = 'selectSalesOrderByClientName';
            break;
        case 'item_name':
            query = 'selectSalesOrderByItemName';
            break;
        case 'client_mgr':
            query = 'selectSalesOrderByClientMgr';
            break;
        default:
            query = 'selectSalesOrderList';
    }
    
    let orders = await mariadb.query(query)
        .catch(err => console.error(err));
    return orders;
};

module.exports = {
    findAllSalesOrders,
    findSalesOrderByCode,
    findSalesOrdersByCondition,
    addSalesOrder,
    updateSalesOrderInfo,
    removeSalesOrder,
    findAllClients,
    findAllItems,
    findAllWarehouses,
    findSalesOrdersBySort
};
