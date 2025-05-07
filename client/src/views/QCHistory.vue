<!-- client/src/views/QCHistory.vue -->
<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">자재 품질검사 이력 조회</h2>
  
      <!-- 검색 및 액션 버튼 -->
      <div class="d-flex align-items-center mb-3 gap-2">
        <input
          v-model="searchCode"
          type="text"
          class="form-control form-control-sm w-auto"
          placeholder="자재코드 검색"
        />
        <input
          v-model="startDate"
          type="date"
          class="form-control form-control-sm w-auto"
        />
        <span>~</span>
        <input
          v-model="endDate"
          type="date"
          class="form-control form-control-sm w-auto"
        />
  
        <!-- 선택 삭제 -->
        <button
          class="btn btn-sm btn-danger"
          :disabled="!selected.length"
          @click="deleteSelected"
        >
          삭제
        </button>
  
        <!-- 선택 엑셀 다운로드 -->
        <button
          class="btn btn-sm btn-success ms-auto"
          :disabled="!selected.length"
          @click="exportSelected"
        >
          선택 엑셀 다운로드
        </button>
      </div>
  
      <!-- 검사 이력 테이블 -->
      <div class="table-responsive">
        <table class="table modern-table text-center mb-0">
          <thead>
            <tr>
              <th style="width:1%">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleAll"
                />
              </th>
              <th>#</th>
              <th>QC 번호</th>
              <th>발주ID</th>
              <th>자재코드</th>
              <th>자재명</th>
              <th>검사일자</th>
              <th>결과</th>
              <th>검사자</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in pagedHistory"
              :key="item.qc_no"
            >
              <td>
                <input
                  type="checkbox"
                  v-model="selected"
                  :value="item.qc_no"
                />
              </td>
              <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td>{{ item.qc_no }}</td>
              <td>{{ item.moder_id }}</td>
              <td>{{ item.mater_code }}</td>
              <td>{{ item.mater_name }}</td>
              <td>{{ item.qc_date }}</td>
              <td>{{ item.qc_result }}</td>
              <td>{{ item.inspector }}</td>
            </tr>
            <tr v-if="filteredHistory.length === 0">
              <td colspan="9" class="text-muted">조회된 이력이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 페이지네이션 -->
      <nav v-if="pagesCount > 1" class="mt-3">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
            >
              이전
            </a>
          </li>
          <li
            class="page-item"
            v-for="n in pagesCount"
            :key="n"
            :class="{ active: n === currentPage }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(n)"
            >
              {{ n }}
            </a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === pagesCount }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
            >
              다음
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'QCHistory',
    data() {
      return {
        historyList: [],    // 전체 QC 이력
        selected: [],       // 체크된 qc_no
        searchCode: '',     // 자재코드 검색어
        startDate: '',      // 시작일
        endDate: '',        // 종료일
        currentPage: 1,     // 현재 페이지
        pageSize: 10        // 페이지당 항목 수
      };
    },
    computed: {
      filteredHistory() {
        return this.historyList.filter(r => {
          const byCode = this.searchCode
            ? r.mater_code.includes(this.searchCode)
            : true;
          const byStart = this.startDate
            ? r.qc_date >= this.startDate
            : true;
          const byEnd = this.endDate
            ? r.qc_date <= this.endDate
            : true;
          return byCode && byStart && byEnd;
        });
      },
      pagesCount() {
        return Math.ceil(this.filteredHistory.length / this.pageSize);
      },
      pagedHistory() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredHistory.slice(start, start + this.pageSize);
      },
      allSelected() {
        return (
          this.pagedHistory.length > 0 &&
          this.pagedHistory.every(item => this.selected.includes(item.qc_no))
        );
      }
    },
    async created() {
      try {
        const res = await axios.get('/api/qc_history');
        this.historyList = res.data;
      } catch (e) {
        console.error('이력 조회 실패', e);
        alert('품질검사 이력 조회 중 오류가 발생했습니다.');
      }
    },
    methods: {
      toggleAll(evt) {
        this.selected = evt.target.checked
          ? this.pagedHistory.map(item => item.qc_no)
          : [];
      },
      changePage(page) {
        if (page < 1 || page > this.pagesCount) return;
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // 페이지 변경 시 선택 초기화
        this.selected = [];
      },
      async deleteSelected() {
        if (!this.selected.length) return;
        if (!confirm(`선택한 ${this.selected.length}개 이력을 삭제하시겠습니까?`)) {
          return;
        }
        try {
          await Promise.all(
            this.selected.map(id =>
              axios.delete(`/api/qc_inspections/${id}`)
            )
          );
          // 삭제 후 목록 다시 로드
          const res = await axios.get('/api/qc_history');
          this.historyList = res.data;
          this.selected = [];
        } catch (e) {
          console.error('삭제 실패', e);
          alert('삭제 중 오류가 발생했습니다.');
        }
      },
      async exportSelected() {
        if (!this.selected.length) return;
        try {
          // 선택한 ID 배열을 서버로 전달
          const res = await axios.post(
            '/api/qc_history/export',
            { ids: this.selected },
            { responseType: 'blob' }
          );
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', 'QC_History_Selected.xlsx');
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.error('선택 엑셀 다운로드 실패', e);
          alert('선택 엑셀 다운로드 중 오류가 발생했습니다.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .modern-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .modern-table thead th {
    background-color: #f4f6f8;
    color: #333;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .modern-table tbody td {
    padding: 0.75rem 1rem;
    color: #555;
  }
  .modern-table tbody tr:nth-child(even) {
    background-color: #fafbfc;
  }
  .modern-table tbody tr:hover {
    background-color: #eef6ff;
  }
  .pagination .page-item.disabled .page-link {
    pointer-events: none;
    opacity: 0.6;
  }
  </style>
  