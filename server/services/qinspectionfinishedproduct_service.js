const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// finishedproduct 앞에 q를 붙였습니다.

// J04 생산완료 전체 조회
const findAllQFinishedProduct = async () => {
    let list = await mariadb.query('selectQFinishedProductList')
        .catch(err => console.error(err));
    return list;
};

// 품질 검사 항목 리스트 조회
const inspectionQFProductList = async () => {
    let list = await mariadb.query('InspectionFProductList')
        .catch(err => console.error(err));
    return list;
}

module.exports = {
    findAllQFinishedProduct,
    inspectionQFProductList
};