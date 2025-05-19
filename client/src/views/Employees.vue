<template>
  <div class="container-fluid py-3" style="height: 100vh">
    <!-- 1) 상단 필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center justify-content-end">
            <EmployeeFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadEmployees"
              @reset="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단 좌우 카드 레이아웃 -->
    <div class="row gx-3" style="height: calc(100% - 150px)">
      <!-- ◀ 좌측: 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100 d-flex flex-column">
          <div class="card-header py-2"><strong>사원 리스트</strong></div>
          <div class="card-body p-0 flex-fill overflow-auto">
            <EmployeeList
              :employees="employeeList"
              :selectedId="selected.emp_id"
              @select="selectEmp"
            />
          </div>
        </div>
      </div>

      <!-- ▶ 우측: 상세 -->
      <div class="col-md-4 h-100">
        <div class="card h-100 d-flex flex-column">
          <div class="card-header py-2"><strong>사원 상세</strong></div>
          <div class="card-body flex-fill overflow-auto">
            <EmployeeDetail
              :emp="selected"
              :codeList="codeList"
              :workList="workList"
              @create="onCreate"
              @delete="onDelete"
              @clear="clearDetail"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EmployeeFilter from './components/EmployeeFilter.vue';
import EmployeeList from './components/EmployeeList.vue';
import EmployeeDetail from './components/EmployeeDetail.vue';

export default {
  name: 'Employees',
  components: {
    EmployeeFilter,
    EmployeeList,
    EmployeeDetail,
  },
  data() {
    return {
      searchType: '',
      searchValue: '',
      employeeList: [],
      selected: {},
      codeList: [],
      workList: [],
    };
  },
  created() {
    this.loadEmployees();
  },
  methods: {
    async loadEmployees() {
      const params = {
        empId: this.searchType === 'id' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        userId: this.searchType === 'user' ? this.searchValue : ''
      };

      try {
        const res = await axios.get('/api/employees', { params });
        this.employeeList = res.data;
        this.clearDetail();
      } catch (err) {
        console.error('loadEmployees error', err);
        this.employeeList = [];
      }

      try {
        const codeList = await axios.get('/api/employees/userCode');
        this.codeList = codeList.data;
      } catch (err) {
        console.error('userCode load error', err);
        this.codeList = [];
      }

      try {
        const workList = await axios.get('/api/employees/workCode');
        this.workList = workList.data;
      } catch (err) {
        console.error('workCode load error', err);
        this.workList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadEmployees();
    },
    selectEmp(emp) {
      this.selected = { ...emp };
    },
    clearDetail() {
      this.selected = { mode: 'reg' };
    },
    async onCreate() {
      try {
        const emp = this.selected;

        if (!emp.emp_name) return alert('이름을 입력하세요.');
        if (!emp.user_id) return alert('사용자 ID를 입력하세요.');
        if (!emp.user_passd) return alert('비밀번호를 입력하세요.');
        if (!emp.role_code) return alert('권한 코드를 선택하세요.');
        if (!emp.status_code) return alert('상태 코드를 선택하세요.');
        if (!emp.hire_date) return alert('입사일을 선택하세요.');

        await axios.post('/api/employees', this.selected);
        await this.loadEmployees();
      } catch (err) {
        console.error('onCreate error', err);
      }
    },
    async onDelete() {
      if (!this.selected.emp_id) return;

      const confirmDelete = confirm('정말 삭제하시겠습니까?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`/api/employees/${this.selected.emp_id}`);
        await this.loadEmployees();
      } catch (err) {
        console.error('onDelete error', err);
      }
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
