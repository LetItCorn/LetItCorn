import { defineStore } from 'pinia'
// pinia 를 통해 관리할 store(저장소)를 정의
// : defineStore(store_id, option 객체 | setup function)
export const useUserStore = defineStore('user', {
  // state : store(저장소)를 통해 관리할 대상(데이터) => data 로 작성
  state: () => ({
    user: {}
    
  }),
  // getters : state 의 값을 필터링하거나 readonly 로 조회하기 위한 함수 정의 => computed 로 작성 getters: {
  getters: { //getters는 함수형태, readonly 라서 화살표함수로 편하게 사용
    userId: state => state.user.id,
    empName: state => state.user.emp_name,
  },

  // actions : state 를 변경하기 위한 함수
  actions: {
    addLoginId(userData) {
      if(typeof userData === 'object'){
        this.user.id = userData.id;
        this.user.emp_name = userData.emp_name;
      }else{
        this.user.id = userData;
      }
    },
    removeLoginId() {
      this.user = {};
    },
  },
  persist: true, //영속성 적용
})