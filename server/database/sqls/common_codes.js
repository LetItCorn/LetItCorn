// server/database/sqls/common_codes.js

// 1) 전체조회
const selectCommonList = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
ORDER BY code_group, code_value
`;

// 2) 단건조회 (group+value)
const selectCommonOne = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
WHERE code_group = ?
  AND code_value = ?
`;

// 3) 그룹별 조회
const selectCommonByGroup = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
WHERE code_group = ?
ORDER BY code_group, code_value
`;

// 4) 값(value) LIKE 조회
const selectCommonByValue = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
WHERE code_value LIKE CONCAT('%', ?, '%')
ORDER BY code_group, code_value
`;

// 5) 이름(name) LIKE 조회
const selectCommonByName = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
WHERE code_name LIKE CONCAT('%', ?, '%')
ORDER BY code_group, code_value
`;

// 6) 사용여부(use_yn) 조회
const selectCommonByUseYn = `
SELECT
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
FROM common_codes
WHERE use_yn = ?
ORDER BY code_group, code_value
`;

// 7) 등록
const insertCommon = `
INSERT INTO common_codes (
  code_group,
  code_value,
  code_name,
  use_yn,
  comm_etc
) VALUES (?, ?, ?, ?, ?)
`;

// 8) 수정
const updateCommon = `
UPDATE common_codes
SET
  code_name = ?,
  use_yn    = ?,
  comm_etc  = ?
WHERE
  code_group = ?
  AND code_value = ?
`;

// 9) 삭제
const deleteCommon = `
DELETE FROM common_codes
WHERE code_group = ?
  AND code_value = ?
`;

module.exports = {
  selectCommonList,
  selectCommonOne,
  selectCommonByGroup,
  selectCommonByValue,
  selectCommonByName,
  selectCommonByUseYn,
  insertCommon,
  updateCommon,
  deleteCommon,
};
