<template>
<div class="sorder-container">
    <!-- 제목과 액션 버튼을 같은 행에 배치 -->
    <div class="header-container">
      <div class="main-title">
        <h2>거래업체 주문서 조회</h2>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-select" :class="{ active: activeAction === 'search' }" @click="showSearchModal">조회</button>
        <button class="btn btn-update" :class="{ active: activeAction === 'update' }" @click="goToAddSalesOrder">수정</button>
        <button class="btn btn-delete" :class="{ active: activeAction === 'delete' }" @click="confirmDelete">삭제</button>
        <button class="btn btn-outline" :class="{ active: activeAction === 'output' }" @click="showOutputModal">출고량 등록</button>
      </div>
    </div>
    
    <!-- 필터 버튼과 정렬 버튼을 같은 행에 배치 -->
    <div class="filter-sort-container">
      <div class="filter-buttons">
        <button class="btn btn-filter" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">전체</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'planned' }" @click="setFilter('planned')">계획됨</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'progress' }" @click="setFilter('progress')">진행중</button>
        <button class="btn btn-filter" :class="{ active: activeFilter === 'complete' }" @click="setFilter('complete')">완료</button>
      </div>

      <div class="sort-buttons">
        <button class="btn btn-sort" :class="{ active: activeSort === 'delivery_date' }" @click="sortBy('delivery_date')">납기일자</button>
        <button class="btn btn-sort" :class="{ active: activeSort === 'order_code' }" @click="sortBy('order_code')">주문번호</button>
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
            <td>{{ order.status }}</td>
            <td>{{ order.emp_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 조회 모달 -->
    <div v-if="searchModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="search-form">
          <div class="form-group">
            <label>납기일자</label>
            <div class="date-range">
              <input type="date" v-model="searchParams.startDate">
              <span>~</span>
              <input type="date" v-model="searchParams.endDate">
            </div>
          </div>
          <div class="form-group">
            <label>주문번호</label>
            <input type="text" v-model="searchParams.orderCode" placeholder="검색">
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
          <button class="btn btn-primary" @click="searchSalesOrders">조회</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'SalesOrder',
  data() {
    return {
      salesOrders: [],
      originalSalesOrders: [], // 원본 데이터 유지
      activeFilter: 'all',
      activeSort: '',
      activeAction: '',
      searchModalVisible: false,
      outputModalVisible: false,
      selectAll: false,
      currentPage: 1,
      searchParams: {
        startDate: '',
        endDate: '',
        orderCode: '',
        clientName: '',
        clientMgr: '',
        itemName: ''
      }
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
          text: '주문서 목록을 불러오는데 실패했습니다.'
        });
      }
    },
    setFilter(filter) {
      this.activeFilter = filter;
      // 필터에 따른 데이터 필터링
      if (filter === 'all') {
        this.salesOrders = [...this.originalSalesOrders];
      } else if (filter === 'planned') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.status === '계획됨');
      } else if (filter === 'progress') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.status === '진행중');
      } else if (filter === 'complete') {
        this.salesOrders = this.originalSalesOrders.filter(order => order.status === '완료');
      }
      this.currentPage = 1; // 필터 변경 시 첫 페이지로 이동
    },
    // 정렬 기능 (통합)
    sortBy(sortType) {
      this.activeSort = sortType; // 정렬 버튼 활성화
      
      switch (sortType) {
        case 'delivery_date':
          this.salesOrders.sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
          break;
        case 'order_code':
          this.salesOrders.sort((a, b) => a.sorder_code.localeCompare(b.sorder_code));
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
    async searchSalesOrders() {
      try {
        // 검색 조건 구성
        const params = {};
        
        if (this.searchParams.startDate && this.searchParams.endDate) {
          params.startDate = this.searchParams.startDate;
          params.endDate = this.searchParams.endDate;
        }
        
        if (this.searchParams.orderCode) params.orderCode = this.searchParams.orderCode;
        if (this.searchParams.clientName) params.clientName = this.searchParams.clientName;
        if (this.searchParams.clientMgr) params.clientMgr = this.searchParams.clientMgr;
        if (this.searchParams.itemName) params.itemName = this.searchParams.itemName;
        
        const response = await axios.get('/api/salesorders/search', { params });
        
        this.salesOrders = response.data.map(order => ({
          ...order,
          selected: false
        }));
        
        this.searchModalVisible = false;
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
    goToAddSalesOrder() {
      // 수정 페이지로 이동
      const selectedOrders = this.salesOrders.filter(order => order.selected);
      
      if (selectedOrders.length !== 1) {
        Swal.fire({
          icon: 'warning',
          title: '선택 오류',
          text: '수정할 주문서를 하나만 선택해주세요.'
        });
        return;
      }
      
      this.$router.push({ 
        name: 'EditSalesOrder', 
        params: { id: selectedOrders[0].sorder_code } 
      });
    },
    confirmDelete() {
      const selectedOrders = this.salesOrders.filter(order => order.selected);
      
      if (selectedOrders.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '선택 오류',
          text: '삭제할 주문서를 선택해주세요.'
        });
        return;
      }
      
      Swal.fire({
        title: '주문서를 정말 삭제하시겠어요?',
        text: "이 작업은 되돌릴 수 없습니다!",
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
    showOutputModal() {
      const selectedOrders = this.salesOrders.filter(order => order.selected);
      
      if (selectedOrders.length !== 1) {
        Swal.fire({
          icon: 'warning',
          title: '선택 오류',
          text: '출고량을 등록할 주문서를 하나만 선택해주세요.'
        });
        return;
      }
      
      this.$router.push({ 
        name: 'RegisterOutput', 
        params: { id: selectedOrders[0].sorder_code } 
      });
    },
    closeModalOnBackgroundClick(event) {
    // 배경 클릭 시에만 모달 닫기
    if (event.target.className === 'modal') {
      this.searchModalVisible = false;
    }
  }
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
}

.btn-select.active {
  background-color: #0000ff !important;
  color: #fff !important;
}

.btn-update {
  background-color: #28a745 !important;
  color: #fff !important;
  width: 100px !important;
}

.btn-update.active {
  background-color: #28a745 !important;
  color: #fff !important;
}

.btn-delete {
  background-color: #dc3545 !important;
  color: #fff !important;
  width: 100px !important;
}

.btn-delete.active {
  background-color: #dc3545 !important;
  color: #fff !important;
}

.btn-outline {
  background-color: #fbff00 !important;
  color: #000 !important;
  width: 150px !important;
}

.btn-outline.active {
  background-color: #fbff00 !important;
  color: #000 !important;
}

/* 정렬 버튼 스타일 */
.btn-sort {
  background-color: white !important;
  color: #000 !important;
  border: 1px solid #ddd;
  width: 150px !important;
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
  position: fixed !important;
  top: 10px !important; /* 화면 상단에서 약간 떨어지게 */
  left: 10px !important; /* 화면 좌측에서 약간 떨어지게 */
  width: 50vw !important; /* 화면 절반 크기 */
  height: 50vh !important; /* 화면 절반 크기 */
  background-color: red !important; /* 매우 눈에 띄는 색상 */
  z-index: 99999 !important; /* 매우 높은 z-index */
  display: flex !important; /* 강제로 flex 적용 */
  align-items: center;
  justify-content: center;
  border: 5px solid yellow; /* 눈에 띄는 테두리 */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%; /* 내부 컨텐츠 너비 */
  color: black; /* 내부 텍스트 색상 */
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