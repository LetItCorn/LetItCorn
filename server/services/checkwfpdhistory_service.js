const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

const findAllQFProductHistory = async () => {
    let list = await mariadb.query('selectProductHistory')
        .catch(err => console.error(err));
    return list;
};


module.exports = {
    findAllQFProductHistory,
    
};