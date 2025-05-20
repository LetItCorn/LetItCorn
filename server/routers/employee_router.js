// server/routers/employee_router.js

const express = require('express');
const router = express.Router();
const employeeService = require('../services/employee_service.js');



router.get('/employees/userCode', async (req, res) => {
  
  try {    
    const list = await employeeService.findUserCode();
    res.json(list);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).json({ error: '직원 목록 조회 중 오류가 발생했습니다.' });
  }
});

router.get('/employees/workCode', async (req, res) => {
  
  try {    
    const list = await employeeService.findWorkCode();
    res.json(list);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).json({ error: '직원 목록 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 1) 전체조회 + 필터검색
 *    GET /employees?id=EMP01&name=홍길동&role=A01
 */
router.get('/employees', async (req, res) => {
  const data = {...req.query};
  console.log('id, name, role');
  console.log(data);
  try {
    const list = await employeeService.findEmployees(data);
    res.json(list);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).json({ error: '직원 목록 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 단건조회
 *    GET /employees/:emp_id
 */
router.get('/employees/:emp_id', async (req, res) => {
  const empId = req.params.emp_id;
  try {
    const emp = await employeeService.findEmployee(empId);
    if (!emp) return res.status(404).json({ error: '해당 직원이 없습니다.' });
    res.json(emp);
  } catch (err) {
    console.error(`GET /employees/${empId} error:`, err);
    res.status(500).json({ error: '직원 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 등록
 *    POST /employees
 *    body: { emp_id, emp_name, user_id, user_passd, user_phone, ... }
 */
router.post('/employees', async (req, res) => {
  try {
    await employeeService.createEmployee(req.body);
    res.status(201).json({ message: '직원이 등록되었습니다.' });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).json({ error: '직원 등록 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 수정
 *    PUT /employees/:emp_id
 */
router.put('/employees/:emp_id', async (req, res) => {
  const empId = req.params.emp_id;
  const payload = { ...req.body, emp_id: empId };
  try {
    await employeeService.updateEmployee(payload);
    res.json({ message: '직원 정보가 수정되었습니다.' });
  } catch (err) {
    console.error(`PUT /employees/${empId} error:`, err);
    res.status(500).json({ error: '직원 수정 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 삭제
 *    DELETE /employees/:emp_id
 */
router.delete('/employees/:emp_id', async (req, res) => {
  const empId = req.params.emp_id;
  try {
    await employeeService.deleteEmployee(empId);
    res.json({ message: '직원이 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /employees/${empId} error:`, err);
    res.status(500).json({ error: '직원 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
