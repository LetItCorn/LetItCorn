<template>
  <div class="qinspectionfproduct-container">
    <div class="header-container">
      <div class="main-title">
        <h2>완제품 품질검사</h2>
        <!-- <h6>생산완료된 제품을 최종 검사합니다.</h6> --> <!-- Inspection 검사 -->
      </div>
        <div class="action-buttons">
          <button 
            class="btn btn-inspection" 
            @click="openInspectionModal"
            :disabled="!selectedProducts.length"
          >
            검사
          </button>

          <!-- <button
          class="btn btn-sm btn-warning"
          :disabled="!selectedOrders.length"
          @click="showQualityModal = true"
          >
          <i class="bi bi-gear-fill me-1"></i> 품질 검사
          </button> -->
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
            <th>생산계획종료일</th>
            <th>지시상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="qfpd in qfproduct" :key="qfpd.inst_no">
            <td><input type="checkbox" v-model="qfpd.selected"></td>
            <td>{{ qfpd.inst_no }}</td>
            <td>{{ qfpd.plan_no }}</td>
            <td>{{ qfpd.lot_cnt }}</td>
            <td>{{ qfpd.item_name }}</td>
            <td>{{ qfpd.iord_no }}</td>
            <td>{{ formatDate(qfpd.plan_end) }}</td>
            <td>{{ qfpd.code_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <QInspectionPD
    :visible="showInspectionModal"
    :orders="selectedProducts"
    @close="showInspectionModal = false"
    />
  </div>
</template>
<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import QInspectionPD from './components/QInspectionPDModal.vue';

  export default {
  name: 'QInspectionFinishedProduct',
  components: { QInspectionPD },
  data() {
    return {
      qfproduct: [],
      originalQFproduct: [],
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
      return this.qfproduct.filter(qfpd => qfpd.selected);
    },
  },
  created() {
    this.fetchAllQFinishedProduct();
  },
  methods: {
    async fetchAllQFinishedProduct() {
      try {
        const response = await axios.get('/api/qfproduct');
        this.qfproduct = response.data.map(qfpd => ({
          ...qfpd,
          selected: false
        }));
        this.originalQFproduct = [...this.qfproduct];
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
      this.qfproduct.forEach(qfpd => {
        qfpd.selected = this.selectAll;
      });
    },
    openInspectionModal() {
      console.log('showInspectionModal called'); // 호출 확인
      this.showInspectionModal = true;
      console.log('InspectionModalVisible:', this.InspectionModalVisible); // 상태 변경 확인
    },
  }
};
</script>
<style scoped>
  .qinspectionfproduct-container {
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