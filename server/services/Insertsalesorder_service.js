// services/Insertsalesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 등록
const addSalesOrder = async (orderinfo) => {
    let insertOrder = [
        'sorder_code',
        'client_name',
        'client_mgr',
        'item_name',
        'delivery_date',
        'sorder_count',
        'status',
        'emp_id'
    ];

    let data  = convertObjToAry(orderinfo, insertOrder);

    let resInfo = await mariadb.query('insertSalesOrder', data)
                                .catch(err => console.log(err));

    let result = null;

    if(resInfo > 0){
        result = {
            isSuccessed : true,
        };
    } else {
        result = {
            isSuccessed : false,
        };
    }
    return result;
    
    //return { success: true, message: '주문서가 등록되었습니다.' };
};

module.exports = {
    addSalesOrder,
};