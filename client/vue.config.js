const { defineConfig } = require('@vue/cli-service')
//밑의 서버는 추후 네이버 클라우드 할당 ip로 변경해야 합니다. 
const server = 'http://localhost:3000';
module.exports = defineConfig({
  transpileDependencies: true,

  devServer:{
    port:8099,
    proxy:{
      '^/api' :{
        target: server,
        changeOrigin:true,
        pathRewrite:{'^/api':'/'},
        ws:false
      }
    }
  }
})
