// server/routers/employee_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/employee_service.js');

// 1) 전체조회 또는 검색
// GET /employees?searchType=id|name|role|status&searchValue=...
router.get('/employees', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await svc.findEmployees(searchType, searchValue);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '사원 조회 중 오류가 발생했습니다.' });
  }
});

// 2) 단건조회 (사번 기준)
// GET /employees/:id
router.get('/employees/:id', async (req, res) => {
  try {
    const rec = await svc.findEmployees('one', req.params.id);
    if (!rec) return res.status(404).send({ error: '해당 사원이 없습니다.' });
    res.send(rec);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '사원 단건 조회 오류' });
  }
});

// 3) 등록
// POST /employees
// body: { emp_id?, emp_name, role_code, user_phone, user_email, user_addr, status_code, hire_date, retire_date }
router.post('/employees', async (req, res) => {
  try {
    await svc.createEmployee(req.body);
    res.status(201).send({ message: '등록 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '사원 등록 실패' });
  }
});

// 4) 수정
// PUT /employees/:id
// body: { emp_name, role_code, user_phone, user_email, user_addr, status_code, hire_date, retire_date }
router.put('/employees/:id', async (req, res) => {
  try {
    await svc.updateEmployee(req.params.id, req.body);
    res.send({ message: '수정 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '사원 수정 실패' });
  }
});

// 5) 삭제
// DELETE /employees/:id
router.delete('/employees/:id', async (req, res) => {
  try {
    await svc.deleteEmployee(req.params.id);
    res.send({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '사원 삭제 실패' });
  }
});

module.exports = router;
