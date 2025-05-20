const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// 완제품 전체 조회
const findAllFinishedProduct = async () => {
    let list = await mariadb.query('selectFproductList')
        .catch(err => console.error(err));
    return list;
};

module.exports = {
    findAllFinishedProduct,
};