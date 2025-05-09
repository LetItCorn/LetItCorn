// server/database/sqls/common_codes.js

// 1) 전체 조회 + 조건별 검색 (code_group, code_rear, code_name, use_yn 모두 옵션)
const commonCodesList = `
  SELECT code_group
       , code_rear
       , code_name
       , use_yn
       , comm_etc
       , code_values
  FROM common_codes
  WHERE 1=1
    AND (? = '' OR code_group = ?)
    AND (? = '' OR code_rear = ?)
    AND (? = '' OR code_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR use_yn = ?)
  ORDER BY code_group, code_rear
`;

// 1-a) 그룹별 조회
const commonCodesByGroup = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE code_group = ?
  ORDER BY code_rear
`;

// 1-b) 코드 후위별 조회
const commonCodesByRear = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE code_rear = ?
  ORDER BY code_group
`;

// 1-c) 명칭별 조회 (LIKE 검색)
const commonCodesByName = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE code_name LIKE CONCAT('%', ?, '%')
  ORDER BY code_group, code_rear
`;

// 1-d) 사용여부별 조회
const commonCodesByUseYn = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE use_yn = ?
  ORDER BY code_group, code_rear
`;

// 2) 단건 조회 (code_group + code_rear 기준)
const commonCodeInfo = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE code_group = ?
    AND code_rear  = ?
`;

// 3) 등록/수정 (INSERT ... ON DUPLICATE KEY UPDATE)
const commonCodeUpsert = `
  INSERT INTO common_codes (
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  ) VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    code_name   = VALUES(code_name),
    use_yn      = VALUES(use_yn),
    comm_etc    = VALUES(comm_etc),
    code_values = VALUES(code_values)
`;

// 4) 삭제 (DELETE)
const commonCodeDelete = `
  DELETE FROM common_codes
   WHERE code_group = ?
     AND code_rear  = ?
`;

module.exports = {
  commonCodesList,
  commonCodesByGroup,
  commonCodesByRear,
  commonCodesByName,
  commonCodesByUseYn,
  commonCodeInfo,
  commonCodeUpsert,
  commonCodeDelete
};
