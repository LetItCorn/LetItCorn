// server/services/employee_service.js
const db = require('../database/mapper.js');

const findEmployees = async (searchType, searchValue) => {
  let list;
  if (!searchType || !searchValue) {
    list = await db.query('selectEmployeeList');
  } else if (searchType === 'id') {
    const rows = await db.query('selectEmployeeOne', [searchValue]);
    list = rows.length ? rows[0] : null;
  } else if (searchType === 'name') {
    list = await db.query('selectEmployeeByName', [searchValue]);
  } else if (searchType === 'role') {
    list = await db.query('selectEmployeeByRole', [searchValue]);
  } else if (searchType === 'status') {
    list = await db.query('selectEmployeeByStatus', [searchValue]);
  } else {
    list = [];
  }
  return list;
};

const createEmployee = async ({
  emp_id, emp_name, role_code,
  user_phone, user_email, user_addr,
  status_code, hire_date, retire_date
}) => {
  return db.query('insertEmployee', [
    emp_id, emp_name, role_code,
    user_phone, user_email, user_addr,
    status_code, hire_date, retire_date
  ]);
};

const updateEmployee = async (emp_id, {
  emp_name, role_code,
  user_phone, user_email, user_addr,
  status_code, hire_date, retire_date
}) => {
  return db.query('updateEmployee', [
    emp_name, role_code,
    user_phone, user_email, user_addr,
    status_code, hire_date, retire_date,
    emp_id
  ]);
};

const deleteEmployee = async (emp_id) => {
  return db.query('deleteEmployee', [emp_id]);
};

module.exports = {
  findEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
