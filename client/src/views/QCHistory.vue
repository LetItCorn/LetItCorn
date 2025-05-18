<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 품질검사 이력 조회</h2>

    <!-- 검색 및 액션 버튼 -->
    <div class="d-flex align-items-center mb-3 gap-2">
      <input
        v-model="searchNo"
        type="text"
        class="form-control form-control-sm w-auto"
        placeholder="검사번호 검색"
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

    <!-- 이력 테이블 -->
    <div class="table-responsive">
      <table class="table table-bordered text-center modern-table mb-0">
        <thead>
          <tr>
            <th style="width:1%">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
              />
            </th>
            <th>검사번호</th>
            <th>검사항목</th>
            <th>기준값</th>
            <th>단위</th>
            <th>판정</th>
            <th>검사일자</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in pagedHistory"
            :key="item.qc_no"
          >
            <td>
              <input
                type="checkbox"
                v-model="selected"
                :value="item.qc_no"
              />
            </td>
            <td>{{ item.qc_no }}</td>
            <td>{{ item.test_field }}</td>
            <td>{{ item.test_stand }}</td>
            <td>{{ item.unit }}</td>
            <td>
              <span
                :class="{
                  'text-success': item.qc_result === 'PASS',
                  'text-danger':  item.qc_result === 'FAIL'
                }"
              >
                {{ item.qc_result }}
              </span>
            </td>
            <td>{{ item.qc_date }}</td>
          </tr>
          <tr v-if="filteredHistory.length === 0">
            <td colspan="7" class="text-muted">조회된 이력이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <nav v-if="pagesCount > 1" class="mt-3">
      <ul class="pagination justify-content-center mb-0">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
        >
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
        <li
          class="page-item"
          :class="{ disabled: currentPage === pagesCount }"
        >
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
      historyList: [],      // merged QC 이력
      testItems: [],        // 테스트 항목 메타
      selected: [],         // 체크된 QC 번호
      searchNo: '',         // 검사번호 검색어
      startDate: '',        // 시작일
      endDate: '',          // 종료일
      currentPage: 1,       // 현재 페이지
      pageSize: 10,         // 페이지당 항목 수
      allowed: ['QC011','QC012','QC013','QC014','QC015']  // 모달과 동일
    };
  },
  computed: {
    filteredHistory() {
      return this.historyList.filter(r => {
        const byNo = this.searchNo
          ? r.qc_no.includes(this.searchNo)
          : true;
        const byStart = this.startDate
          ? r.qc_date >= this.startDate
          : true;
        const byEnd = this.endDate
          ? r.qc_date <= this.endDate
          : true;
        return byNo && byStart && byEnd;
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
        this.pagedHistory.every(item =>
          this.selected.includes(item.qc_no)
        )
      );
    }
  },
  async created() {
    try {
      // 이력 + 테스트 항목 메타 동시 조회
      const [histRes, qcRes] = await Promise.all([
        axios.get('/api/qc_history'),
        axios.get('/api/test_qc')
      ]);
      this.testItems = qcRes.data;
      // QC011~QC015만 필터링 해 메타 정보 병합
      this.historyList = histRes.data
        .filter(r => this.allowed.includes(r.qc_no))
        .map(r => {
          const meta = this.testItems.find(q => q.test_no === r.qc_no) || {};
          return {
            ...r,
            test_field: meta.test_field,
            test_stand: meta.test_stand,
            unit:       meta.unit
          };
        });
    } catch (e) {
      console.error('이력 또는 항목 조회 실패', e);
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
      this.selected = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // 삭제 후 다시 로드
        await this.reloadHistory();
        this.selected = [];
      } catch (e) {
        console.error('삭제 실패', e);
        alert('삭제 중 오류가 발생했습니다.');
      }
    },
    async exportSelected() {
      if (!this.selected.length) return;
      try {
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
        alert('엑셀 내보내기 중 오류가 발생했습니다.');
      }
    },
    async reloadHistory() {
      // 삭제 후 다시 데이터 로드
      const histRes = await axios.get('/api/qc_history');
      this.historyList = histRes.data
        .filter(r => this.allowed.includes(r.qc_no))
        .map(r => {
          const meta = this.testItems.find(
            q => q.test_no === r.qc_no
          ) || {};
          return {
            ...r,
            test_field: meta.test_field,
            test_stand: meta.test_stand,
            unit:       meta.unit
          };
        });
    }
  }
};
</script>

<style scoped>
/* 기존 QCHistory 스타일 유지 */
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
