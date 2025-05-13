<!-- src/views/Employees.vue -->
<template>
  <div class="container-fluid vh-100 py-3 d-flex flex-column">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <!-- 필터 타입 선택 -->
              <select
                v-model="searchType"
                class="form-select form-select-sm me-2"
                style="width:140px"
              >
                <option value="">[선택 없음]</option>
                <option value="id">사원ID</option>
                <option value="name">이름</option>
                <option value="user">사용자ID</option>
              </select>

              <!-- 필터 입력 -->
              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2"
                style="width:200px"
              />

              <!-- 조회 / 초기화 -->
              <button @click="loadEmployees" class="btn btn-sm btn-primary me-2" style="width:80px">
                조회
              </button>
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px">
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3) 하단: 리스트(좌 2/3) / 상세(우 1/3) -->
    <div class="row flex-grow-1 gx-3">
      <!-- 좌측 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-header">사원 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>사원ID</th>
                  <th>이름</th>
                  <th>사용자ID</th>
                  <th>휴대폰</th>
                  <th>입사일</th>
                  <th>퇴사일</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="emp in employeeList"
                  :key="emp.emp_id"
                  @click="selectEmp(emp)"
                  :class="{ 'table-active': emp.emp_id === selected.emp_id }"
                  style="cursor:pointer"
                >
                  <td>{{ emp.emp_id }}</td>
                  <td>{{ emp.emp_name }}</td>
                  <td>{{ emp.user_id }}</td>
                  <td>{{ emp.user_phone }}</td>
                  <td>{{ formatDate(emp.hire_date) }}</td>
                  <td>{{ formatDate(emp.retire_date) }}</td>
                </tr>
                <tr v-if="employeeList.length === 0">
                  <td colspan="6" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 우측 상세 -->
      <div class="col-md-4 h-100">
        <div class="card h-100">
          <div class="card-header">사원 상세 정보</div>
          <div class="card-body overflow-auto">
            <table class="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th>사원ID</th>
                  <td>
                    <input
                      v-model="selected.emp_id"
                      class="form-control form-control-sm"
                      readonly
                      placeholder="ID 입력"
                    />
                  </td>
                </tr>
                <tr>
                  <th>이름</th>
                  <td><input v-model="selected.emp_name" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>사용자ID</th>
                  <td><input v-model="selected.user_id" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>비밀번호</th>
                  <td><input v-model="selected.user_passd" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>휴대폰</th>
                  <td><input v-model="selected.user_phone" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td><input v-model="selected.user_addr" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td><input v-model="selected.user_email" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>생년월일</th>
                  <td>
                    <input
                      v-model="selected.user_birth"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>성별</th>
                  <td>
                    <select v-model="selected.user_gender" class="form-select form-select-sm">
                      <option value="">선택</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>권한코드</th>
                  <td>                      
                       <select v-model="selected.role_code" class="form-select form-select-sm">
                        <option value="">선택</option>
                        <option v-for="code in codeList" :key="code.code_values" :value="code.code_values">
                          {{ code.code_name }}
                        </option>
                      </select>
                  </td>
                </tr>
                <tr>
                  <th>근무상태코드</th>
                  <td>
                    <select v-model="selected.status_code" class="form-select form-select-sm">
                        <option value="">선택</option>
                        <option v-for="code in workList" :key="code.code_values" :value="code.code_values">
                          {{ code.code_name }}
                        </option>
                      </select>
                  </td>
                </tr>
                <tr>
                  <th>입사일</th>
                  <td>
                    <input
                      v-model="selected.hire_date"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>퇴사일</th>
                  <td>
                    <input
                      v-model="selected.retire_date"
                      type="date"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- CRUD 버튼 -->
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary flex-grow-1" @click="clearDetail">
                초기화
              </button>
              <button
                class="btn btn-success flex-grow-1"
                @click="onCreate"
                
              >
                등록
              </button>
              
              <button
                class="btn btn-danger flex-grow-1"
                @click="onDelete"
                :disabled="!selected.emp_id || selected.mode == 'reg'"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Employees',
  data() {
    return {
      searchType: '',
      searchValue: '',
      employeeList: [],
      selected: {},
      codeList:[],
      workList:[],
    };
  },
  computed: {
    // 총 사원 수
    count() {
      return this.employeeList.length;
    },
    // 검색창 placeholder
    filterPlaceholder() {
      switch (this.searchType) {
        case 'id': return '사원ID';
        case 'name': return '이름';
        case 'user': return '사용자ID';
        default: return '';
      }
    }
  },
  created() {
    this.loadEmployees();
  },
  methods: {
    // 서버에서 리스트 불러오기 (필터 적용)
    async loadEmployees() {
      const params = {
        empId: this.searchType === 'id' ? this.searchValue : '',
        name:  this.searchType === 'name' ? this.searchValue : '',
        userId:this.searchType === 'user' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/employees', { params });
        this.employeeList = res.data;
        this.clearDetail();

        
      } catch (err) {
        console.error('loadEmployees error', err);
        this.employeeList = [];
      }

      try{
        const codeList = await axios.get('/api/employees/userCode');        
        this.codeList = codeList.data;
      }catch(err){
        console.error('loadEmployees error', err);
        this.codeList = [];
      }

      try{
        const workList = await axios.get('/api/employees/workCode');        
        this.workList = workList.data;        
      }catch(err){
        console.error('loadEmployees error', err);
        this.codeList = [];
      }


    },
    // 필터 초기화
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEmployees();
    },
    // 리스트 행 클릭
    selectEmp(emp) {
      this.selected = { ...emp };
    },
    // 상세 초기화
    clearDetail() {
      this.selected = {mode:'reg'};
    },
    // 등록
    async onCreate() {
      try {
        const emp = this.selected;

        if (!emp.emp_name) {
          alert('이름을 입력하세요.');
          return;
        }
        if (!emp.user_id) {
          alert('사용자 ID를 입력하세요.');
          return;
        }
        if (!emp.user_passd) {
          alert('비밀번호를 입력하세요.');
          return;
        }
        if (!emp.role_code) {
          alert('권한 코드를 선택하세요.');
          return;
        }
        if (!emp.status_code) {
          alert('상태 코드를 선택하세요.');
          return;
        }
        if (!emp.hire_date) {
          alert('입사일을 선택하세요.');
          return;
        }

        await axios.post('/api/employees', this.selected);
        await this.loadEmployees();
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    // 수정
    async onUpdate() {
      if (!this.selected.emp_id) return;
      try {
        await axios.put(`/api/employees/${this.selected.emp_id}`, this.selected);
        await this.loadEmployees();
      } catch (err) {
        console.error('onUpdate error', err);
      }
    },
    // 삭제
    async onDelete() {
      if (!this.selected.emp_id) return;
      try {
        await axios.delete(`/api/employees/${this.selected.emp_id}`);
        await this.loadEmployees();
      } catch (err) {
        console.error('onDelete error', err);
      }
    },
    // 날짜 포맷터
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
