// services/Insertsalesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 등록
const addSalesOrder = async (orderinfo) => {
    let insertOrder = [
        'sorder_code',
        'client_code',
        'item_code',
        'delivery_date',
        'sorder_count',
        'status',
        'emp_id'
    ];

    let data  = convertObjToAry(orderinfo, insertOrder);

    let resInfo = await mariadb.query('insertSalesOrder', data)
                                .catch(err => console.log(err));

    console.log('결과',resInfo);
    console.log('결과내용',resInfo.affectedRows);

    let result = null;

    if(resInfo.affectedRows > 0){
        console.log('성공');
        result = {
            isSuccessed : true,
            message : '주문서가 등록되었습니다.',
        };
    } else {
        console.log('실패');
        result = {
            isSuccessed : false,
            message : '주문서 등록에 실패했습니다.',
        };
    }
    return result;
};

module.exports = {
    addSalesOrder,
};