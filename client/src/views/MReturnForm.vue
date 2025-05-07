<!-- client/src/views/MReturnForm.vue -->
<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">반품 처리</h2>
  
      <!-- 안내 메시지 -->
      <div v-if="!returnRows.length" class="text-center text-muted mb-4">
        반품 대상 발주서가 없습니다.
      </div>
  
      <!-- 반품 대상 목록 카드 -->
      <div v-else class="card mb-4 shadow-sm" style="min-height:200px;">
        <div class="card-header bg-light">
          <strong>불합격 발주서 목록</strong>
        </div>
        <div class="card-body p-0 d-flex align-items-center justify-content-center">
          <div class="table-responsive w-100">
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
                  <th>발주ID</th>
                  <th>자재코드</th>
                  <th>발주수량</th>
                  <th>반품수량</th>
                  <th>사유</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in returnRows" :key="idx">
                  <td>
                    <input
                      type="checkbox"
                      v-model="selectedRows"
                      :value="row"
                    />
                  </td>
                  <td>{{ row.moder_id }}</td>
                  <td>{{ row.mater_code }}</td>
                  <td>{{ row.moder_qty }}</td>
                  <td>
                    <input
                      v-model.number="row.return_qty"
                      type="number"
                      min="1"
                      :max="row.moder_qty"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      v-model="row.reason"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="반품 사유 입력"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- 반품 처리 버튼 -->
      <div class="d-flex justify-content-end gap-2">
        <button
          class="btn btn-danger"
          :disabled="!selectedRows.length"
          @click="processReturns"
        >
          <i class="bi bi-arrow-counterclockwise me-1"></i> 반품 처리
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'MReturnForm',
    data() {
      return {
        returnRows: [],      // { moder_id, mater_code, moder_qty, return_qty, reason }
        selectedRows: []
      };
    },
    computed: {
      allSelected() {
        return (
          this.returnRows.length > 0 &&
          this.returnRows.every(r => this.selectedRows.includes(r))
        );
      }
    },
    created() {
      // query 에서 fail 리스트 파싱
      const failParam = this.$route.query.fail;
      if (failParam) {
        try {
          const fails = JSON.parse(decodeURIComponent(failParam));
          this.returnRows = fails.map(o => ({
            moder_id:  o.moder_id,
            mater_code:o.mater_code,
            moder_qty: o.moder_qty,
            return_qty: o.moder_qty,
            reason:    ''
          }));
          this.selectedRows = [...this.returnRows];
        } catch {
          console.error('반품 파라미터 파싱 실패');
        }
      }
    },
    methods: {
      toggleAll(evt) {
        this.selectedRows = evt.target.checked
          ? [...this.returnRows]
          : [];
      },
      async processReturns() {
        if (!this.selectedRows.length) return;
        try {
          const today = new Date().toISOString().slice(0,10);
          await Promise.all(
            this.selectedRows.map(r =>
              axios.post('/api/m_returns', {
                return_id: `RT${Date.now()}${Math.floor(Math.random()*10000)}`,
                moder_id:  r.moder_id,
                mater_code:r.mater_code,
                return_date: today,
                manager:   '현재사용자',
                reason:    r.reason || 'QC 불합격',
                status:    'REQUESTED'
              })
            )
          );
          alert('반품이 완료되었습니다.');
          this.$router.push({ name: 'MReturnsList' });
        } catch (e) {
          console.error('반품 처리 오류', e);
          alert('반품 처리 중 오류가 발생했습니다.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .table th,
  .table td {
    vertical-align: middle;
  }
  .modern-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .modern-table thead th {
    background-color: #f4f6f8;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .modern-table tbody td {
    padding: 0.5rem 0.75rem;
  }
  .modern-table tbody tr:nth-child(even) {
    background-color: #fafbfc;
  }
  .modern-table tbody tr:hover {
    background-color: #eef6ff;
  }
  </style>
  