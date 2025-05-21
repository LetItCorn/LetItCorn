<!-- client/src/views/components/MOrderDetailModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">발주서 상세</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div v-if="orderData && orderData.header" class="modal-body">
          <h6>기본 정보</h6>
          <table class="table table-sm mb-3">
            <tbody>
              <tr><th>발주ID</th><td>{{ orderData.header.moder_id }}</td></tr>
              <tr><th>자재코드</th><td>{{ orderData.header.mater_code }}</td></tr>
              <tr><th>수량</th><td>{{ orderData.header.moder_qty }}</td></tr>
              <tr><th>발주일</th><td>{{ formatDate(orderData.header.moder_date) }}</td></tr>
              <tr><th>납기일</th><td>{{ formatDate(orderData.header.due_date) }}</td></tr>
              <tr><th>수신</th><td>{{ orderData.header.receiver }}</td></tr>
              <tr><th>참조</th><td>{{ orderData.header.moder_req }}</td></tr>
              <tr><th>등록번호</th><td>{{ orderData.header.reference }}</td></tr>
              <tr><th>지불조건</th><td>{{ orderData.header.payment_term }}</td></tr>
              <tr><th>거래처</th><td>{{ orderData.header.partner_name }}</td></tr>
              <tr><th>대표자</th><td>{{ orderData.header.ceo_name }}</td></tr>
              <tr><th>주소</th><td>{{ orderData.header.address }}</td></tr>
              <tr><th>업태/종목</th><td>{{ orderData.header.business_type }}</td></tr>
              <tr><th>연락처</th><td>{{ orderData.header.contact }}</td></tr>
            </tbody>
          </table>

          <h6>상세 내역</h6>
          <div class="table-responsive">
            <table class="table table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th>품명</th>
                  <th>규격</th>
                  <th>단위</th>
                  <th>수량</th>
                  <th>단가</th>
                  <th>공급가액</th>
                  <th>부가세</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, i) in orderData.details" :key="i">
                  <td>{{ d.product_name }}</td>
                  <td>{{ d.spec }}</td>
                  <td>{{ d.unit_name }}</td>
                  <td>{{ d.qty }}</td>
                  <td>{{ formatNumber(d.unit_price) }}</td>
                  <td>{{ formatNumber(d.supply_amount) }}</td>
                  <td>{{ formatNumber(d.tax_amount) }}</td>
                </tr>
                <tr v-if="!orderData.details.length">
                  <td colspan="7" class="text-muted">상세 내역이 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="modal-body text-center text-muted">
          로딩 중...
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MOrderDetailModal',
  props: {
    visible: Boolean,
    orderData: {
      type: Object,
      default: () => ({ header: {}, details: [] })
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    formatNumber(v) {
      return v != null ? v.toLocaleString() : '';
    },
    formatDate(d) {
      if (!d) return '';
      return typeof d === 'string'
        ? d.slice(0, 10)
        : new Date(d).toISOString().slice(0, 10);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050;
}
.modal-dialog {
  width: 90%; max-width: 700px;
}
.modal-content {
  max-height: 80vh;
  display: flex; flex-direction: column;
  background: #fff; border-radius: .3rem; overflow: hidden;
}
.modal-header, .modal-footer {
  background: #f8f9fa; padding: .75rem 1rem;
}
.modal-body {
  padding: 1rem; overflow-y: auto; flex: 1;
}
.btn-close {
  background: none; border: none; font-size: 1.25rem;
}
.table th, .table td {
  vertical-align: middle;
}
</style>
