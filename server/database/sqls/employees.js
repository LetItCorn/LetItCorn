// server/database/sqls/employees.js

// 1) 전체 조회 + 조건별 검색 (emp_id, emp_name, role_code 모두 옵션)
const employeesList = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd   -- 컬럼명 user_passd
       , user_phone
       , user_addr
       , user_email
       , user_birth
       , user_gender
       , role_code
       , status_code
       , hire_date
       , retire_date
  FROM employees
  WHERE 1=1
    AND (? = '' OR emp_id    LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR emp_name  LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR role_code = ?)
  ORDER BY emp_id
`;

// 1-a) ID로만 조회 (LIKE 검색)
const employeesById = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd
       , user_phone
       , user_addr
       , user_email
       , user_birth
       , user_gender
       , role_code
       , status_code
       , hire_date
       , retire_date
  FROM employees
  WHERE emp_id LIKE CONCAT('%', ?, '%')
  ORDER BY emp_id
`;

// 1-b) 이름으로만 조회 (LIKE 검색)
const employeesByName = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd
       , user_phone
       , user_addr
       , user_email
       , user_birth
       , user_gender
       , role_code
       , status_code
       , hire_date
       , retire_date
  FROM employees
  WHERE emp_name LIKE CONCAT('%', ?, '%')
  ORDER BY emp_id
`;

// 1-c) 역할 코드로만 조회
const employeesByRole = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd
       , user_phone
       , user_addr
       , user_email
       , user_birth
       , user_gender
       , role_code
       , status_code
       , hire_date
       , retire_date
  FROM employees
  WHERE role_code = ?
  ORDER BY emp_id
`;

// 2) 단건 조회 (emp_id 기준)
const employeeInfo = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd
       , user_phone
       , user_addr
       , user_email
       , user_birth
       , user_gender
       , role_code
       , status_code
       , hire_date
       , retire_date
  FROM employees
  WHERE emp_id = ?
`;

// 3) 등록 (INSERT)
const employeeInsert = `
  INSERT INTO employees (
      emp_id
    , emp_name
    , user_id
    , user_passd
    , user_phone
    , user_addr
    , user_email
    , user_birth
    , user_gender
    , role_code
    , status_code
    , hire_date
    , retire_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 4) 수정 (UPDATE)
const employeeUpdate = `
  UPDATE employees
     SET emp_name    = ?
       , user_id     = ?
       , user_passd  = ?
       , user_phone  = ?
       , user_addr   = ?
       , user_email  = ?
       , user_birth  = ?
       , user_gender = ?
       , role_code   = ?
       , status_code = ?
       , hire_date   = ?
       , retire_date = ?
   WHERE emp_id = ?
`;

// 5) 삭제 (DELETE)
const employeeDelete = `
  DELETE FROM employees
   WHERE emp_id = ?
`;

module.exports = {
  employeesList,
  employeesById,
  employeesByName,
  employeesByRole,
  employeeInfo,
  employeeInsert,
  employeeUpdate,
  employeeDelete
};
