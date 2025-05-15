// server/database/sqls/equipment.js
// =================================
//   설비(equipments) + 설비점검이력(equipment_inspections) SQL 정의
// =================================
/*------------------------------------------------------------------
  0) 공통코드 (추가: 적합여부 코드 DD)
------------------------------------------------------------------*/
const equipmentTypeCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'LL'   -- 설비유형
`;

const unitCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'UU'   -- 단위
`;

const suitableCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'DD'   -- 적합여부 (D01: 적합 / D02: 부적합 …)
`;

// ─────────────────────────────────────────────
//  1) 설비 전체조회 + 조건검색 (code, name, type)
// ─────────────────────────────────────────────
const equipmentList = `
  SELECT
    A.equipment_code,
    A.equipment_name,
    A.equipment_type,
    (SELECT code_name
       FROM common_codes T0
      WHERE T0.code_group = 'LL'
        AND T0.code_values = A.equipment_type
    ) AS type_name,
    A.install_date,
    A.manufacturer,
    A.next_inspection_dt,
    A.is_suitable,
    A.unit_code,
    (SELECT code_name
       FROM common_codes T1
      WHERE T1.code_group = 'UU'
        AND T1.code_values = A.unit_code
    ) AS unit_name,
    A.spec,
    A.qty
  FROM equipments A
  WHERE 1 = 1
    AND (? = '' OR A.equipment_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.equipment_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.equipment_type = ?)
  ORDER BY A.equipment_code
`;

// 1-a) 코드별 조회
const equipmentListByCode = `
  SELECT
    A.equipment_code,
    A.equipment_name,
    A.equipment_type,
    T.code_name AS type_name,
    A.install_date,
    A.manufacturer,
    A.next_inspection_dt,
    A.is_suitable,
    A.unit_code,
    U.code_name AS unit_name,
    A.spec,
    A.qty
  FROM equipments A
  LEFT JOIN common_codes T
    ON T.code_group = 'LL' AND T.code_values = A.equipment_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_values = A.unit_code
  WHERE A.equipment_code LIKE CONCAT('%', ?, '%')
  ORDER BY A.equipment_code
`;

// 1-b) 명칭별 조회
const equipmentListByName = `
  SELECT
    A.equipment_code,
    A.equipment_name,
    A.equipment_type,
    T.code_name AS type_name,
    A.install_date,
    A.manufacturer,
    A.next_inspection_dt,
    A.is_suitable,
    A.unit_code,
    U.code_name AS unit_name,
    A.spec,
    A.qty
  FROM equipments A
  LEFT JOIN common_codes T
    ON T.code_group = 'LL' AND T.code_values = A.equipment_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_values = A.unit_code
  WHERE A.equipment_name LIKE CONCAT('%', ?, '%')
  ORDER BY A.equipment_code
`;

// 1-c) 유형별 조회
const equipmentListByType = `
  SELECT
    A.equipment_code,
    A.equipment_name,
    A.equipment_type,
    T.code_name AS type_name,
    A.install_date,
    A.manufacturer,
    A.next_inspection_dt,
    A.is_suitable,
    A.unit_code,
    U.code_name AS unit_name,
    A.spec,
    A.qty
  FROM equipments A
  LEFT JOIN common_codes T
    ON T.code_group = 'LL' AND T.code_values = A.equipment_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_values = A.unit_code
  WHERE A.equipment_type = ?
  ORDER BY A.equipment_code
`;

// ─────────────────────────────────────────────
//  2) 설비 단건조회
// ─────────────────────────────────────────────
const equipmentInfo = `
  SELECT
    A.equipment_code,
    A.equipment_name,
    A.equipment_type,
    T.code_name AS type_name,
    A.install_date,
    A.manufacturer,
    A.next_inspection_dt,
    A.is_suitable,
    A.unit_code,
    U.code_name AS unit_name,
    A.spec,
    A.qty
  FROM equipments A
  LEFT JOIN common_codes T
    ON T.code_group = 'LL' AND T.code_values = A.equipment_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_values = A.unit_code
  WHERE A.equipment_code = ?
`;

// ─────────────────────────────────────────────
//  3) 등록 / 수정 MERGE (설비)
// ─────────────────────────────────────────────
const equipmentInsert = `
  INSERT INTO equipments (
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    next_inspection_dt,
    is_suitable,
    unit_code,
    spec,
    qty
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    equipment_name     = VALUES(equipment_name),
    equipment_type     = VALUES(equipment_type),
    install_date       = VALUES(install_date),
    manufacturer       = VALUES(manufacturer),
    next_inspection_dt = VALUES(next_inspection_dt),
    is_suitable        = VALUES(is_suitable),
    unit_code          = VALUES(unit_code),
    spec               = VALUES(spec),
    qty                = VALUES(qty)
`;

// ─────────────────────────────────────────────
//  4) 설비 삭제
// ─────────────────────────────────────────────
const equipmentDelete = `
  DELETE FROM equipments
  WHERE equipment_code = ?
`;

// ─────────────────────────────────────────────
//  5) 설비점검 이력 (특정 설비)
// ─────────────────────────────────────────────
const equipmentInspectionsList = `
  SELECT
    inspection_id,
    inspection_date,
    inspector_id,
    contents,
    result,
    equipment_code
  FROM equipment_inspections
  WHERE equipment_code = ?
  ORDER BY inspection_date DESC
`;

// ─────────────────────────────────────────────
//  6-a) 신규 설비코드 생성용
//       (예: 'EQ' + YYMMDD + 3자리 시퀀스)
// ─────────────────────────────────────────────
const equipmentNextCode = `
  SELECT
    CONCAT(
      'EQ',
      DATE_FORMAT(NOW(), '%y%m%d'),
      LPAD(
        IFNULL(MAX(CAST(SUBSTRING(equipment_code, 9) AS UNSIGNED)), 0) + 1,
        3,
        '0'
      )
    ) AS next_code
  FROM equipments
  WHERE SUBSTRING(equipment_code, 3, 6) = DATE_FORMAT(NOW(), '%y%m%d')
`;

// 6-b) 신규 점검ID 생성용 (예: 'INS000001' ...)
const inspectionNextId = `
  SELECT
    CONCAT(
      'INS',
      LPAD(
        IFNULL(MAX(CAST(SUBSTRING(inspection_id, 4) AS UNSIGNED)), 0) + 1,
        6,
        '0'
      )
    ) AS next_id
  FROM equipment_inspections
`;

// ─────────────────────────────────────────────
//  7) 점검 이력 MERGE (insert / update)
// ─────────────────────────────────────────────
const insertInspection = `
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

// 8) 점검 이력 삭제
const deleteInspection = `
  DELETE FROM equipment_inspections
  WHERE inspection_id = ?
`;

// ─────────────────────────────────────────────
//  exports
// ─────────────────────────────────────────────
module.exports = {
  /* 공통코드 */
  equipmentTypeCode,
  unitCode,
  suitableCode,            // ⭐️ 새로 추가
  /* 설비 CRUD */
  equipmentList,
  equipmentListByCode,
  equipmentListByName,
  equipmentListByType,
  equipmentInfo,
  equipmentInsert,
  equipmentDelete,
  equipmentNextCode,
  /* 점검 이력 */
  equipmentInspectionsList,
  inspectionNextId,
  insertInspection,
  deleteInspection,
};
