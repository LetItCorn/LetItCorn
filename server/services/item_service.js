// server/services/item_service.js

const mariaDB = require('../database/mapper.js');

// 1) 품목 전체조회 + 조건검색
//    filters: { code: string, name: string, type: string }
const findItems = async (filters = {}) => {
  const code = filters.code || '';
  const name = filters.name || '';
  const type = filters.type || '';
  const params = [code, code, name, name, type, type];
  try {
    return await mariaDB.query('itemList', params);
  } catch (err) {
    console.error('findItems error', err);
    return [];
  }
};

// 품목구분(공통코드 CC) 가져오기
const itemCode = async () => {
  try {
    return await mariaDB.query('itemCode');
  } catch (err) {
    console.error('itemCode error', err);
    return [];
  }
};

// 단위코드(공통코드 UU) 가져오기
const unitCode = async () => {
  try {
    return await mariaDB.query('unitCode');
  } catch (err) {
    console.error('unitCode error', err);
    return [];
  }
};

// 1-a) 품목 코드 단독 조회
const findItemsByCode = async (code) => {
  try {
    return await mariaDB.query('itemListByCode', [code]);
  } catch (err) {
    console.error('findItemsByCode error', err);
    return [];
  }
};

// 1-b) 품목 명칭 단독 조회
const findItemsByName = async (name) => {
  try {
    return await mariaDB.query('itemListByName', [name]);
  } catch (err) {
    console.error('findItemsByName error', err);
    return [];
  }
};

// 1-c) 품목 타입 단독 조회
const findItemsByType = async (type) => {
  try {
    return await mariaDB.query('itemListByType', [type]);
  } catch (err) {
    console.error('findItemsByType error', err);
    return [];
  }
};

// 2) 품목 단건조회
const findByItem = async (itemCode) => {
  try {
    const rows = await mariaDB.query('itemInfo', [itemCode]);
    return rows[0] || null;
  } catch (err) {
    console.error('findByItem error', err);
    return null;
  }
};

// 3) 품목 등록/수정 (MERGE)
const saveItem = async (item) => {
  // codeList → type_name 세팅
  const codeList = await itemCode();
  item.type_name = (codeList.find(c => c.code_values === item.item_type) || {}).code_name || '';
  // unitList → spec 세팅
  const unitList = await unitCode();
  item.spec = (unitList.find(u => u.code_values === item.unit_code) || {}).code_name || '';

  const params = [
    item.item_code,
    item.item_name,
    item.item_type,
    item.unit_code,
    item.spec,
    item.qty,
    item.type_name
  ];

  try {
    return await mariaDB.query('itemInsert', params);
  } catch (err) {
    console.error('saveItem error', err);
    throw err;
  }
};

// 4) 품목 삭제
const deleteItem = async (itemCode) => {
  try {
    let res = await mariaDB.query('itemDelete', [itemCode]);
    let result = await mariaDB.query('flowsDelete', [itemCode]);
    if (res.affectedRows > 0 && result.affectedRows > 0) {
      return { success: true, message: '품목 삭제 성공' };
    } else {
      return { success: false, message: '품목 삭제 실패' };
    }
  } catch (err) {
    console.error('deleteItem error', err);
    throw err;
  }
};

// =====================================================================

// 5) 공정 흐름 리스트 (특정 품목)
const itemProcessFlowsList = async (itemCode) => {
  try {
    return await mariaDB.query('itemProcessFlowsList', [itemCode]);
  } catch (err) {
    console.error('itemProcessFlowsList error', err);
    return [];
  }
};

// 6) 전체 공정 목록
const processesList = async () => {
  try {
    return await mariaDB.query('processesList');
  } catch (err) {
    console.error('processesList error', err);
    return [];
  }
};

// 7) 공정 흐름 등록/수정 (MERGE) — flows: Array<{ process_code, sequence_order, item_code }>
const saveProcessFlows = async (flows) => {
  try {
    // 7-a) 새 process_header 생성
    const headerRows = await mariaDB.query('getNextProcessHeader');
    const nextPh = headerRows[0]?.next_ph;
    if (!nextPh) throw new Error('Failed to generate process_header');

    // 7-b) 각 흐름을 MERGE
    for (const flow of flows) {
      const params = [
        nextPh,
        flow.process_code,
        flow.sequence_order,
        flow.item_code
      ];
      await mariaDB.query('insertProcessItem', params);
    }

    return { success: true, process_header: nextPh };
  } catch (err) {
    console.error('saveProcessFlows error', err);
    throw err;
  }
};

// 8) 공정 흐름 삭제
//    input: { process_header, item_code, sequence_order }
const deleteProcessItem = async ({ process_header, item_code, sequence_order }) => {
  try {
    return await mariaDB.query('deleteProcessItem', [
      process_header,
      item_code,
      sequence_order
    ]);
  } catch (err) {
    console.error('deleteProcessItem error', err);
    throw err;
  }
};

module.exports = {
  findItems,
  itemCode,
  unitCode,
  findItemsByCode,
  findItemsByName,
  findItemsByType,
  findByItem,
  saveItem,
  deleteItem,

  itemProcessFlowsList,
  processesList,
  saveProcessFlows,
  deleteProcessItem,
};
