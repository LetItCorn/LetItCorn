// server/services/item_service.js

const mariaDB = require('../database/mapper.js');

// 1) 품목 전체조회 + 조건검색
//    filters: { code: string, name: string, type: string }
const findItems = async (filters = {}) => {
  // 기본 빈 문자열로 초기화해야 SQL에서 (? = '' OR ...) 구문이 동작합니다
  const code = filters.code || '';
  const name = filters.name || '';
  const type = filters.type || '';

  // itemList 쿼리에 파라미터 순서대로 전달
  const params = [code, code, name, name, type, type];
  const list = await mariaDB
    .query('itemList', params)
    .catch(err => {
      console.error('findItems error', err);
      return [];
    });
  return list;
};

// 품목구분 가져오기
const itemCode = async () => {
  const code = await mariaDB
  .query('itemCode')
  .catch(err => {
    console.error('itemCode error', err);
    return [];
  });
  return code;
};

// 단위코드 가져오기
const unitCode = async () => {
  const unit = await mariaDB
  .query('unitCode')
  .catch(err => {
    console.error('unitCode', err);
    return [];
  });
  return unit;
};

// 1-a) 품목 코드 단독 조회
const findItemsByCode = async (code) => {
  const list = await mariaDB
    .query('itemListByCode', [code])
    .catch(err => {
      console.error('findItemsByCode error', err);
      return [];
    });
  return list;
};

// 1-b) 품목 명칭 단독 조회
const findItemsByName = async (name) => {
  const list = await mariaDB
    .query('itemListByName', [name])
    .catch(err => {
      console.error('findItemsByName error', err);
      return [];
    });
  return list;
};

// 1-c) 품목 타입 단독 조회
const findItemsByType = async (type) => {
  const list = await mariaDB
    .query('itemListByType', [type])
    .catch(err => {
      console.error('findItemsByType error', err);
      return [];
    });
  return list;
};

// 2) 품목 단건조회
const findByItem = async (itemCode) => {
  const rows = await mariaDB
    .query('itemInfo', [itemCode])
    .catch(err => {
      console.error('findByItem error', err);
      return [];
    });
  return rows[0] || null;
};

// 3) 품목 등록/수정 (MERGE)
const saveItem = async (item) => {
  const params = [
    item.item_code,
    item.item_name,
    item.item_type,
    item.unit_code,
    item.spec,
    item.qty
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
  const result = await mariaDB
    .query('itemDelete', [itemCode])
    .catch(err => {
      console.error('deleteItem error', err);
      throw err;
    });
  return result;
};

// =================================================================

// 1) 공정 흐름도 조회
const itemProcessFlowsList = async (itemCode) => {  
  const list = await mariaDB
    .query('itemProcessFlowsList', [itemCode])
    .catch(err => {
      console.error('findItems error', err);
      return [];
    }); 
      
  return list;
};

const processesList = async () => {  
  
  const list = await mariaDB
    .query('processesList', [])
    .catch(err => {
      console.error('findItems error', err);
      return [];
    }); 
      
  return list;
};


// 2) 공정 흐름도 등록
const saveProcessFlows = async (flows) => {
  const conn = await mariaDB.getConnection();
  await conn.beginTransaction();

  try {
    for (const flow of flows) {
      const { item_code, process_header, sequence_order, duration } = flow;

      await conn.query(
        'insertProcessItem',
        [item_code, process_header, sequence_order, duration]
      );
    }

    await conn.commit();
    conn.release();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('saveProcessFlows error', err);
    throw err;
  }
};

// 3) 공정 흐름도 삭제 
const deleteProcessItem = async (req) => {  
  const { process_header, item_code, sequence_order } = req.body;    
  const list = await mariaDB
    .query('deleteProcessItem', [process_header,item_code,sequence_order])
    .catch(err => {
      console.error('findItems error', err);
      return [];
    }); 
      
  return list;
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
