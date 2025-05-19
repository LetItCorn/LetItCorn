// server/routers/qc_history_router.js
const express = require('express');
const router = express.Router();
const qcService = require('../services/qc_history_service');
const ExcelJS = require('exceljs');

// 1) 조회
router.get('/qc_history', async (req, res, next) => {
  try {
    const list = await qcService.findAllQCHistory();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// 2) 단건 삭제
router.delete('/qc_inspections/:qc_no', async (req, res, next) => {
  try {
    const success = await qcService.deleteQC(req.params.qc_no);
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

// 발주서별 요약 조회
router.get('/qc_order_summary', async (req, res, next) => {
  try {
    const list = await qcService.findAllOrderSummary();
    res.json(list);
  } catch (err) {
    next(err);
  }
});


// (5) 발주서별 요약 엑셀 다운로드
router.post('/qc_order_summary/export', async (req, res, next) => {
    try {
      const data = await qcService.findAllOrderSummary();
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet('QC_Order_Summary');
      ws.columns = [
        { header: '발주ID',        key: 'moder_id',       width: 15 },
        { header: '발주일자',      key: 'moder_date',     width: 15 },
        { header: '총검사항목',     key: 'total_items',    width: 10 },
        { header: '합격여부',      key: 'overall_result', width: 10 },
      ];
      data.forEach(row => ws.addRow(row));
      res.setHeader('Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition',
        'attachment; filename=\"QC_Order_Summary.xlsx\"'
      );
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
