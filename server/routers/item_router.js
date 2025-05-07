// server/routers/item_router.js

const express     = require('express');
const router      = express.Router();
const itemService = require('../services/item_service.js');

router.get('/items/processesList', async (req, res) => {       
  const qwe     = await itemService.processesList();
  console.log(qwe);
  res.send(qwe);
});

router.post('/saveProcessFlows', async (req, res) => {        
  const flows = req.body.flows;  
  console.log(flows);
  const result   = await itemService.saveProcessFlows(flows);
  res.send(result);  
});

router.post('/items/deleteProcessItem', async (req, res) => {              
  const result     = await itemService.deleteProcessItem(req);  
 // const result   = await itemService.saveProcessFlows(flows);
  res.send(result);  
});



// 전체조회 + 조건검색
// 쿼리스트링: ?code=xxx&name=yyy&type=zzz
router.get('/items', async (req, res) => {
  const { code = '', name = '', type = '' } = req.query;
  const list = await itemService.findItems({ code, name, type });  
  res.send(list);
});

// 단건조회
router.get('/items/:item_code', async (req, res) => {
  const itemCode = req.params.item_code;
  const info     = await itemService.findByItem(itemCode);
  res.send(info);
});

// 등록/수정 (MERGE)
router.post('/items', async (req, res) => {
  try {
    const result = await itemService.saveItem(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('POST /items error:', err);
    res.status(500).json({ error: '품목 저장 중 오류가 발생했습니다.' });
  }
});

// 삭제
router.delete('/items/:item_code', async (req, res) => {
  const itemCode = req.params.item_code;
  const result   = await itemService.deleteItem(itemCode);
  res.send(result);
});


// 단건조회
router.get('/items/itemProcessFlowsList/:item_code', async (req, res) => {   
  const itemCode = req.params.item_code;
  const info     = await itemService.itemProcessFlowsList(itemCode);
  res.send(info);
});





module.exports = router;
