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

// 3) 엑셀 내보내기 (전체 or 선택)
router.post('/qc_history/export', async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = (Array.isArray(ids) && ids.length > 0)
      ? await qcService.findSelectedQCHistory(ids)
      : await qcService.findAllQCHistory();

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('QC_History');
    ws.columns = [
      { header: '#', key: 'idx', width: 5 },
      { header: 'QC 번호', key: 'qc_no', width: 20 },
      { header: '발주ID', key: 'moder_id', width: 20 },
      { header: '자재코드', key: 'mater_code', width: 15 },
      { header: '자재명', key: 'mater_name', width: 20 },
      { header: '검사일자', key: 'qc_date', width: 15 },
      { header: '결과', key: 'qc_result', width: 10 },
      { header: '검사자', key: 'inspector', width: 15 },
    ];

    data.forEach((row, i) => {
      ws.addRow({
        idx: i + 1,
        ...row
      });
    });

    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition',
      'attachment; filename="QC_History.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
