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
                  <th>측정값</th>
                  <th>판정</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in testItems" :key="item.test_no">
                  <td>{{ item.test_no }}</td>
                  <td>{{ item.test_feild }}</td>
                  <td>{{ item.test_stand }}</td>
                  <td>
                    <input
                      v-model="item.test_res"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="값 입력"
                    />
                  </td>
                  <td>
                    <select
                      v-model="item.test_stat"
                      class="form-select form-select-sm"
                    >
                      <option disabled value="">선택</option>
                      <option value="적합">적합</option>
                      <option value="부적합">부적합</option>
                    </select>
                  </td>
                  <td>
                    <input
                      v-model="item.test_etc"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="비고"
                    />
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
      testItems: [
        { test_no: 'QC011', test_feild: '온도 검사',   test_res: '', test_stat: '', test_etc: '', test_stand: '≤4℃' },
        { test_no: 'QC012', test_feild: 'pH 측정',     test_res: '', test_stat: '', test_etc: '', test_stand: '6.5~6.8' },
        { test_no: 'QC013', test_feild: '고형분 검사', test_res: '', test_stat: '', test_etc: '', test_stand: '36~38%' },
        { test_no: 'QC014', test_feild: '유지방 검사', test_res: '', test_stat: '', test_etc: '', test_stand: '10~12%' },
        { test_no: 'QC015', test_feild: '미생물 검사', test_res: '', test_stat: '', test_etc: '', test_stand: '총호기성생균수 ≤10⁴ CFU/g' }
      ]
    };
  },
  computed: {
    canComplete() {
      return this.orders.length > 0 && this.testItems.every(item => item.test_res && item.test_stat);
    }
  },
  methods: {
    completeInspection() {
      const payload = [];
      this.orders.forEach(order => {
        this.testItems.forEach(item => {
          payload.push({
            qc_no:      item.test_no,
            moder_id:   order.moder_id,
            mater_code: order.mater_code,
            qc_date:    new Date().toISOString().slice(0,10),
            qc_result:  item.test_stat,
            inspector:  this.$session ? this.$session.userId : 'unknown',
            test_res:   item.test_res,
            test_etc:   item.test_etc
          });
        });
      });
      this.$emit('inspect', payload);
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
