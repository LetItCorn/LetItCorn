<!-- <template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 100%; height: 500px;"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :modules="modules"
  />
</template>

<script>
import { onMounted, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3' // Vue3 AgGrid Component

import 'ag-grid-enterprise' // enterprise 기능 사용 시 import
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { ClientSideRowModelModule } from 'ag-grid-community'
import { ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([ClientSideRowModelModule])

export default {
  components: { AgGridVue },
  setup() {
    const columnDefs = ref([
      { field: 'make' },
      { field: 'model' },
      { field: 'price' }
    ])

    const rowData = ref([
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxster', price: 72000 },
      { make: 'Genesis', model: 'GV80', price: 90000 }
    ])

    return { columnDefs, rowData }
  }
}
</script> -->
<template>
  <div class="main_container">
        <div class="login_box">
            <div class="login_left">
                <div class="login_logo">
                    <img src="/logo.png" alt="">
                </div>
                <div class="login_title">
                    <span>MES</span>
                </div>
            </div>

            <div class="login_right">
                <form name="login_form" action="" >
                    <div class="input-box">
                        <i class="bx bxs-user"></i>
                        <input type="text" name="user_id" placeholder="아이디" required>
                    </div>
                    <div class="input-box">
                        <i class="bx bxs-lock-alt" ></i>
                        <input type="password" name="user_pw" placeholder="비밀번호" required>
                    </div>
                    <button type="submit" class="btn">로그인</button>
                    <div class="input-box">
                        <span>인사담당자 : 내선번호 0000</span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<style>
  *{
    font-family: "42dot Sans", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
}

.main_container{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}


.login_box {
    width: 1200px;
    height: 600px;
    border: 3px solid #000000;
    border-radius: 30px;
    display: flex;
    overflow: hidden;
}

.login_left{
    width: 50%;
    border-right: 3px solid #000000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.login_right{
    width: 50%;
    padding: 150px 50px 40px 50px;
    display: flex;
    flex-direction: column;
}

.login_right form{
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.login_right .input-box{
    position: relative;
    width: 100%;
    margin: 25px 0;
}

.input-box input{
    width: 100%;
    border: none;
    border: 2px solid #e9e9e9;
    border-radius: 10px;
    padding: 15px 20px 15px 45px;
    background-color: #e9e9e9;
    font-size: 16px;
}

.input-box input::placeholder{
    color: #999;
}

.input-box i{
    position: absolute;
    left: 15px;
    top: 52%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #999;
}

.input-box input:focus{
    border-color: #aaa;
}

.input-box:has(input:focus) i{
    color: #000;
}

.login_logo > img {
    max-width: 370px;
    width: 100%;
    height: auto;
}

.login_title {
    margin-top: 20px;
}

.login_title > span{
    font-size: 100px;
    font-weight: bold;
}

.btn{
    display: block;
    width: 250px;
    height: 50px;
    background-color: #000;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 100px;
    font-size: 16px;
}

.input-box > span{
    font-size: 25px;
    font-weight: bold;
    display: block;
    text-align: center;
    width: 100%;
}
</style>