const mariadb = require('../database/mapper.js');

// LOT 단위 자재 재고 조회
const findLotInventory = async () => {
  return await mariadb.query('selectLotInventory')
    .catch(err => { console.error(err); return []; });
};

module.exports = {
  findLotInventory
};
