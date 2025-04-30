// server/routers/equipment_router.js
const express = require('express');
const router = express.Router();
const equipmentService = require('../services/equipment_service.js');

// 설비 조회 (전체 or 검색조건)
router.get('/equipments', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await equipmentService.findEquipments(searchType, searchValue);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '설비 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
