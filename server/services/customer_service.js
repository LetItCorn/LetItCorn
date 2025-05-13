const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// 거래처 전체 조회
const findAllCustomer = async () => {
    let list = await mariadb.query('selectCustomerList')
        .catch(err => console.error(err));
    return list;
};

module.exports = {
    findAllCustomer,
};