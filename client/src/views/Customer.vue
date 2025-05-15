<template>
  <div class="Client-container">
    <div class="header-container">
      <div class="main-title">
        <h2>거래처 목록</h2>
      </div>
      <div class="action-buttons">
        <button class="btn btn-reroad" @click="fetchAllCustomer">초기화</button>
        <button class="btn btn-select" @click="showSearchModal">조회</button>
        <button class="btn btn-update" @click="confirmUpdate">수정</button>
        <button class="btn btn-delete" @click="confirmDelete">삭제</button>
        <button class="btn btn-insert" @click="showInsertModal">등록</button>
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

    <!-- 조회 모달 -->
    <div v-if="searchModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>거래처 조회</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>거래처 번호</label>
            <input type="text" v-model="searchParams.clientCode" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처명</label>
            <input type="text" v-model="searchParams.clientName" placeholder="검색">
          </div>
          <div class="form-group">
            <label>대표</label>
            <input type="text" v-model="searchParams.clientCeo" placeholder="검색">
          </div>
          <div class="form-group">
            <label>전화번호</label>
            <input type="text" v-model="searchParams.clientPhone" placeholder="검색">
          </div>
          <div class="form-group">
            <label>이메일</label>
            <input type="text" v-model="searchParams.clientEmail" placeholder="검색">
          </div>
          <div class="form-group">
            <label>주소</label>
            <input type="text" v-model="searchParams.clientAddress" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처 담당자</label>
            <input type="text" v-model="searchParams.clientMgr" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처 유형</label>
            <input type="text" v-model="searchParams.codeName" placeholder="검색">
          </div>
          <button class="btn btn-primary" @click="searchCustomer" id="modal-select-btn">조회</button>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="updateModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>거래처 수정</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>거래처 번호</label>
            <input type="text" v-model="updateParams.clientCode" readonly>
          </div>
          <div class="form-group">
            <label>거래처명</label>
            <input type="text" v-model="updateParams.clientName" placeholder="검색">
          </div>
          <div class="form-group">
            <label>대표</label>
            <input type="text" v-model="updateParams.clientCeo" placeholder="검색">
          </div>
          <div class="form-group">
            <label>전화번호</label>
            <input type="text" v-model="updateParams.clientPhone" placeholder="검색">
          </div>
          <div class="form-group">
            <label>이메일</label>
            <input type="text" v-model="updateParams.clientEmail" placeholder="검색">
          </div>
          <div class="form-group">
            <label>주소</label>
            <input type="text" v-model="updateParams.clientAddress" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처 담당자</label>
            <input type="text" v-model="updateParams.clientMgr" placeholder="검색">
          </div>
          <div class="form-group">
            <label>거래처 유형</label>
            <input type="text" v-model="updateParams.codeName" readonly>
          </div>
          <button class="btn btn-primary" @click="updateCustomer" id="modal-update-btn">수정</button>
        </div>
      </div>
    </div>

    <!-- 등록 모달 -->
    <div v-if="insertModalVisible" class="modal" @click="closeModalOnBackgroundClick">
      <div class="modal-content" @click.stop>
        <div class="modal-title">
          <h3>거래처 등록</h3>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>거래처 번호</label>
            <input type="text" v-model="insertParams.clientCode" readonly>
          </div>
          <div class="form-group">
            <label>거래처명</label>
            <input type="text" v-model="insertParams.clientName" placeholder="입력">
          </div>
          <div class="form-group">
            <label>대표</label>
            <input type="text" v-model="insertParams.clientCeo" placeholder="입력">
          </div>
          <div class="form-group">
            <label>전화번호</label>
            <input type="text" v-model="insertParams.clientPhone" placeholder="입력">
          </div>
          <div class="form-group">
            <label>이메일</label>
            <input type="text" v-model="insertParams.clientEmail" placeholder="입력">
          </div>
          <div class="form-group">
            <label>주소</label>
            <input type="text" v-model="insertParams.clientAddress" placeholder="입력">
          </div>
          <div class="form-group">
            <label>거래처 담당자</label>
            <input type="text" v-model="insertParams.clientMgr" placeholder="입력">
          </div>
          <div class="form-group">
            <label>거래처 유형</label>
            <select v-model="selectedclienttype" @change="handleClientTypeChange">
              <option value="">거래처 유형을 선택하세요</option>
              <option v-for="clienttype in clienttypes" :key="clienttype.code_name" :value="clienttype">
                {{ clienttype.code_name }}
              </option>
            </select>
          </div>
          <button class="btn btn-primary" @click="registerCustomer" id="modal-insert-btn">등록</button>
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
      customer: [],
      originalCustomer: [], // 원본 데이터 유지
      searchModalVisible: false,
      updateModalVisible: false,
      insertModalVisible: false,
      selectAll: false,
      currentPage: 1,
      selectedCustomer: null,
      searchParams : {
        clientCode: '',
        clientName: '',
        clientCeo: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientMgr: '',
        codeName: '',
      },
      updateParams : {
        clientCode: '',
        clientName: '',
        clientCeo: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientMgr: '',
        codeName: '',
      },
      insertParams : {
        clientCode: '',
        clientName: '',
        clientCeo: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientMgr: '',
        codeValues: '',
        codeName: '',
      },
      selectedclienttype: '',
      clienttypes: [],
    };
  },
  computed: {
    
  },
  created() {
    this.fetchAllCustomer();
    this.fetchClientType();
    this.insertParams.clientCode = this.generateClientCode();
  },
  methods: {
    // 거래처번호 생성
    generateClientCode() {
      // 랜덤 숫자 3자리 (실제로는 DB에서 순차 번호를 가져와야 함)
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `CUT${randomNum}`;
    },
    async fetchAllCustomer() {
      try {
        const response = await axios.get('/api/customer');
        this.customer = response.data.map(cut => ({
          ...cut,
          selected: false
        }));
        this.originalCustomer = [...this.customer];
      } catch (error) {
        console.error('거래처 데이터를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '거래처 목록을 불러오는데 실패했어요.'
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
    showInsertModal() {
      console.log('insertModalVisible called'); // 호출 확인
      this.insertModalVisible = true;
      console.log('insertModalVisible:', this.insertModalVisible); // 상태 변경 확인
    },
    resetSearchParams() { // 조회 검색 조건 초기화
      this.searchParams = {
        clientCode: '',
        clientName: '',
        clientCeo: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientMgr: '',
        codeName: '',
      };
    },
    async searchCustomer() {
      try {
        // 검색 조건 구성
        const params = {};
        
        if (this.searchParams.clientCode) params.clientCode = this.searchParams.clientCode;
        if (this.searchParams.clientName) params.clientName = this.searchParams.clientName;
        if (this.searchParams.clientCeo) params.clientCeo = this.searchParams.clientCeo;
        if (this.searchParams.clientPhone) params.clientPhone = this.searchParams.clientPhone;
        if (this.searchParams.clientEmail) params.clientEmail = this.searchParams.clientEmail;
        if (this.searchParams.clientAddress) params.clientAddress = this.searchParams.clientAddress;
        if (this.searchParams.clientMgr) params.clientMgr = this.searchParams.clientMgr;
        if (this.searchParams.codeName) params.codeName = this.searchParams.codeName;
        
        const response = await axios.get('/api/customer/search', { params });
        
        this.customer = response.data.map(cut => ({
          ...cut,
          selected: false
        }));
        
        this.searchModalVisible = false;
        this.resetSearchParams();
        this.currentPage = 1; // 검색 결과 첫 페이지로 이동
      } catch (error) {
        console.error('거래처 검색 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '검색 실패',
          text: '거래처 검색에 실패했어요.'
        });
      }
    },
    // 거래처 유형
    async fetchClientType() {
      try {
        const response = await axios.get('/api/clienttype');
        this.clienttypes = response.data;
      } catch (error) {
        console.error('거래처 유형을 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '거래처 유형을 불러오는데 실패했어요.'
        });
      }
    },
    handleClientTypeChange() {
      if (this.selectedclienttype) {
        this.insertParams.codeValues = this.selectedclienttype.code_values;
        this.insertParams.codeName = this.selectedclienttype.code_name;
      } else {
        this.insertParams.codeName = '';
      }
    },
    confirmUpdate() {
      const selectedCustomers = this.customer.filter(cut => cut.selected);
    
      if (selectedCustomers.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '수정할 거래처 체크가 빠진 것 같아요.',
          text: '수정할 거래처를 하나만 선택해주세요.'
        });
        return;
      }

      if (selectedCustomers.length > 1) {
        Swal.fire({
          icon: 'warning',
          title: '수정할 거래처는 하나만 선택해주세요.',
          text: '수정할 거래처를 하나만 선택해주세요.'
        });
        return;
      }
      
      this.selectedCustomer = selectedCustomers[0];
      // 수정할 데이터 구성
      this.updateParams = {
        clientCode: this.selectedCustomer.client_code,
        clientName: this.selectedCustomer.client_name,
        clientCeo: this.selectedCustomer.client_ceo,
        clientPhone: this.selectedCustomer.client_phone,
        clientEmail: this.selectedCustomer.client_email,
        clientAddress: this.selectedCustomer.client_address,
        clientMgr: this.selectedCustomer.client_mgr,
        codeName: this.selectedCustomer.code_name,
      };
      this.showUpdateModal();
    },
    async updateCustomer() {
      try{
        if (!this.selectedCustomer) {
          Swal.fire({
            icon: 'error',
            title: '수정할 거래처를 선택해주세요.',
            text: '거래처를 선택해주세요.'
          });
          return;
        }

        const updatedOrder = {
          client_name: this.updateParams.clientName,
          client_ceo: this.updateParams.clientCeo,
          client_phone: this.updateParams.clientPhone,
          client_email: this.updateParams.clientEmail,
          client_address: this.updateParams.clientAddress,
          client_mgr: this.updateParams.clientMgr,
        }

        await axios.put(`/api/customer/${this.selectedCustomer.client_code}`, updatedOrder);

        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '거래처가 수정되었어요.'
        });

        this.updateModalVisible = false;
        this.selectedCustomer = null; // 선택된 거래처 초기화

        this.fetchAllCustomer();
      } catch (error) {
        console.error('거래처 수정 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '거래처 수정에 실패했어요.'
        });
      }
    },
    resetUpdateParams() {
      this.updateParams = {
        clientCode: '',
        clientName: '',
        clientCeo: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientMgr: '',
        codeName: '',
      };
    },
    confirmDelete() {
      const selectedCustomers = this.customer.filter(cuts => cuts.selected);
      
      if (selectedCustomers.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '삭제할 거래처 체크가 빠진 것 같아요.',
          text: '삭제할 거래처를 하나만 선택해주세요.'
        });
        return;
      }
      
      Swal.fire({
        title: '거래처를 정말 삭제하시겠어요?',
        text: "이 작업은 되돌릴 수 없어요.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteCustomer(selectedCustomers);
        }
      });
    },
    async deleteCustomer(selectedCustomers) {
      try {
        const clientIds = selectedCustomers.map(cut => cut.client_code);
        
        await axios.delete('/api/customer', { data: { clientIds } });
        
        Swal.fire({
          icon: 'success',
          title: '삭제 완료',
          text: '선택한 거래처가 삭제되었어요.'
        });
        
        // 목록 새로고침
        this.fetchAllCustomer();
      } catch (error) {
        console.error('주문서 삭제 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '삭제 실패',
          text: '거래처 삭제에 실패했어요.'
        });
      }
    },
    // 거래처 등록
    async registerCustomer() {
      // 필수 항목 검증
      if (!this.validateForm()) {
        return;
      }

      let obj ={
        client_code:this.insertParams.clientCode,
        client_name:this.insertParams.clientName,
        client_ceo:this.insertParams.clientCeo,
        client_phone:this.insertParams.clientPhone,
        client_email:this.insertParams.clientEmail,
        client_address:this.insertParams.clientAddress,
        client_mgr:this.insertParams.clientMgr,
        code_values:this.insertParams.codeValues
      }

      console.log(obj);
      
      try {
        let response = await axios.post('/api/customer', obj);
        
        let addRes = response.data;
        console.log(addRes);
        if(addRes.isSuccessed) {
          Swal.fire({
            icon: 'success',
            title: '등록 완료',
            text: '거래처가 성공적으로 등록되었어요.'
          });
        } else {
          console.log("등록 실패: ", response.data);
          Swal.fire({
            icon: 'error',
            title: '등록 실패',
            text: '거래처가 등록 실패되었어요.'
          });
        }
        this.insertModalVisible = false;

        // 목록 새로고침
        this.fetchAllCustomer();
      } catch (error) {
        console.error('거래처 등록 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: '거래처가 등록 실패되었어요.'
        });
      }
    },
    // 폼 유효성 검사
    validateForm() {
      
      if (!this.insertParams.codeName) {
        Swal.fire({
          icon: 'warning',
          title: '입력 오류',
          text: '거래처 유형을 선택해주세요.'
        });
        return false;
      }
      return true;
    },
    // 배경 클릭 시에만 모달 닫기
    closeModalOnBackgroundClick(event) {
    if (event.target.className === 'modal') {
        if (this.searchModalVisible || this.updateModalVisible || this.insertModalVisible) {
          this.resetSearchParams();
        }
        this.searchModalVisible = false;
        this.updateModalVisible = false;
        this.insertModalVisible = false;
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
.btn-reroad {
  background-color: #00ffc8 !important;
  color: #000 !important;
  width: 110px !important;
  border: none !important;
}

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

.btn-insert {
  background-color: #fbff00 !important;
  color: #000 !important;
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