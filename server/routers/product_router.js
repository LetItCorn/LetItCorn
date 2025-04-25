const express = require('express');
const router = express.Router();
const productService = require('../services/product_service.js');

//전체조회 (CRUD 예시이므로 따로 추가하셔야 합니다. )
router.get('/products', async (req, res)=>{
  let bookList = await productService.findAll()
                         .catch(err => console.log(err));
   res.send(bookList); 
});



module.exports = router