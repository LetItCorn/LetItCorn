const express = require('express');
const router = express.Router();
const userService = require('../services/user_service.js');

// 로그인
router.post('/login', async (req, res)=>{
  let loginInfo = req.body;
  let resInfo = await userService.loginByUserId(loginInfo)
  .catch(err => console.log(err));

  if(resInfo.result){
  // 성공한 경우 정보를 세션에 저장
    req.session.user = resInfo.userInfo.emp_name;
    req.session.save(function(err){
      if(err) throw err;
        res.send({ result : true, id : resInfo.userInfo.user_id, emp_name : resInfo.userInfo.emp_name });
    })
  }else{
    // 실패한 경우
    res.send({ result : false, message : '회원 정보가 존재하지 않습니다.'});
  }
});

// 로그아웃
// router.get('/logout', (req, res)=>{
//   req.session.destroy();
//   res.send({ result : true });
// });

module.exports = router