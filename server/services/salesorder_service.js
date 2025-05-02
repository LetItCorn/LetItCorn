const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

const findAllSalesOrders = async () => {
    let list = await mariadb.query('selectSalesOrderList')
    .catch(err => console.error(err));
    return list;
};

module.exports = {
    findAllSalesOrders,
    // findSalesOrderByCode,
    // addSalesOrder,
    // updateSalesOrderInfo,
    // removeSalesOrder
}

