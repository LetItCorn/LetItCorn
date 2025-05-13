<template>
  <div class="Insertsqt-container">
    <div class="header-container">
      <div class="main-title">
        <h2>주문서 출고량 등록</h2>
      </div>

      <div class="action-buttons">
        <button class="btn btn-insert" @click="confirmRegister">등록</button>
      </div>
    </div>
    <div class="order-table">
      <table>
        <thead>
          <tr>
            <!-- seletAll 초기 false / @change 해당 태그의 값이 변할 때 함수 or 특정 동작의 값이 실행-->
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>출고량등록번호</th>
            <th>주문번호</th>
            <th>LOT번호</th>
            <th>품목명</th>
            <th>주문수량</th>
            <th>기출고수량</th>
            <th>미출고수량</th>
            <th>납기일자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sqt in shipmentQtt" :key="sqt.sout_code">
            <td><input type="checkbox" v-model="sqt.selected"></td>
            <td>{{ sqt.sout_code }}</td>
            <td>{{ sqt.sorder_code }}</td>
            <td>{{ sqt.lot_cnt }}</td>
            <td>{{ sqt.item_name }}</td>
            <td>{{ sqt.sorder_count }}</td>
            <td>{{ sqt.previous_count }}</td>
            <td>{{ sqt.outstading_count }}</td>
            <td>{{ formatDate(sqt.delivery_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

    <!-- 출고량 등록 모달 -->
    <div v-if="registerModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>출고량 등록</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>출고량등록번호</label>
            <input type="text" v-model="registerParams.soutCode" readonly>
          </div>
          <div class="form-group">
            <label>주문번호</label>
            <input type="text" v-model="registerParams.sorderCode" readonly>
          </div>
          <div class="form-group">
            <label>LOT번호</label>
            <input type="text" v-model="registerParams.lotCnt" readonly>
          </div>
          <div class="form-group">
            <label>품목명</label>
            <input type="text" v-model="registerParams.itemName" readonly>
          </div>
          <div class="form-group">
            <label>주문수량</label>
            <input type="number" v-model="registerParams.sorderCount" readonly>
          </div>
          <div class="form-group">
            <label>기출고수량</label>
            <input type="number" v-model="registerParams.previousCount" placeholder="수량">
          </div>
          <div class="form-group">
            <label>미출고수량</label>
            <input type="number" v-model="registerParams.outstadingCount" placeholder="수량">
          </div>
          <div class="form-group">
            <label>납기일자</label>
            <input type="date" v-model="registerParams.deliveryDate" readonly>
          </div>
          <button class="btn btn-primary" @click="registerSqt" id="modal-register-btn">출고량 등록</button>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      shipmentQtt: [],
      originalShipmentQtt: [],
      registerParams: { 
        soutCode: '',
        sorderCode: '',
        lotCnt: '',
        itemName: '',
        sorderCount: '',
        previousCount: '',
        outstadingCount: '',
        deliveryDate: ''
      },
      selectedRegister : null,
      selectAll: false,
      registerModalVisible: false,
      currentPage: 1,
    };
  },
  computed: {
    
  },
  created() {
    this.fetchAllShipmentQtt();
  },
  methods: {
    async fetchAllShipmentQtt() {
      try {
        const response = await axios.get('/api/insertsqt');
        this.shipmentQtt = response.data.map(sqt => ({
          ...sqt,
          selected: false
        }));
        this.originalShipmentQtt = [...this.shipmentQtt];
      } catch (error) {
        console.error('주문서 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '출고량 목록을 불러오는데 실패했습니다.'
        });
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    toggleSelectAll() {
      this.shipmentQtt.forEach(sqt => {
        sqt.selected = this.selectAll;
      });
    },
    showRegisterModal() {
      console.log('registerModalVisible called');
      this.registerModalVisible = true;
      console.log('registerModalVisible:', this.registerModalVisible);
    },
    confirmRegister() {
      const selectedRegister = this.shipmentQtt.filter(sqt => sqt.selected);

      if (selectedRegister.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '선택된 항목이 없어요.',
          text: '출고량 등록을 위해 최소 하나의 항목을 선택해주세요.'
        });
        return;
      }

      if (selectedRegister.length > 1) {
        Swal.fire({
          icon: 'warning',
          title: '여러 항목 선택됨',
          text: '하나의 항목만 선택하여 출고량 등록을 진행해야해요.'
        });
        return;
      }

      this.selectedRegistered = selectedRegister[0];
      
      this.registerParams = {
        soutCode: this.selectedRegistered.sout_code,
        sorderCode: this.selectedRegistered.sorder_code,
        lotCnt: this.selectedRegistered.lot_cnt,
        itemName: this.selectedRegistered.item_name,
        sorderCount: this.selectedRegistered.sorder_count,
        previousCount: this.selectedRegistered.previous_count,
        outstadingCount: this.selectedRegistered.outstading_count,
        deliveryDate: this.formatDate(this.selectedRegistered.delivery_date)
      };
      this.showRegisterModal();
    },
    // 배경 클릭 시에만 모달 닫기
    closeModalOnBackgroundClick(event) {
    if (event.target.className === 'modal') {

        this.registerModalVisible = false;
      
      }
    },
  }
};
</script>
<style scoped>
.Insertsqt-container {
  margin: 25px;
  color: #000 !important;
}

.main-title h2 {
  margin: 0;
  font-weight: bold;
  color: #000 !important;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.btn-insert {
  background-color: #fbff00 !important;
  color: #000 !important;
  width: 100px !important;
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

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[readonly] {
  background-color: #f5f5f5;
  color: #666;
}
</style>