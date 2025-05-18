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
                  <th>검사번호</th>
                  <th>검사항목</th>
                  <th>기준값</th>
                  <th>단위</th>
                  <th>측정값</th>
                  <th>판정</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in testItems" :key="item.test_no">
                  <td>{{ item.test_no }}</td>
                  <td>{{ item.test_field }}</td>
                  <td>{{ item.test_stand }}</td>
                  <td>{{ item.unit }}</td>
                  <td>
                    <input
                      v-model="item.test_res"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="값 입력"
                      @input="setResult(item)"
                    />
                  </td>
                  <td>
                    <span :class="{'text-success': item.test_stat === 'PASS', 'text-danger': item.test_stat === 'FAIL'}">
                      {{ item.test_stat }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-success"
            :disabled="!canComplete"
            @click="completeInspection"
          >검사완료</button>
          <button class="btn btn-secondary" @click="close">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { checkQc } from '@/utils/checkQc';
import { useInboundStore } from '@/store/inbound';

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
      testItems: []
    };
  },
  computed: {
    canComplete() {
      return this.orders.length > 0 &&
        this.testItems.every(item => item.test_res && item.test_stat);
    }
  },
  async created() {
    try {
      const res = await axios.get('/api/test_qc');
      const allowed = ['QC011','QC012','QC013','QC014','QC015'];
      this.testItems = res.data
        .filter(item => allowed.includes(item.test_no))
        .map(item => ({
          test_no: item.test_no,
          test_field: item.test_field,
          test_stand: item.test_stand,
          unit: item.unit,
          test_res: '',
          test_stat: ''
        }));
    } catch (e) {
      console.error('품질검사 항목 조회 실패', e);
    }
  },
  methods: {
    setResult(item) {
      if (!item.test_res) {
        item.test_stat = '';
        return;
      }
      const result = checkQc(item.test_res, item.test_stand);
      item.test_stat = result.toUpperCase();
    },
    async completeInspection() {
      // QC 결과 서버에 저장
      const payload = this.orders.flatMap(order =>
        this.testItems.map(item => ({
          qc_no: item.test_no,
          moder_id: order.moder_id,
          mater_code: order.mater_code,
          qc_date: new Date().toISOString().slice(0, 10),
          qc_result: item.test_stat,
          inspector: this.$session ? this.$session.userId : 'unknown',
          test_res: item.test_res
        }))
      );
      try {
        await axios.post('/api/qc_inspections', payload);
      } catch (e) {
        console.error('QC 저장 실패', e);
        alert('QC 저장 중 오류가 발생했습니다.');
        return;
      }

      // Pinia 스토어에 PASS된 발주서 저장
      const inboundStore = useInboundStore();
      const passOrders = this.orders
        .filter(order =>
          this.testItems.every(item =>
            checkQc(item.test_res, item.test_stand) === 'pass'
          )
        )
        .map(order => ({
          moder_id: order.moder_id,
          mater_code: order.mater_code,
          moder_qty: order.moder_qty
        }));
      inboundStore.setPendingOrders(passOrders);

      // 입고 처리 페이지로 이동
      this.$router.push({ name: 'MInboundForm' });
      this.close();
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-dialog {
  width: 80vw;
  max-width: 900px;
  margin: 0;
}
.modal-content {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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
