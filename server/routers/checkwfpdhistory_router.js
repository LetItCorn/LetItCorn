const express = require('express');
const router = express.Router();
const checkwfpdhistory = require('../services/checkwfpdhistory_service.js');


router.get('/qfphistory', async (req, res) => {
    try {
        const qfphistoryList = await checkwfpdhistory.findAllQFProductHistory();
        res.send(qfphistoryList);
    } catch (err) {
        res.status(500).send({ error: '완제품 입고 기록 목록을 불러오는데 실패했습니다.' });
    }
});

module.exports = router