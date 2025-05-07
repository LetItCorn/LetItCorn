<!-- client/src/views/MReturnsList.vue -->
<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">반품 목록</h2>
  
      <div class="table-responsive">
        <table class="table modern-table text-center mb-0">
          <thead>
            <tr>
              <th>반품ID</th>
              <th>발주ID</th>
              <th>자재코드</th>
              <th>반품일자</th>
              <th>담당자</th>
              <th>사유</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in returns" :key="r.return_id">
              <td>{{ r.return_id }}</td>
              <td>{{ r.moder_id }}</td>
              <td>{{ r.mater_code }}</td>
              <td>{{ r.return_date }}</td>
              <td>{{ r.manager }}</td>
              <td>{{ r.reason }}</td>
              <td>{{ r.status }}</td>
            </tr>
            <tr v-if="!returns.length">
              <td colspan="7" class="text-muted">등록된 반품이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'MReturnsList',
    data() {
      return {
        returns: []
      };
    },
    async created() {
      try {
        const res = await axios.get('/api/m_returns');
        this.returns = res.data;
      } catch (e) {
        console.error('반품 목록 조회 실패', e);
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
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
  }
  .modern-table thead th {
    background-color: #f4f6f8;
    font-weight: 600;
    padding: 0.75rem 1rem;
  }
  .modern-table tbody td {
    padding: 0.5rem 0.75rem;
  }
  </style>
  