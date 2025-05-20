<!-- client/src/views/components/QInspectionPDModal.vue -->
<template>
  <!-- 검사 모달 -->
  <div v-if="visible" class="modal" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3>품질검사</h3>
          </div>
        </div>

        <!-- ────── 검사 항목 테이블 ────── -->
        <div class="modal-body">
          <div class="inspection-table">
            <table class="table table-bordered text-center mb-0">
              <thead>
                <tr>
                  <th>검사번호</th>
                  <th>검사항목</th>
                  <th>기준값</th>
                  <th>측정값</th>
                  <th>단위</th>
                  <th>판정</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="isd in inspectionData" :key="isd.test_no">
                  <td>{{ isd.test_no }}</td>
                  <td>{{ isd.test_feild }}</td>
                  <td>{{ isd.test_stand }}</td>
                  <td>
                    <input
                      type="text"
                      v-model="isd.test_res"
                      placeholder="수치값 입력"
                      @input="checkQuality(isd)"
                    />
                  </td>
                  <td>{{ isd.unit }}</td>
                  <td>{{ isd.test_stat }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ────── 버튼 영역 ────── -->
        <div class="modal-footer">
          <button class="btn btn-success" @click="confirmCompleteInspection">
            검사 완료
          </button>
          <button class="btn btn-secondary" @click="close">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal  from 'sweetalert2';
import { checkQc } from '@/utils/checkQc';

export default {
  name: 'QInspectionPDModal',
  props: {
    visible: Boolean,
    orders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inspectionData: [],
      isLoading: false
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.orders.length > 0) {
        this.fetchInspectionList();
      }
    }
  },
  methods: {
    /* ─────────────── API: 검사항목 가져오기 ─────────────── */
    async fetchInspectionList() {
      try {
        const { data } = await axios.get('/api/qfproduct/inspection');
        this.inspectionData = data.map(item => ({
          ...item,
          test_res : '',
          test_stat: ''
        }));
      } catch (e) {
        console.error('검사항목 조회 오류:', e);
        Swal.fire({ icon:'error', title:'데이터 로딩 실패', text:'검사항목 리스트를 불러오는데 실패했어요.' });
      }
    },

    /* ─────────────── 입력값 누락 체크 ─────────────── */
    checkinputresult() {
      const empty = this.inspectionData.some(item => !item.test_res);
      if (empty) {
        Swal.fire({ icon:'error', title:'측정값 입력 확인', text:'측정값 입력이 빠졌어요.' });
        return false;
      }
      return true;
    },

    /* ─────────────── 판정 계산 ─────────────── */
    checkQuality(isd) {
      if (!isd.test_res) {
        isd.test_stat = '';
        return;
      }
      if (isd.test_stand.includes('~')) {
        const result     = checkQc(isd.test_res, isd.test_stand);
        isd.test_stat    = result === 'pass' ? '적합' : '부적합';
      }
    },

    /* ─────────────── 입고 payload 생성 ─────────────── */
    buildInboundPayload() {
      const order     = this.orders[0];          // 첫 행 기준
      const qtyPassed = order.iord_no;           // 지시수량 = 입고수량(필요 시 조정)
      return {
        pin_code   : 'PIN' + Date.now(),
        porder_code: order.porder_code || '',
        test_no    : 'QC_FIN',
        lot_code   : order.lot_cnt,
        prd_name   : order.item_name,
        pin_date   : new Date().toISOString().slice(0,10),
        manager    : this.$session ? this.$session.userId : 'unknown',
        pin_type   : 'IN',
        pro_stock  : 0,
        pro_fqty    : qtyPassed,
        item_code  : order.item_code || order.itemCode
      };
    },

    /* ─────────────── 검사 결과 저장 (기존 API) ─────────────── */
    async submitInspection() {
      const order   = this.orders[0];
      const payload = this.inspectionData.map(item => ({
        test_no     : item.test_no,
        inst_no     : order.inst_no,
        lot_cnt     : order.lot_cnt,
        qc_date     : new Date().toISOString().slice(0,10),
        qc_result   : item.test_stat === '적합' ? 'PASS' : 'FAIL',
        inspector   : this.$session ? this.$session.userId : 'unknown',
        test_res    : item.test_res,
        process_code: order.process_code || 'PC999'
      }));
      await axios.post('/api/qfproduct/inspection', payload);
    },

    /* ─────────────── 검사 통과 후 입고 + 상태변경 ─────────────── */
    async afterInspectionSuccess() {
      // ① 입고 기록 + 재고 증가
      await axios.post('/api/product_in', this.buildInboundPayload());
      // ② 지시상태 J04 → J05
      await axios.patch(`/api/inst_header/${this.orders[0].inst_head}/finish`);
    },

    /* ───────────────  검사 완료 버튼 클릭 ─────────────── */
    async confirmCompleteInspection() {
      if (!this.checkinputresult()) return;
      const hasFailure = this.inspectionData.some(i => i.test_stat === '부적합');
      if (hasFailure) {
        Swal.fire({ icon:'error', title:'품질검사 부적합', text:'품질 검사 재검이 필요합니다.' });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title:'검사 완료',
        text :'판정결과 적합입니다. 검사 완료하시겠어요?',
        icon :'warning',
        showCancelButton:true,
        confirmButtonText:'확인',
        cancelButtonText :'취소'
      });
      if (!isConfirmed) return;

      try {
        await this.submitInspection();      // 검사 로그 저장
        await this.afterInspectionSuccess();// 입고 + 상태변경 + 재고 누적
        await Swal.fire({ icon:'success', title:'완료', text:'검사가 성공적으로 완료됐어요!' });
        this.$emit('complete', this.orders);
        this.close();
      } catch (e) {
        console.error('검사 저장 오류:', e);
        Swal.fire({ icon:'error', title:'저장 실패', text:'검사 결과 저장에 실패했습니다.' });
      }
    },

    /* ─────────────── 모달 닫기 ─────────────── */
    close() {
      this.inspectionData = [];
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* (기존 스타일 그대로) */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-dialog { width: 80vw; max-width: 900px; margin:0; }
.modal-content {
  max-height: 80vh; display:flex; flex-direction:column;
  background:#fff; border-radius:0.3rem; overflow:hidden;
}
.modal-header, .modal-footer { padding:0.75rem 1rem; background:#f8f9fa; }
.modal-body   { padding:1rem; overflow-y:auto; flex:1; }
.table th, .table td { vertical-align:middle; padding:0.5rem 0.75rem; }
</style>
