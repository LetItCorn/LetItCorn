// server/database/sqls/employees.js

// 1) 전체조회
const selectEmployeeList = `
SELECT
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
FROM employees
ORDER BY emp_id
`;

// 2) 단건조회 (사번)
const selectEmployeeOne = `
SELECT
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
FROM employees
WHERE emp_id = ?
`;

// 3) 이름 조회 (LIKE)
const selectEmployeeByName = `
SELECT
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
FROM employees
WHERE emp_name LIKE CONCAT('%', ?, '%')
ORDER BY emp_id
`;

// 4) 권한별 조회
const selectEmployeeByRole = `
SELECT
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
FROM employees
WHERE role_code = ?
ORDER BY emp_id
`;

// 5) 근무상태별 조회
const selectEmployeeByStatus = `
SELECT
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
FROM employees
WHERE status_code = ?
ORDER BY emp_id
`;

// 6) 등록
const insertEmployee = `
INSERT INTO employees (
  emp_id,
  emp_name,
  role_code,
  user_phone,
  user_email,
  user_addr,
  status_code,
  hire_date,
  retire_date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 7) 수정
const updateEmployee = `
UPDATE employees
SET
  emp_name    = ?,
  role_code   = ?,
  user_phone  = ?,
  user_email  = ?,
  user_addr   = ?,
  status_code = ?,
  hire_date   = ?,
  retire_date = ?
WHERE emp_id = ?
`;

// 8) 삭제
const deleteEmployee = `
DELETE FROM employees
WHERE emp_id = ?
`;

module.exports = {
  selectEmployeeList,
  selectEmployeeOne,
  selectEmployeeByName,
  selectEmployeeByRole,
  selectEmployeeByStatus,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
};
