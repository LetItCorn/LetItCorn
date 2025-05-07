<template>
    <div class="main-container">
        <div class="login-box"> 
            <div class="login-left">
                <div class="login-logo">
                    <img src="/logo.png" alt="로고">
                </div>
                <div class="login-title">
                    <span>MES</span>
                </div>
            </div>
            <div class="login-right">
                <form name="login-form">
                    <div class="input-box">
                        <span>LOGIN</span>
                    </div>
                    <div class="input-box">
                        <i class="bx bxs-user"></i>
                        <input type="text" name="user_id" autoComplete="off" v-model="loginInfo.user_id" placeholder="아이디" required>
                    </div>
                    <div class="input-box">
                        <i class="bx bxs-lock-alt" ></i>
                        <input type="password" name="user_pw" autoComplete="off" v-model="loginInfo.user_pw" placeholder="비밀번호" required>
                    </div>
                    <button type="button" class="btn" v-on:click="userLogin">로그인</button>
                    <div class="myinfo-findbox">
                        <span><a href="#" @click.prevent="showInfoFinder">내 사원정보 찾기</a></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
// pinia 로 관리하는 store(저장소) 중 필요한 저장소를 가져옴
import { useUserStore } from '@/store/user';
// store(저장소) 중 actions 정보를 가져올 함수
import { mapState, mapActions } from 'pinia';
import Swal from 'sweetalert2';

export default {
    data(){
        return {
        loginInfo:{
            user_id: '',
            user_pw: ''
        },
        }
    },
    computed: {
        ...mapState(useUserStore, ['userId']),
    },
    created(){
        if (this.userId) {
            this.$router.replace("/dashboard");
        };
    },
    methods:{
        // 저장소가 가지고 있는 actions 중 필요한 함수만 가져옴
        // => store(저장소) 정보를 가지고 있는 변수를 구조분해할당할 경우 반응성이 끊어짐
        ...mapActions(useUserStore, ['addLoginId']),
        async userLogin() {
            let result = await axios.post(`/api/login`, this.loginInfo)
                .catch(err => console.log(err));
        let loginRes = result.data;
        if (loginRes.result) {
            // 로그인한 정보를 store(저장소)에 저장하는 addLogindId() 호출
            this.addLoginId({
                id:loginRes.id,
                emp_name:loginRes.emp_name,
            });
            this.$router.replace("/dashboard");    
        } else {
            alert(loginRes.message);
        }
    },
    showInfoFinder(){ // sweetalert2
        Swal.fire({
            title : '내 사원정보 찾기',
            text : '인사관리자 문의',
            icon : 'info',
            confirmButtonText : '확인',
            timer : 5000 // 5초 후 alert2 창 닫힘
        });
    }
    }
    }
</script>
<style scoped>
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

.main-container{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 95vh;
}


.login-box {
    width: 1200px;
    height: 600px;
    border: 3px solid #000000;
    border-radius: 30px;
    display: flex;
    overflow: hidden;
    background-color: #fff;
}

.login-left{
    width: 50%;
    border-right: 3px solid #000000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.login-right{
    width: 50%;
    padding: 75px 50px 40px 50px;
    display: flex;
    flex-direction: column;
}

.login-right form{
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.login-right .input-box{
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

.login-logo > img {
    max-width: 370px;
    width: 100%;
    height: auto;
}

.login-title {
    margin-top: 20px;
}

.login-title > span{
    font-size: 100px;
    font-weight: bold;
    color: #000;
}

.btn{
    width: 100%;
    background-color: #000 !important;
    color: #fff !important;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px !important;
    border: 1px solid #000 !important;
}

.btn:hover{
    background-color: #fff !important;
    color: #000 !important;
    border: 1px solid #000 !important;
}

.input-box > span{
    font-size: 41px;
    font-weight: bold;
    display: block;
    text-align: left;
    width: 100%;
    color: #000;
}

myinfo-findbox a{
    color: #000 !important;
}

.myinfo-findbox a:hover{
    font-weight: bold !important;
    color: #000 !important;
}
</style>