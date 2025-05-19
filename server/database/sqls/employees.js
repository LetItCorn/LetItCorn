// 1) 전체 조회 + 조건별 검색 (emp_id, emp_name, role_code 모두 옵션)
const employeesList = `
  SELECT emp_id
       , emp_name
       , user_id
       , user_passd   -- 컬럼명 user_passd
       , user_phone
       , user_addr
       , user_email
       , DATE_FORMAT(user_birth, '%Y-%m-%d') AS user_birth
       , user_gender
       , role_code
       , status_code
       , DATE_FORMAT(hire_date , '%Y-%m-%d') AS hire_date
       , DATE_FORMAT(retire_date , '%Y-%m-%d') AS retire_date
  FROM employees
  WHERE 1=1
    AND (? = '' OR emp_id    LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR emp_name  LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR role_code = ?)
  ORDER BY CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)
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
  ORDER BY CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)
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
  ORDER BY CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)
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
  ORDER BY CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)
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
    emp_id,
    emp_name,
    user_id,
    user_passd,
    user_phone,
    user_addr,
    user_email,
    user_birth,
    user_gender,
    role_code,
    status_code,
    hire_date,
    retire_date
  )
  VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
  ON DUPLICATE KEY UPDATE
    emp_name     = VALUES(emp_name),
    user_id      = VALUES(user_id),
    user_passd   = VALUES(user_passd),
    user_phone   = VALUES(user_phone),
    user_addr    = VALUES(user_addr),
    user_email   = VALUES(user_email),
    user_birth   = VALUES(user_birth),
    user_gender  = VALUES(user_gender),
    role_code    = VALUES(role_code),
    status_code  = VALUES(status_code),
    hire_date    = VALUES(hire_date),
    retire_date  = VALUES(retire_date);
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

const userCode = `
  SELECT * FROM common_codes WHERE code_group = 'AA'
`;

const workCode = `
  SELECT * FROM common_codes WHERE code_group = 'BB'
`;

const selectEmployeeEmpId = `
  SELECT
    CONCAT('EMP', LPAD(IFNULL(MAX(CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_emp_id
  FROM employees
`;

module.exports = {
  employeesList,
  employeesById,
  employeesByName,
  employeesByRole,
  employeeInfo,
  employeeInsert,
  employeeUpdate,
  employeeDelete,
  userCode,
  workCode,
  selectEmployeeEmpId,
};
