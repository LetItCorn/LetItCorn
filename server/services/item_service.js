// server/services/item_service.js

const mariaDB = require('../database/mapper.js');

// 1) 전체조회 + 조건검색
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

// 1-a) 코드 단독 조회
const findItemsByCode = async (code) => {
  const list = await mariaDB
    .query('itemListByCode', [code])
    .catch(err => {
      console.error('findItemsByCode error', err);
      return [];
    });
  return list;
};

// 1-b) 명칭 단독 조회
const findItemsByName = async (name) => {
  const list = await mariaDB
    .query('itemListByName', [name])
    .catch(err => {
      console.error('findItemsByName error', err);
      return [];
    });
  return list;
};

// 1-c) 타입 단독 조회
const findItemsByType = async (type) => {
  const list = await mariaDB
    .query('itemListByType', [type])
    .catch(err => {
      console.error('findItemsByType error', err);
      return [];
    });
  return list;
};

// 2) 단건조회
const findByItem = async (itemCode) => {
  const rows = await mariaDB
    .query('itemInfo', [itemCode])
    .catch(err => {
      console.error('findByItem error', err);
      return [];
    });
  return rows[0] || null;
};

// 3) 등록
const createItem = async (item) => {
  const params = [
    item.item_code,
    item.item_name,
    item.item_type,
    item.unit_code,
    item.spec
  ];
  const result = await mariaDB
    .query('itemInsert', params)
    .catch(err => {
      console.error('createItem error', err);
      throw err;
    });
  return result;
};

// 4) 수정
const updateItem = async (item) => {
  const params = [
    item.item_name,
    item.item_type,
    item.unit_code,
    item.spec,
    item.item_code
  ];
  const result = await mariaDB
    .query('itemUpdate', params)
    .catch(err => {
      console.error('updateItem error', err);
      throw err;
    });
  return result;
};

// 5) 삭제
const deleteItem = async (itemCode) => {
  const result = await mariaDB
    .query('itemDelete', [itemCode])
    .catch(err => {
      console.error('deleteItem error', err);
      throw err;
    });
  return result;
};


// 6) 품목공정 흐름도 조회
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


// 3) 등록
const saveProcessFlows = async (flows) => {
  const conn = await mariaDB.getConnection();
  await conn.beginTransaction();

  try {
    for (const flow of flows) {
      const { item_code, process_header, sequence_order } = flow;

      await conn.query(
        `INSERT INTO item_process_flows (item_code, process_header, sequence_order)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE process_header = VALUES(process_header)`,
        [item_code, process_header, sequence_order]
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
  findItemsByCode,
  findItemsByName,
  findItemsByType,
  findByItem,
  createItem,
  updateItem,
  deleteItem,
  itemProcessFlowsList,
  processesList,
  saveProcessFlows,
  deleteProcessItem,
};
