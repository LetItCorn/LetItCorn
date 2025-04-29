// ==== services/material_service.js ==== 
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 전체 자재 목록 조회
const findAllMaterials = async () => {
    return await mariadb.query('selectMaterialList')
    .catch(err => { console.error(err); return []; });
};

// 단건 조회
const findMaterialByCode = async (code) => {
    let list = await mariadb.query('selectMaterialOne', code)
    .catch(err => { console.error(err); return []; });
    return list[0] || null;
};

// 자재 등록
const addMaterial = async (materialInfo) => {
    const cols = ['mater_code','mater_name','mater_unit','safe_stock','mater_storage'];
    const data = convertObjToAry(materialInfo, cols);
    let res = await mariadb.query('insertMaterial', data)
    .catch(err => { console.error(err); return null; });
    return { isSuccess: res && res.affectedRows > 0 };
};

// 자재 수정
const updateMaterialInfo = async (code, materialInfo) => {
    let res = await mariadb.query('updateMaterial', [materialInfo, code])
    .catch(err => { console.error(err); return null; });
    return { isUpdated: res && res.affectedRows > 0 };
};

// 자재 삭제
const removeMaterial = async (code) => {
    let res = await mariadb.query('deleteMaterial', code)
    .catch(err => { console.error(err); return null; });
    return { isDeleted: res && res.affectedRows > 0 };
};

module.exports = {
    findAllMaterials,
    findMaterialByCode,
    addMaterial,
    updateMaterialInfo,
    removeMaterial
};
