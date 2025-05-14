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
    let { sorderCode, clientName, clientMgr, itemName, sorderCount, deliveryDate } = conditions;
    
    // 기본값 처리
    sorderCode = sorderCode || '';
    clientName = clientName || '';
    clientMgr = clientMgr || '';
    itemName = itemName || '';
    sorderCount = sorderCount || '';
    deliveryDate = deliveryDate || '';
    
    let orders = await mariadb.query('selectSalesOrderOne', [sorderCode, clientName, clientMgr, itemName, sorderCount, deliveryDate])
        .catch(err => console.error(err));
    return orders;
};

// 주문서 수정
const updateSalesOrderInfo = async (sorderCode, updateData) => {

    const allowedFields = {
        sorder_count : updateData.sorder_count,
        delivery_date : updateData.delivery_date,
    };

    const filteredData = {};
    Object.entries(allowedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            filteredData[key] = value;
        }
    });

    let data = [filteredData, sorderCode];
    
    let resInfo = await mariadb.query('updateSalesOrder', data).catch(err => {
                    console.error(err);
                    throw err;
    });

    result = null;

    if (resInfo.affectedRows > 0) {
        updateData.sordercode = sorderCode;
        console.log('성공');
        result = {
            isUpdated: true,
            message: '주문서가 수정되었습니다.',
            data: {...filteredData, sorder_code: sorderCode}
        };
    } else {
        console.log('실패');
        result = {
            isUpdated: false,
            message: '주문서 수정에 실패했습니다.',
        };
    }
    
    return result;
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
    updateSalesOrderInfo,
    removeSalesOrder,
    findAllClients,
    findAllItems,
    findSalesOrdersBySort
};
