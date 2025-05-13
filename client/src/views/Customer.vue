<template>
  <div class="Client-container">
    <div class="header-container">
      <div class="main-title">
        <h2>거래처 목록</h2>
      </div>

      <div class="action-buttons">
        <button class="btn btn-select" @click="showSearchModal">조회</button>
        <button class="btn btn-update" @click="confirmUpdate">수정</button>
        <button class="btn btn-delete" @click="confirmDelete">삭제</button>
        <button class="btn btn-insert" @click="insertSqt">등록</button>
      </div>
    </div>

    <div class="order-table">
      <table>
        <thead>
          <tr>
            <!-- seletAll 초기 false / @change 해당 태그의 값이 변할 때 함수 or 특정 동작의 값이 실행-->
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>거래처 번호</th>
            <th>거래처명</th>
            <th>대표</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>주소</th>
            <th>거래처 담당자</th>
            <th>거래처 유형</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cut in customer" :key="cut.client_code">
            <td><input type="checkbox" v-model="cut.selected"></td>
            <td>{{ cut.client_code }}</td>
            <td>{{ cut.client_name }}</td>
            <td>{{ cut.client_ceo }}</td>
            <td>{{ cut.client_phone }}</td>
            <td>{{ cut.client_email }}</td>
            <td>{{ cut.client_address }}</td>
            <td>{{ cut.client_mgr }}</td>
            <td>{{ cut.code_name }}</td>
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
      customer: [],
      originalCustomer: [], // 원본 데이터 유지
      searchModalVisible: false,
      updateModalVisible: false,
      selectAll: false,
      currentPage: 1,
      selectedOrder: null,
      searchParams : {
        sorderCode: '',
        clientName: '',
        clientMgr: '',
        itemName: '',
        sorderCount: '',
        deliveryDate: ''
      },
      updateParams : {
        sorderCode: '',
        clientName: '',
        clientMgr: '',
        itemName: '',
        sorderCount: '',
        deliveryDate: ''
      },
    };
  },
  computed: {
    
  },
  created() {
    this.fetchAllCustomer();
  },
  methods: {
    async fetchAllCustomer() {
      try {
        const response = await axios.get('/api/customer');
        this.customer = response.data.map(cut => ({
          ...cut,
          selected: false
        }));
        this.originalCustomer = [...this.customer];
      } catch (error) {
        console.error('주문서 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '주문서 목록을 불러오는데 실패했습니다.'
        });
      }
    },
    toggleSelectAll() {
      this.customer.forEach(cut => {
        cut.selected = this.selectAll;
      });
    },
    showSearchModal() {
      console.log('showSearchModal called'); // 호출 확인
      this.searchModalVisible = true;
      console.log('searchModalVisible:', this.searchModalVisible); // 상태 변경 확인
    },
    showUpdateModal() {
      console.log('updateModalVisible called'); // 호출 확인
      this.updateModalVisible = true;
      console.log('updateModalVisible:', this.updateModalVisible); // 상태 변경 확인
    },
    resetSearchParams() { // 조회 검색 조건 초기화
      this.searchParams = {
        sorderCode: '',
        clientName: '',
        clientMgr: '',
        itemName: '',
        sorderCount: '',
        deliveryDate: ''
      };
    },
    async searchSalesOrders() {
      try {
        // 검색 조건 구성
        const params = {};
        
        if (this.searchParams.sorderCode) params.sorderCode = this.searchParams.sorderCode;
        if (this.searchParams.clientName) params.clientName = this.searchParams.clientName;
        if (this.searchParams.clientMgr) params.clientMgr = this.searchParams.clientMgr;
        if (this.searchParams.itemName) params.itemName = this.searchParams.itemName;
        if (this.searchParams.sorderCount) params.sorderCount = this.searchParams.sorderCount;
        if (this.searchParams.deliveryDate) params.deliveryDate = this.searchParams.deliveryDate;
        
        const response = await axios.get('/api/salesorders/search', { params });
        
        this.salesOrders = response.data.map(order => ({
          ...order,
          selected: false
        }));
        
        this.searchModalVisible = false;
        this.resetSearchParams();
        this.currentPage = 1; // 검색 결과 첫 페이지로 이동
      } catch (error) {
        console.error('주문서 검색 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '검색 실패',
          text: '주문서 검색에 실패했습니다.'
        });
      }
    },
    confirmUpdate() {
      const selectedOrders = this.salesOrders.filter(order => order.selected);
    
      if (selectedOrders.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '수정할 주문서 체크가 빠진 것 같아요.',
          text: '수정할 주문서를 하나만 선택해주세요.'
        });
        return;
      }

      if (selectedOrders.length > 1) {
        Swal.fire({
          icon: 'warning',
          title: '수정할 주문서는 하나만 선택해주세요.',
          text: '수정할 주문서를 하나만 선택해주세요.'
        });
        return;
      }
      
      this.selectedOrder = selectedOrders[0];
      // 수정할 데이터 구성
      this.updateParams = {
        sorderCode: this.selectedOrder.sorder_code,
        clientName: this.selectedOrder.client_name,
        clientMgr: this.selectedOrder.client_mgr,
        itemName: this.selectedOrder.item_name,
        sorderCount: this.selectedOrder.sorder_count,
        deliveryDate: this.formatDate(this.selectedOrder.delivery_date)
      };
      this.showUpdateModal();
    },
    async updateSalesOrders() {
      try{
        if (!this.selectedOrder) {
          Swal.fire({
            icon: 'error',
            title: '수정할 주문서를 선택해주세요.',
            text: '주문서를 선택해주세요.'
          });
          return;
        }

        const updatedOrder = {
          sorder_count: parseInt(this.updateParams.sorderCount, 10),
          delivery_date: this.updateParams.deliveryDate
        }

        await axios.put(`/api/salesorders/${this.selectedOrder.sorder_code}`, updatedOrder);

        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '주문서가 수정되었습니다.'
        });

        this.updateModalVisible = false;
        this.selectedOrder = null; // 선택된 주문서 초기화

        this.fetchAllSalesOrders();
      } catch (error) {
        console.error('주문서 수정 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '주문서 수정에 실패했습니다.'
        });
      }
    },
    resetUpdateParams() {
      this.updateParams = {
        sorderCode: '',
        clientName: '',
        clientMgr: '',
        itemName: '',
        sorderCount: '',
        deliveryDate: ''
      };
    },
    confirmDelete() {
      const selectedOrders = this.salesOrders.filter(order => order.selected);
      
      if (selectedOrders.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '삭제할 주문서 체크가 빠진 것 같아요.',
          text: '삭제할 주문서를 하나만 선택해주세요.'
        });
        return;
      }
      
      Swal.fire({
        title: '주문서를 정말 삭제하시겠어요?',
        text: "이 작업은 되돌릴 수 없어요.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteSalesOrder(selectedOrders);
        }
      });
    },
    async deleteSalesOrder(selectedOrders) {
      try {
        const orderIds = selectedOrders.map(order => order.sorder_code);
        
        await axios.delete('/api/salesorders', { data: { orderIds } });
        
        Swal.fire({
          icon: 'success',
          title: '삭제 완료',
          text: '선택한 주문서가 삭제되었습니다.'
        });
        
        // 목록 새로고침
        this.fetchAllSalesOrders();
      } catch (error) {
        console.error('주문서 삭제 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '삭제 실패',
          text: '주문서 삭제에 실패했습니다.'
        });
      }
    },
    insertSqt() {
      // const selectedOrders = this.salesOrders.filter(order => order.selected);
      
      // if (selectedOrders.length !== 1) {
      //   Swal.fire({
      //     icon: 'warning',
      //     title: '출고량을 등록할 주문서 체크가 빠진 것 같아요.',
      //     text: '출고량을 등록할 주문서를 하나만 선택해주세요.'
      //   });
      //   return;
      // }
      this.$router.push({ 
        name: 'InsertSqt', 
        //params: { id : selectedOrders[0].sorder_code } 
      });
    },
    // 배경 클릭 시에만 모달 닫기
    closeModalOnBackgroundClick(event) {
    if (event.target.className === 'modal') {
        if (this.searchModalVisible) {
          this.resetSearchParams();
        }
        if (this.updateModalVisible) {
          this.resetUpdateParams();
        }
        this.searchModalVisible = false;
        this.updateModalVisible = false;
      }
    },
  }
};
</script>
<style scoped>
.Client-container {
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
.btn-select {
  background-color: #0000ff !important;
  color: #fff !important;
  width: 100px !important;
}

.btn-update {
  background-color: #28a745 !important;
  color: #fff !important;
  width: 100px !important;
}

.btn-delete {
  background-color: #dc3545 !important;
  color: #fff !important;
  width: 100px !important;
}

.btn-insert {
  background-color: #fbff00 !important;
  color: #000 !important;
  width: 100px !important;
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