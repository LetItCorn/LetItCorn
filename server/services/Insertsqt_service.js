// services/Insertsqt_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 전체 조회
const findAllSqt = async () => {
  let list = await mariadb.query('selectShipmentQuantity')
    .catch(err => console.error(err));
    return list;

};

module.exports = {
    findAllSqt,
};