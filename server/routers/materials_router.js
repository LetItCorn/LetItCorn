// server/routers/materials_router.js
const express = require('express');
const router = express.Router();
const materialService = require('../services/material_service.js');

/**
 * 1) 전체 조회 또는 조건 검색
 *    - 쿼리 파라미터 code, name을 기준으로 검색
 *    - 모두 비어 있으면 전체 목록 조회
 */
// router.get('/materials', async (req, res) => {
//   const { code = '', name = '' } = req.query;
//   try {
//     const list = await materialService.findMaterials({ code, name });
//     res.json(list);
//   } catch (err) {
//     console.error('GET /materials error', err);
//     res.status(500).json({ error: '자재 목록 조회 중 오류 발생' });
//   }
// });

// // 단위코드(공통코드 UU) 가져오기
// router.get('/materials/unitCode', async (req, res) => {
//   try {
//     const unitList = await materialService.unitCode();
//     res.json(unitList);
//   } catch (err) {
//     console.error('GET / materials/unitCode error:', err);
//     res.status(500).json({ error: '단위코드 조회 중 오류가 발생했습니다.' });
//   }
// });

// /**
//  * 2) 단건 조회
//  *    - URL 파라미터 mater_code로 조회
//  */
// router.get('/materials/:mater_code', async (req, res) => {
//   const materCode = req.params.mater_code;
//   try {
//     const info = await materialService.MaterialByCode(materCode);
//     if (!info) {
//       return res.status(404).json({ error: '해당 자재가 존재하지 않습니다.' });
//     }
//     res.json(info);
//   } catch (err) {
//     console.error(`GET /materials/${materCode} error`, err);
//     res.status(500).json({ error: '자재 조회 중 오류 발생' });
//   }
// });

// /**
//  * 3) 등록 또는 수정
//  *    - 요청 바디에 자재 정보 포함
//  *    - mater_code로 MERGE 수행
//  */
// router.post('/materials', async (req, res) => {
//   const payload = req.body;
//   try {
//     const result = await materialService.saveMaterial(payload);
//     res.status(201).json(result);
//   } catch (err) {
//     console.error('POST /materials error', err);
//     res.status(500).json({ error: '자재 저장 실패' });
//   }
// });

// /**
//  * 4) 삭제
//  *    - URL 파라미터 mater_code로 자재 삭제
//  */
// router.delete('/materials/:mater_code', async (req, res) => {
//   const materCode = req.params.mater_code;
//   try {
//     const result = await materialService.deleteMaterial(materCode);
//     res.json(result);
//   } catch (err) {
//     console.error(`DELETE /materials/${materCode} error`, err);
//     res.status(500).json({ error: '자재 삭제 실패' });
//   }
// });

// 1) 전체 자재 목록 조회
router.get('/materials', async (req, res) => {
  try {
    const list = await materialService.findAllMaterials();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /materials 오류:', err);
    res.status(500).json({ error: '전체 자재 목록 조회 중 오류' });
  }
});

// 2) 자재 LOT 목록 조회
router.get('/materials/lots', async (req, res) => {
  try {
    const list = await materialService.findAllMAtLOTlist();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /materials/lots 오류:', err);
    res.status(500).json({ error: 'LOT별 자재 목록 조회 중 오류' });
  }
});

// 3) **실시간 재고 현황 조회** (이 라우트가 /materials/:code 보다 위에 있어야 합니다)
router.get('/materials/stock', async (req, res) => {
  try {
    const list = await materialService.findMaterialStock();
    res.json(list);
  } catch (err) { 
    console.error('[Router] GET /materials/stock 오류:', err);
    res.status(500).json({ error: '재고 현황 조회 중 오류' });
  }
});

// 4) 단건 자재 조회
router.get('/materials/:code', async (req, res) => {
  try {
    const material = await materialService.findMaterialByCode(req.params.code);
    if (!material) {
      return res.status(404).json({ message: '해당 자재를 찾을 수 없습니다.' });
    }
    res.json(material);
  } catch (err) {
    console.error('[Router] GET /materials/:code 오류:', err);
    res.status(500).json({ error: '단건 자재 조회 중 오류' });
  }
});


// 4) 자재 등록
router.post('/materials', async (req, res) => {
  try {
    const result = await materialService.addMaterial(req.body);
    if (result.isSuccess) {
      return res.status(201).json(result);
    }
    res.status(400).json(result);
  } catch (err) {
    console.error('[Router] POST /materials 오류:', err);
    res.status(500).json({ error: '자재 등록 중 오류' });
  }
});

// 5) 자재 수정
router.put('/materials/:code', async (req, res) => {
  try {
    const result = await materialService.updateMaterialInfo(req.params.code, req.body);
    res.json(result);
  } catch (err) {
    console.error('[Router] PUT /materials/:code 오류:', err);
    res.status(500).json({ error: '자재 수정 중 오류' });
  }
});

// 6) 자재 삭제
router.delete('/materials/:code', async (req, res) => {
  try {
    const result = await materialService.removeMaterial(req.params.code);
    res.json(result);
  } catch (err) {
    console.error('[Router] DELETE /materials/:code 오류:', err);
    res.status(500).json({ error: '자재 삭제 중 오류' });
  }
});




module.exports = router;
