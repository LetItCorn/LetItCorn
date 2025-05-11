// server/services/employee_service.js

const mariaDB = require('../database/mapper.js');

/**
 * 1) 전체조회 + 조건검색
 * @param {{id?:string,name?:string,role?:string}} filters
 */
const findEmployees = async ({ id = '', name = '', role = '' } = {}) => {
  // SQL의 (?='' OR ...) 절이 동작하려면 빈 문자열로 초기화 필요
  const params = [
    id,   id,    // emp_id 필터
    name, name,  // emp_name 필터
    role, role   // role_code 필터
  ];
  try {
    return await mariaDB.query('employeesList', params);
  } catch (err) {
    console.error('findEmployees error', err);
    return [];
  }
};

/**
 * 2) 단건조회 (emp_id 기준)
 */
const findEmployee = async (empId) => {
  try {
    const rows = await mariaDB.query('employeeInfo', [empId]);
    return rows[0] || null;
  } catch (err) {
    console.error('findEmployee error', err);
    return null;
  }
};

/**
 * 3) 등록: 새 직원 추가
 */
const createEmployee = async (emp) => {

  

  let params = [
    emp.emp_id,
    emp.emp_name,
    emp.user_id,
    emp.user_passd,    // 컬럼명 user_passd 와 일치
    emp.user_phone,
    emp.user_addr,
    emp.user_email,
    emp.user_birth,
    emp.user_gender,
    emp.role_code,
    emp.status_code,
    emp.hire_date,
    emp.retire_date
  ];
  try {
    const emp_id = await mariaDB.query('selectEmployeeEmpId');
  
    if(emp.emp_id == undefined){
      params[0] = emp_id[0].next_emp_id;
    }
    
      
    return await mariaDB.query('employeeInsert', params);
  } catch (err) {
    console.error('createEmployee error', err);
    throw err;
  }
};

/**
 * 4) 수정: 기존 직원 정보 업데이트
 */
const updateEmployee = async (emp) => {
  const params = [
    emp.emp_name,
    emp.user_id,
    emp.user_passd,    // 컬럼명 user_passd 와 일치
    emp.user_phone,
    emp.user_addr,
    emp.user_email,
    emp.user_birth,
    emp.user_gender,
    emp.role_code,
    emp.status_code,
    emp.hire_date,
    emp.retire_date,
    emp.emp_id
  ];
  try {
    return await mariaDB.query('employeeUpdate', params);
  } catch (err) {
    console.error('updateEmployee error', err);
    throw err;
  }
};

/**
 * 5) 삭제: 직원 정보 삭제
 */
const deleteEmployee = async (empId) => {
  try {
    return await mariaDB.query('employeeDelete', [empId]);
  } catch (err) {
    console.error('deleteEmployee error', err);
    throw err;
  }
};

const findUserCode =  async () => {
  try {
    return await mariaDB.query('userCode');
  } catch (err) {
    console.error('findEmployees error', err);
    return [];
  }
};
const findWorkCode =  async () => {
  try {
    return await mariaDB.query('workCode');
  } catch (err) {
    console.error('findEmployees error', err);
    return [];
  }
};

module.exports = {
  findEmployees,
  findEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findUserCode,
  findWorkCode,
};
