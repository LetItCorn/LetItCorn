<!-- client/src/views/MOrdersList.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">발주서 조회</h2>

    <div class="d-flex justify-content-end mb-3 gap-2">
      <router-link to="/m_orders" class="btn btn-primary">새 발주서 등록</router-link>
      <button class="btn btn-warning" @click="showQualityModal = true">
        <i class="bi bi-gear-fill me-1"></i> 품질 검사
      </button>
    </div>

    <div class="table-responsive">
      <table class="table modern-table text-center mb-0">
        <thead>
          <tr>
            <th>발주ID</th>
            <th>자재코드</th>
            <th>수량</th>
            <th>발주일</th>
            <th>납기일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.moder_id+'-'+o.mater_code">
            <td>{{ o.moder_id }}</td>
            <td>{{ o.mater_code }}</td>
            <td>{{ o.moder_qty }}</td>
            <td>{{ o.moder_date }}</td>
            <td>{{ o.due_date }}</td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="5" class="text-muted">등록된 발주서가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 품질 검사 모달 -->
    <QualityInspectionModal
      :visible="showQualityModal"
      :orders="orders"
      @close="showQualityModal = false"
      @inspect="handleInspection"
    />
  </div>
</template>

<script>
import axios from 'axios';
import QualityInspectionModal from './components/QualityInspectionModal.vue';

export default {
  name: 'MOrdersList',
  components: { QualityInspectionModal },
  data() {
    return {
      orders: [],
      showQualityModal: false
    };
  },
  async created() {
    const res = await axios.get('/api/m_orders');
    this.orders = res.data;
  },
  methods: {
    handleInspection(results) {
      const pass = results.filter(r => r.status === 'PASS').map(r => r.order);
      const fail = results.filter(r => r.status === 'FAIL').map(r => r.order);
      // 예시: console.log
      console.log('합격:', pass, '불합격:', fail);
      // TODO: pass는 입고 페이지로, fail은 반품 처리로 이동/저장
      this.$router.push({ name: 'MInboundForm', query: { pass: JSON.stringify(pass) } });
    }
  }
};
</script>

<style scoped>
/* modern-table 스타일 재사용 */
</style>
