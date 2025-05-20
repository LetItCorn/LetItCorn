<template>
  <div class="Fproduct-container">
    <div class="header-container">
      <div class="main-title">
        <h2>완제품 목록</h2>
      </div>
      <div class="action-buttons">
        <button class="btn btn-reroad" @click="fetchAllFinishedProduct">초기화</button>
      </div>
    </div>

    <div class="order-table">
      <table>
        <thead>
          <tr>
            <!-- seletAll 초기 false / @change 해당 태그의 값이 변할 때 함수 or 특정 동작의 값이 실행-->
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>품목번호</th>
            <th>품목명</th>
            <th>현 재고량</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fpd in fproduct" :key="fpd.item_code">
            <td><input type="checkbox" v-model="fpd.selected"></td>
            <td>{{ fpd.item_code }}</td>
            <td>{{ fpd.item_name }}</td>
            <td>{{ fpd.current_stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';

  export default {
  data() {
    return {
      fproduct: [],
      originalFproduct: [],
      selectAll: false,
      currentPage: 1,
      selectedCustomer: null,
      selectedclienttype: '',
      clienttypes: [],
    };
  },
  computed: {
    
  },
  created() {
    this.fetchAllFinishedProduct();
  },
  methods: {
    async fetchAllFinishedProduct() {
      try {
        const response = await axios.get('/api/fproduct');
        this.fproduct = response.data.map(fpd => ({
          ...fpd,
          selected: false
        }));
        this.originalFproduct = [...this.fproduct];
      } catch (error) {
        console.error('완제품 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '완제품 목록을 불러오는데 실패했어요.'
        });
      }
    },
    toggleSelectAll() {
      this.fproduct.forEach(fpd => {
        fpd.selected = this.selectAll;
      });
    },
  }
};
</script>
<style scoped>
  .Fproduct-container {
  margin: 25px;
  color: #000 !important;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.main-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.main-title h2 {
  margin: 0;
  font-weight: bold;
  color: #000 !important;
  line-height: 50px;
}

/* button */
.btn {
  margin-bottom: 0 !important;
  width: 100%;
  background-color: #000 !important;
  color: #fff !important;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px !important;
  border: 1px solid #000 !important;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 액션 버튼 스타일 */
.btn-reroad {
  background-color: #00ffc8 !important;
  color: #000 !important;
  width: 110px !important;
  border: none !important;
}

.order-table {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  border: 1px solid #bebebe !important;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #ddd;
}

td {
  background-color: #fff;
}

.modal {
  position: fixed;
  width: 100% !important;
  height: 100% !important;
  z-index: 99 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  color: black;
}

.modal-title h3 {
  color: #000;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}


.form-group input[readonly] {
  background-color: #f5f5f5;
  color: #666;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
