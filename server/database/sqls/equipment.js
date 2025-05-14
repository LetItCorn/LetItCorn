// server/database/sqls/equipment.js

/* ─────────────── 장비(equipments) ──────────────── */

/** 1) 전체조회 + 필터 검색
 *    - is_suitable_name : DD 그룹 공통코드명(사용/미사용) */
const equipmentList = `
  SELECT  e.equipment_code
        , e.equipment_name
        , e.equipment_type
        , e.install_date
        , e.manufacturer
        , e.unit_code
        , e.spec
        , e.qty
        , e.next_inspection_dt
        , e.is_suitable
        , ( SELECT code_name
              FROM common_codes c
             WHERE c.code_group  = 'DD'
               AND c.code_values = e.is_suitable
          ) AS is_suitable_name
  FROM equipments e
  WHERE 1=1
    AND (? = '' OR e.equipment_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR e.equipment_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR e.equipment_type = ?)
    AND (? = '' OR e.manufacturer   LIKE CONCAT('%', ?, '%'))
  ORDER BY e.equipment_code
`;

/** 2) 단건조회 (equipment_code) + 공통코드명 */
const equipmentInfo = `
  SELECT  e.equipment_code
        , e.equipment_name
        , e.equipment_type
        , e.install_date
        , e.manufacturer
        , e.unit_code
        , e.spec
        , e.qty
        , e.next_inspection_dt
        , e.is_suitable
        , ( SELECT code_name
              FROM common_codes c
             WHERE c.code_group  = 'DD'
               AND c.code_values = e.is_suitable
          ) AS is_suitable_name
  FROM equipments e
  WHERE e.equipment_code = ?
`;

/** 3) MERGE(INSERT + UPDATE) */
const equipmentMerge = `
  INSERT INTO equipments (
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    unit_code,
    spec,
    qty,
    next_inspection_dt,
    is_suitable
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    equipment_name     = VALUES(equipment_name),
    equipment_type     = VALUES(equipment_type),
    install_date       = VALUES(install_date),
    manufacturer       = VALUES(manufacturer),
    unit_code          = VALUES(unit_code),
    spec               = VALUES(spec),
    qty                = VALUES(qty),
    next_inspection_dt = VALUES(next_inspection_dt),
    is_suitable        = VALUES(is_suitable)
`;

/** 4) 삭제 */
const equipmentDelete = `
  DELETE FROM equipments
   WHERE equipment_code = ?
`;

/** 5) 다음 장비 코드 자동 생성 (EQ000001 → EQ000002) */
const equipmentNextCode = `
  SELECT CONCAT('EQ',
         LPAD(
           IFNULL(
             MAX(CAST(SUBSTRING(equipment_code, 3) AS UNSIGNED)), 0
           ) + 1, 6, '0')
         ) AS next_code
  FROM equipments
`;

/** 🔹 6) DD 그룹(사용/미사용) 코드 목록 - 셀렉트 박스용 */
const suitableCodeList = `
  SELECT code_values AS is_suitable
       , code_name   AS is_suitable_name
  FROM common_codes
  WHERE code_group = 'DD'
  ORDER BY code_rear
`;

/* ─────── 장비 점검 이력(equipment_inspections) ─────── */

/** 1) 특정 장비의 점검 이력 목록 */
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

/** 2) 단건조회 (inspection_id) */
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

/** 3) MERGE(INSERT + UPDATE) */
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

/** 4) 삭제 */
const inspectionDelete = `
  DELETE FROM equipment_inspections
   WHERE inspection_id = ?
`;

/** 5) 다음 inspection_id 자동 생성 (IN0001 → IN0002) */
const inspectionNextId = `
  SELECT CONCAT('IN',
         LPAD(
           IFNULL(
             MAX(CAST(SUBSTRING(inspection_id, 3) AS UNSIGNED)), 0
           ) + 1, 4, '0')
         ) AS next_id
  FROM equipment_inspections
`;

/* ──────────── 모듈 내보내기 ──────────── */
module.exports = {
  /* 장비 */
  equipmentList,
  equipmentInfo,
  equipmentMerge,
  equipmentDelete,
  equipmentNextCode,
  suitableCodeList,   // 🔹 추가 (DD 그룹 목록)

  /* 점검 */
  inspectionList,
  inspectionInfo,
  inspectionMerge,
  inspectionDelete,
  inspectionNextId
};
