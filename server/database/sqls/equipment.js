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

// 3) MERGE 등록 + 수정
const equipmentMerge = `
  INSERT INTO equipments (
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    capacity,
    next_inspection_dt,
    is_suitable
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    equipment_name     = VALUES(equipment_name),
    equipment_type     = VALUES(equipment_type),
    install_date       = VALUES(install_date),
    manufacturer       = VALUES(manufacturer),
    capacity           = VALUES(capacity),
    next_inspection_dt = VALUES(next_inspection_dt),
    is_suitable        = VALUES(is_suitable)
`;

// 4) 삭제
const equipmentDelete = `
  DELETE FROM equipments
   WHERE equipment_code = ?
`;

// 5) 다음 장비 코드 자동 생성 (EQ0001 → EQ0002)
const equipmentNextCode = `
  SELECT CONCAT('EQ', LPAD(
    IFNULL(MAX(CAST(SUBSTRING(equipment_code, 3) AS UNSIGNED)), 0) + 1,
    4, '0')
  ) AS next_code
  FROM equipments
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

// 3) MERGE 등록 + 수정
const inspectionMerge = `
  INSERT INTO equipment_inspections (
    inspection_id,
    inspection_date,
    inspector_id,
    contents,
    result,
    equipment_code
  ) VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    inspection_date = VALUES(inspection_date),
    inspector_id    = VALUES(inspector_id),
    contents        = VALUES(contents),
    result          = VALUES(result),
    equipment_code  = VALUES(equipment_code)
`;

// 4) 삭제
const inspectionDelete = `
  DELETE FROM equipment_inspections
   WHERE inspection_id = ?
`;

// 5) 다음 점검 ID 자동 생성 (IN0001 → IN0002)
const inspectionNextId = `
  SELECT CONCAT('IN', LPAD(
    IFNULL(MAX(CAST(SUBSTRING(inspection_id, 3) AS UNSIGNED)), 0) + 1,
    4, '0')
  ) AS next_id
  FROM equipment_inspections
`;


// ── 모듈 내보내기 ────────────────────────────────────────────
module.exports = {
  // 장비
  equipmentList,
  equipmentInfo,
  equipmentMerge,
  equipmentDelete,
  equipmentNextCode,   // ✅ 추가

  // 점검
  inspectionList,
  inspectionInfo,
  inspectionMerge,
  inspectionDelete,
  inspectionNextId     // ✅ 추가
};
