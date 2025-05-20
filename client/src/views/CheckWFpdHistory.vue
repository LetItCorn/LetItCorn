<template>
  <div class="checkwfpdhistory-container">
    <div class="header-container">
      <div class="main-title">
        <h2>완제품 입∙출고 이력 조회</h2>
      </div>
    </div>

    <div class="order-table">
      <table>
        <thead>
          <tr>
            <!-- seletAll 초기 false / @change 해당 태그의 값이 변할 때 함수 or 특정 동작의 값이 실행-->
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>생산지시번호</th>
            <th>생산계획번호</th>
            <th>LOT번호</th>
            <th>품목명</th>
            <th>지시수량</th>
            <th>입고일자</th>
            <th>생산계획종료일</th>
            <th>지시상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="qfpdh in qfphistory" :key="qfpdh.inst_head">
            <td><input type="checkbox" v-model="qfpdh.selected"></td>
            <td>{{ qfpdh.inst_head }}</td>
            <td>{{ qfpdh.plans_head }}</td>
            <td>{{ qfpdh.lot_cnt }}</td>
            <td>{{ qfpdh.item_name }}</td>
            <td>{{ qfpdh.iord_no }}</td>
            <td>{{ qfpdh.input_date }}</td>
            <td>{{ formatDate(qfpdh.plan_end) }}</td>
            <td>{{ qfpdh.code_name }}</td>
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
      qfphistory: [],
      originalQFPHistory: [],
      selectAll: false,
      showInspectionModal: false,
      currentPage: 1,
      selectedCustomer: null,
      selectedclienttype: '',
      clienttypes: [],
    };
  },
  computed: {
    selectedProducts() {
      return this.qfphistory.filter(qfpd => qfpd.selected);
    },
  },
  created() {
    this.fetchAllQFPhistory();
  },
  methods: {
    async fetchAllQFPhistory() {
      try {
        const response = await axios.get('/api/qfphistory');
        this.qfphistory = response.data.map(qfpdh => ({
          ...qfpdh,
          selected: false
        }));
        this.originalQFPHistory = [...this.qfphistory];
      } catch (error) {
        console.error('생산완료 제품 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '생산완료 제품 목록을 불러오는데 실패했어요.'
        });
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    toggleSelectAll() {
      this.qfphistory.forEach(qfpd => {
        qfpd.selected = this.selectAll;
      });
    },
  }
};
</script>
<style scoped>
  .checkwfpdhistory-container {
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
.btn-inspection {
  background-color: #f700ff !important;
  color: #fff !important;
  width: 100px !important;
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
</style>