<template>
<div class="sorder-container">
    <!-- 제목과 액션 버튼을 같은 행에 배치 -->
    <div class="header-container">
      <div class="main-title"> <!-- title -->
        <h2>주문서 목록</h2>
      </div>
      <!-- 모든 버튼에 active 효과 / action-buttons 제외 하고 색깔 변경 -->
      <div class="action-buttons">
        <button class="btn btn-select" @click="showSearchModal">조회</button> <!-- 조회 modal -->
        <button class="btn btn-update" @click="confirmUpdate">수정</button> <!-- 수정 modal // confirmUpdate => showUpdateModal => searchSalesOrders -->
        <button class="btn btn-delete" @click="confirmDelete">삭제</button>
        <button class="btn btn-outline" @click="insertSqt">출고</button> <!-- shipment quantity 출고량 -->
      </div>
    </div>
    
    <!-- 필터 버튼과 정렬 버튼을 같은 행에 배치 -->
    <!-- filter-buttons setFilter methods / sort-buttons sortBy methods -->
    <div class="filter-sort-container">
      <div class="filter-buttons">
        <button class="btn btn-filter" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">전체</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'planned' }" @click="setFilter('planned')">대기</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'progress' }" @click="setFilter('progress')">진행중</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'complete' }" @click="setFilter('complete')">완료</button>
      </div>

      <div class="sort-buttons">
        <button class="btn btn-sort" :class="{ active: activeSort === 'order_code' }" @click="sortBy('order_code')">주문번호</button>
        <button class="btn btn-sort" :class="{ active: activeSort === 'delivery_date' }" @click="sortBy('delivery_date')">납기일자</button>
        <button class="btn btn-sort" :class="{ active: activeSort === 'client_name' }" @click="sortBy('client_name')">거래처명</button>
        <button class="btn btn-sort" :class="{ active: activeSort === 'item_name' }" @click="sortBy('item_name')">품목명</button>
        <button class="btn btn-sort" :class="{ active: activeSort === 'client_mgr' }" @click="sortBy('client_mgr')">담당자</button>
      </div>
    </div>

    <!-- 주문서 테이블 -->
    <div class="order-table">
      <table>
        <thead>
          <tr>
            <!-- seletAll 초기 false / @change 해당 태그의 값이 변할 때 함수 or 특정 동작의 값이 실행-->
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>주문번호</th>
            <th>거래처명</th>
            <th>담당자</th>
            <th>품목명</th>
            <th>납기일자</th>
            <th>주문수량</th>
            <th>상태</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in salesOrders" :key="order.sorder_code">
            <td><input type="checkbox" v-model="order.selected"></td>
            <td>{{ order.sorder_code }}</td>
            <td>{{ order.client_name }}</td>
            <td>{{ order.client_mgr }}</td>
            <td>{{ order.item_name }}</td>
            <td>{{ formatDate(order.delivery_date) }}</td>
            <td>{{ order.sorder_count }}</td>
            <td>{{ order.code_name }}</td>
            <td>{{ order.emp_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 조회 모달 -->
    <div v-if="searchModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>주문서 조회</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>주문번호</label>
            <input type="text" v-model="searchParams.sorderCode" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처명</label>
            <input type="text" v-model="searchParams.clientName" placeholder="검색">
          </div>
          <div class="form-group">
            <label>담당자</label>
            <input type="text" v-model="searchParams.clientMgr" placeholder="검색">
          </div>
          <div class="form-group">
            <label>품목명</label>
            <input type="text" v-model="searchParams.itemName" placeholder="검색">
          </div>
          <div class="form-group">
            <label>주문수량</label>
            <input type="number" v-model="searchParams.sorderCount" placeholder="수량">
          </div>
          <div class="form-group">
            <label>납기일자</label>
            <input type="date" v-model="searchParams.deliveryDate">
          </div>
          <button class="btn btn-primary" @click="searchSalesOrders" id="modal-select-btn">조회</button>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="updateModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>주문서 수정</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>주문번호</label>
            <input type="text" v-model="updateParams.sorderCode" readonly>
          </div>
          <div class="form-group">
            <label>거래처명</label>
            <input type="text" v-model="updateParams.clientName" readonly>
          </div>
          <div class="form-group">
            <label>담당자</label>
            <input type="text" v-model="updateParams.clientMgr" readonly>
          </div>
          <div class="form-group">
            <label>품목명</label>
            <input type="text" v-model="updateParams.itemName" readonly>
          </div>
          <div class="form-group">
            <label>주문수량</label>
            <input type="number" v-model="updateParams.sorderCount">
          </div>
          <div class="form-group">
            <label>납기일자</label>
            <input type="date" v-model="updateParams.deliveryDate">
          </div>
          <button class="btn btn-primary" @click="updateSalesOrders" id="modal-update-btn">수정</button>
        </div>
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
      salesOrders: [],
      originalSalesOrders: [], // 원본 데이터 유지
      activeFilter: 'all',
      activeSort: '',
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
    this.fetchAllSalesOrders();
  },
  methods: {
    async fetchAllSalesOrders() {
      try {
        const response = await axios.get('/api/salesorders');
        this.salesOrders = response.data.map(order => ({
          ...order,
          selected: false
        }));
        this.originalSalesOrders = [...this.salesOrders];
      } catch (error) {
        console.error('주문서 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '주문서 목록을 불러오는데 실패했어요.'
        });
      }
    },
    setFilter(filter) {
      this.activeFilter = filter;
      // 필터에 따른 데이터 필터링
      if (filter === 'all') {
        this.salesOrders = [...this.originalSalesOrders];
      } else if (filter === 'planned') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.code_name === '대기');
      } else if (filter === 'progress') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.code_name === '진행중');
      } else if (filter === 'complete') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.code_name === '완료');
      }
      this.currentPage = 1; // 필터 변경 시 첫 페이지로 이동
    },
    // 정렬 기능 (통합)
    sortBy(sortType) {
      this.activeSort = sortType; // 정렬 버튼 활성화
      // localeCompare를 사용하여 문자열 정렬 -> 쿼리문으로 정렬하는게 될지 확인 후 수정 예정
      switch (sortType) {
        case 'order_code':
          this.salesOrders.sort((a, b) => a.sorder_code.localeCompare(b.sorder_code));
          break;
        case 'delivery_date':
          this.salesOrders.sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
          break;
        case 'client_name':
          this.salesOrders.sort((a, b) => a.client_name.localeCompare(b.client_name));
          break;
        case 'item_name':
          this.salesOrders.sort((a, b) => a.item_name.localeCompare(b.item_name));
          break;
        case 'client_mgr':
          this.salesOrders.sort((a, b) => a.client_mgr.localeCompare(b.client_mgr));
          break;
        default:
          break;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    toggleSelectAll() {
      this.salesOrders.forEach(order => {
        order.selected = this.selectAll;
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
          text: '주문서 검색에 실패했어요.'
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
          sorder_count: this.updateParams.sorderCount,
          delivery_date: this.updateParams.deliveryDate
        }

        await axios.put(`/api/salesorders/${this.selectedOrder.sorder_code}`, updatedOrder);

        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '주문서가 수정되었어요.'
        });

        this.updateModalVisible = false;
        this.selectedOrder = null; // 선택된 주문서 초기화

        this.fetchAllSalesOrders();
      } catch (error) {
        console.error('주문서 수정 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '주문서 수정에 실패했어요.'
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
          text: '선택한 주문서가 삭제되었어요.'
        });
        
        // 목록 새로고침
        this.fetchAllSalesOrders();
      } catch (error) {
        console.error('주문서 삭제 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '삭제 실패',
          text: '주문서 삭제에 실패했어요.'
        });
      }
    },
    insertSqt() {
      
      this.$router.push({ 
        name: 'InsertSqt' 
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
.sorder-container {
  margin: 25px;
  color: #000 !important;
}

/* 제목과 액션 버튼 컨테이너 스타일 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-title h2 {
  margin: 0;
  font-weight: bold;
  color: #000 !important;
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

/* 필터 버튼과 정렬 버튼 컨테이너 스타일 */
.filter-sort-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.sort-buttons {
  display: flex;
  gap: 10px;
}

/* 필터 버튼 스타일 */
.btn-filter {
  background-color: #fff !important;
  color: #000 !important;
  width: 100px !important;
  border: 1px solid #ddd;
  border: none !important;
}

.btn-filter.active {
  background-color: #0000ff !important;
  color: #fff !important;
  border-color: #0000ff;
}

/* 액션 버튼 스타일 */
.btn-select {
  background-color: #0000ff !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-update {
  background-color: #28a745 !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-delete {
  background-color: #dc3545 !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-outline {
  background-color: #ff9100 !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

/* 정렬 버튼 스타일 */
.btn-sort {
  background-color: white !important;
  color: #000 !important;
  border: 1px solid #ddd;
  width: 150px !important;
  border: none !important;
} 

.btn-sort.active {
  background-color: #0000ff !important;
  color: #fff !important;
  border-color: #0000ff;
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
  background: rgba(0,0,0,0.5);
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