// server/database/sqls/common_codes.js

// 1) 전체 목록 조회 + 조건 검색 (모든 조건은 optional)
const commonCodesList = `
  SELECT code_group
       , code_rear
       , code_name
       , use_yn
       , comm_etc
       , code_values
  FROM common_codes
  WHERE 1=1
    AND (code_group = ? OR ? = '')
    AND (code_rear = ? OR ? = '')
    AND (code_name LIKE CONCAT('%', ?, '%') OR ? = '')
    AND (use_yn = ? OR ? = '')
  ORDER BY code_group, code_rear
`;

// 1-a) 그룹 기준 조회
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
  ORDER BY code_group, code_rear
`;

// 1-b) 후위코드 기준 조회
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
  ORDER BY code_group, code_rear
`;

// 1-c) 명칭 기준 LIKE 검색
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

// 1-d) 사용 여부 기준 조회
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

// 2-a) 단건 조회 (PK 조합 기준: code_group + code_rear)
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

// 2-b) 단건 조회 (code_values 기준)
const commonCodeByValue = `
  SELECT
    code_group,
    code_rear,
    code_name,
    use_yn,
    comm_etc,
    code_values
  FROM common_codes
  WHERE code_values = ?
`;

// 2-c) 다음 code_rear 생성용 조회 (code_group별 max + 1)
const nextCommonCodeRear = `
  SELECT LPAD(IFNULL(MAX(CAST(code_rear AS UNSIGNED)), 0) + 1, 2, '0') AS next_rear
  FROM common_codes
  WHERE code_group = ?
`;

// 3) 등록/수정 (MERGE 방식 - ON DUPLICATE KEY UPDATE)
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

// 4) 삭제 (PK 조합 기준: code_group + code_rear)
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
  commonCodeByValue,
  nextCommonCodeRear,
  commonCodeUpsert,
  commonCodeDelete
};
