// server/database/sqls/equipment.js

// ── 장비(equipments) ───────────────────────────────
// 1) 전체조회 + 필터 검색 (equipment_code, equipment_name, equipment_type, manufacturer)
const equipmentList = `
  SELECT equipment_code
       , equipment_name
       , equipment_type
       , install_date
       , manufacturer
       , capacity
       , next_inspection_dt
       , is_suitable
  FROM equipments
  WHERE 1=1
    AND (? = '' OR equipment_code   LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR equipment_name   LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR equipment_type   = ?)
    AND (? = '' OR manufacturer     LIKE CONCAT('%', ?, '%'))
  ORDER BY equipment_code
`;

// 2) 단건조회 (equipment_code 기준)
const equipmentInfo = `
  SELECT equipment_code
       , equipment_name
       , equipment_type
       , install_date
       , manufacturer
       , capacity
       , next_inspection_dt
       , is_suitable
  FROM equipments
  WHERE equipment_code = ?
`;

// 3) 등록 (INSERT)
const equipmentInsert = `
  INSERT INTO equipments
    (equipment_code, equipment_name, equipment_type, install_date, manufacturer, capacity, next_inspection_dt, is_suitable)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

// 4) 수정 (UPDATE)
const equipmentUpdate = `
  UPDATE equipments
     SET equipment_name     = ?
       , equipment_type     = ?
       , install_date       = ?
       , manufacturer       = ?
       , capacity           = ?
       , next_inspection_dt = ?
       , is_suitable        = ?
   WHERE equipment_code = ?
`;

// 5) 삭제 (DELETE)
const equipmentDelete = `
  DELETE FROM equipments
   WHERE equipment_code = ?
`;


// ── 장비 점검 이력(equipment_inspections) ────────────────────
// 1) 목록조회: 특정 장비(equipment_code)의 점검 이력 전체
const inspectionList = `
  SELECT inspection_id
       , inspection_date
       , inspector_id
       , contents
       , result
       , equipment_code
  FROM equipment_inspections
  WHERE equipment_code = ?
  ORDER BY inspection_date DESC
`;

// 2) 단건조회 (inspection_id 기준)
const inspectionInfo = `
  SELECT inspection_id
       , inspection_date
       , inspector_id
       , contents
       , result
       , equipment_code
  FROM equipment_inspections
  WHERE inspection_id = ?
`;

// 3) 등록 (INSERT)
const inspectionInsert = `
  INSERT INTO equipment_inspections
    (inspection_id, inspection_date, inspector_id, contents, result, equipment_code)
  VALUES (?, ?, ?, ?, ?, ?)
`;

// 4) 수정 (UPDATE)
const inspectionUpdate = `
  UPDATE equipment_inspections
     SET inspection_date = ?
       , inspector_id    = ?
       , contents        = ?
       , result          = ?
   WHERE inspection_id = ?
`;

// 5) 삭제 (DELETE)
const inspectionDelete = `
  DELETE FROM equipment_inspections
   WHERE inspection_id = ?
`;

module.exports = {
  equipmentList,
  equipmentInfo,
  equipmentInsert,
  equipmentUpdate,
  equipmentDelete,

  inspectionList,
  inspectionInfo,
  inspectionInsert,
  inspectionUpdate,
  inspectionDelete
};
