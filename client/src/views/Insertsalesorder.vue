<template>
  <!-- 주문서 등록 페이지 메인 컨테이너 -->
  <div class="Insertorder-container">
    <!-- 제목 title, action button을 포함하는 컨테이너-->
    <div class="header-container">
      <div class="main-title">
        <h2>주문서 등록</h2>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-register" @click="registerSalesOrder">등록</button>
        <button class="btn btn-cancel" @click="goBack">취소</button>
      </div>
    </div>
    
    <!-- 주문서 등록 form -->
    <div class="form-container">
      <div class="form-group">
        <label>주문번호</label>
        <input type="text" v-model="orderData.sorderCode" readonly>
      </div>
      
      <div class="form-group">
        <label>거래처명</label>
        <select v-model="selectedClient" @change="handleClientChange">
          <option value="">거래처를 선택하세요</option>
          <option v-for="client in clients" :key="client.client_code" :value="client">
            {{ client.client_name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>담당자</label>
        <input type="text" v-model="orderData.clientMgr" readonly>
      </div>
      
      <div class="form-group">
        <label>품목명</label>
        <select v-model="selectedItem" @change="handleItemChange">
          <option value="">품목을 선택하세요</option>
          <option v-for="item in items" :key="item.item_code" :value="item">
            {{ item.item_name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>주문수량</label>
        <input type="number" v-model.number="orderData.sorderCount" min="100">
      </div>
      
      <div class="form-group">
        <label>납기일자</label>
        <input type="date" v-model="orderData.deliveryDate">
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
      orderData: {
        sorderCode: '',
        clientCode: '',
        clientName: '',
        clientMgr: '',
        itemCode: '',
        itemName: '',
        sorderCount: 100,
        deliveryDate: this.getTodayDate(),
        codeValues: 'K01',
        empId: 'EMP02' // 로그인한 사용자 ID로 설정할 예정 (추후 수정합니다.)
      },
      selectedClient: '',
      selectedItem: '',
      clients: [],
      items: [],
    };
  },
  created() {
    this.fetchClients();
    this.fetchItems();
    this.orderData.sorderCode = this.generateOrderCode();
  },
  methods: {
    // 주문번호 생성
    generateOrderCode() {
      // 주문번호 생성 로직: SON + 년도(2자리) + 월(2자리) + 일(2자리) + 순번(3자리)
      const now = new Date();
      const year = now.getFullYear().toString().slice(2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      // 랜덤 숫자 3자리 (실제로는 DB에서 순차 번호를 가져와야 함)
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `SON${year}${month}${day}${randomNum}`;
    },
    // 오늘 날짜 가져오기
    getTodayDate() {
      //const now = new Date(); // 현재 날짜 date 객체 생성
      const deliveryDate = new Date(new Date().setDate(new Date().getDate() + 60)); // 현재 날짜 date에서 +60일 2개월 후 날짜
      return deliveryDate.toISOString().split('T')[0]; // YYYY-MM-DDTHH:mm:ss.sssZ 형식으로 변환 날짜와 시간을 T로 구분을 하니 split을 통해 날짜만 가져옴
    },
    // 거래처 목록 조회
    async fetchClients() {
      try {
        const response = await axios.get('/api/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('거래처 목록을 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '거래처 목록을 불러오는데 실패했습니다.'
        });
      }
    },
    // 품목 목록 조회
    async fetchItems() {
      try {
        const response = await axios.get('/api/items');
        this.items = response.data;
      } catch (error) {
        console.error('품목 목록을 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '품목 목록을 불러오는데 실패했습니다.'
        });
      }
    },
    // 거래처 선택 시 담당자 정보 자동 입력
    // 거래처 선택 시 clientCode 저장
    handleClientChange() {
      if (this.selectedClient) {
        this.orderData.clientCode = this.selectedClient.client_code;
        this.orderData.clientName = this.selectedClient.client_name;
        this.orderData.clientMgr = this.selectedClient.client_mgr;
      } else {
        this.orderData.clientCode = '';
        this.orderData.clientName = '';
        this.orderData.clientMgr = '';
      }
    },
    // 품목 선택 시 itemname 저장
    handleItemChange() {
      if (this.selectedItem) {
        this.orderData.itemCode = this.selectedItem.item_code;
        this.orderData.itemName = this.selectedItem.item_name;
      } else {
        this.orderData.itemCode = '';
        this.orderData.itemName = '';
      }
    },
    // 주문서 등록
    async registerSalesOrder() {
      // 필수 항목 검증
      if (!this.validateForm()) {
        return;
      }

      let obj ={
        sorder_code:this.orderData.sorderCode,
        client_code:this.orderData.clientCode,
        item_code:this.orderData.itemCode,
        delivery_date:this.orderData.deliveryDate,
        sorder_count:this.orderData.sorderCount,
        code_values:this.orderData.codeValues,
        emp_id:this.orderData.empId
      }

      console.log(obj);
      
      try {
        let response = await axios.post('/api/salesorders', obj);
        
        let addRes = response.data;
        console.log(addRes);
        if(addRes.isSuccessed) {
          Swal.fire({
            icon: 'success',
            title: '등록 완료',
            text: '주문서가 성공적으로 등록되었습니다.'
          });
          this.goBack();
        } else {
          console.log("등록 실패: ", response.data);
          Swal.fire({
            icon: 'error',
            title: '등록 실패',
            text: '주문서 등록 실패'
          });
        }
      } catch (error) {
        console.error('주문서 등록 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: '주문서 등록에 실패했습니다.'
        });
      }
    },
    // 폼 유효성 검사
    validateForm() {
      if (!this.orderData.clientCode) {
        Swal.fire({
          icon: 'warning',
          title: '입력 오류',
          text: '거래처를 선택해주세요.'
        });
        return false;
      }
      
      if (!this.orderData.itemCode) {
        Swal.fire({
          icon: 'warning',
          title: '입력 오류',
          text: '품목을 선택해주세요.'
        });
        return false;
      }
      
      if (!this.orderData.sorderCount || this.orderData.sorderCount < 1) {
        Swal.fire({
          icon: 'warning',
          title: '입력 오류',
          text: '주문수량을 1 이상으로 입력해주세요.'
        });
        return false;
      }
      
      if (!this.orderData.deliveryDate) {
        Swal.fire({
          icon: 'warning',
          title: '입력 오류',
          text: '납기일자를 입력해주세요.'
        });
        return false;
      }
      
      return true;
    },
    // 주문서 조회 페이지로 이동
    goBack() {
      this.$router.replace({ name: 'Salesorder' }); // url 이동을 하지만, push와 다른 점은 히스토리 스택을 쌓지 않는다. 단순히 현재 페이지 전환하는 역할
    }
  }
};
</script>

<style scoped>
.Insertorder-container {
  margin: 25px;
  color: #000 !important;
}

/* 제목과 액션 버튼 컨테이너 스타일 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  height: 50px; /* 고정 높이 설정 */
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

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 100%;
}

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

.btn-register {
  background-color: #fbff00 !important;
  color: #000 !important;
  width: 100px;
  border: none !important;
}

.btn-cancel {
  background-color: #fff !important;
  color: #000 !important;
  width: 100px;
  border: none !important;
}

/* 폼 스타일 */
.form-container {
  width: 500px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
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

.form-group input:focus,
.form-group select:focus {
  border-color: #000;
  outline: none;
  border: 2px solid #000;
}

.form-group input[readonly] {
  background-color: #f5f5f5;
  color: #666;
}

.form-group input[type="date"] {
  font-family: inherit;
}

</style>