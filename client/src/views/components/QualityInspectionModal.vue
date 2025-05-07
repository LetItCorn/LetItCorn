<!-- client/src/views/components/QualityInspectionModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">품질 검사</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-bordered text-center mb-0">
              <thead>
                <tr>
                  <th>발주ID</th>
                  <th>자재코드</th>
                  <th>수량</th>
                  <th>발주일</th>
                  <th>납기일</th>
                  <th v-if="inspected">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in orders"
                  :key="order.moder_id + '-' + order.mater_code"
                >
                  <td>{{ order.moder_id }}</td>
                  <td>{{ order.mater_code }}</td>
                  <td>{{ order.moder_qty }}</td>
                  <td>{{ order.moder_date }}</td>
                  <td>{{ order.due_date }}</td>
                  <td v-if="inspected">{{ getResult(order) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="!inspected"
            class="btn btn-primary"
            @click="runInspection"
          >검사 실행</button>
          <button
            v-else
            class="btn btn-success"
            @click="completeInspection"
          >완료</button>
          <button class="btn btn-secondary" @click="close">
            취소
          </button>
        </div>
        <div v-if="inspected" class="text-success text-center mt-2">
          입고/반품으로 데이터를 넘겼습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QualityInspectionModal',
  props: {
    visible: Boolean,
    orders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inspected: false,
      results: []  // [{ order, status }]
    };
  },
  methods: {
    async runInspection() {
      // 랜덤으로 PASS / FAIL 생성
      this.results = this.orders.map(o => ({
        order: o,
        status: Math.random() < 0.5 ? 'PASS' : 'FAIL'
      }));
      this.inspected = true;

      // 부모로 즉시 전달
      const payload = this.results.map(r => ({
        moder_id:   r.order.moder_id,
        mater_code: r.order.mater_code,
        qc_result:  r.status
      }));
      this.$emit('inspect', payload);
    },
    completeInspection() {
      this.close();
    },
    close() {
      // 상태 초기화
      this.inspected = false;
      this.results = [];
      this.$emit('close');
    },
    getResult(order) {
      const r = this.results.find(
        r => r.order.moder_id === order.moder_id &&
             r.order.mater_code === order.mater_code
      );
      return r ? r.status : '';
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.modal-dialog {
  width: 90%;
  max-width: 700px;
  margin: 0;
}
.modal-content {
  max-height: 80vh;
  display: flex; flex-direction: column;
  background: #fff;
  border-radius: 0.3rem;
  overflow: hidden;
}
.modal-header,
.modal-footer {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
}
.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
}
.table th,
.table td {
  vertical-align: middle;
  padding: 0.5rem 0.75rem;
}
</style>
