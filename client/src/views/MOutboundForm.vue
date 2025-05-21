<!-- client/src/views/MOutboundForm.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 출고 처리</h2>

    <div class="row gx-4">
      <!-- ▣ 좌측 : J01 생산지시 목록 ------------------------------------- -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light"><strong>출고 대상 생산지시&nbsp;(J01)</strong></div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-bordered table-hover mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th style="width:1%"></th>
                    <th>지시번호</th>
                    <th>시작일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="inst in instList"
                    :key="inst.inst_head"
                    :class="{ 'table-active': inst.inst_head === selectedInst }"
                  >
                    <td>
                      <input
                        type="radio"
                        name="instSelect"
                        :value="inst.inst_head"
                        v-model="selectedInst"
                      />
                    </td>
                    <td>{{ inst.inst_head }}</td>
                    <td>{{ inst.inst_start }}</td>
                  </tr>
                  <tr v-if="!instList.length">
                    <td colspan="3" class="text-muted py-4">처리 가능한 생산지시가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ▣ 우측 : 필요 자재(BOM × 지시수량) ----------------------------- -->
      <div class="col-md-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light"><strong>필요 자재</strong></div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-bordered mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th>자재코드</th>
                    <th class="text-start ps-3">자재명</th>
                    <th>단위</th>
                    <th>필요수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in bomRows" :key="r.mater_code">
                    <td>{{ r.mater_code }}</td>
                    <td class="text-start ps-3">{{ r.mater_name }}</td>
                    <td>{{ r.unit_name }}</td>
                    <td>{{ Number(r.required_qty).toLocaleString() }}</td>
                  </tr>
                  <tr v-if="!bomRows.length">
                    <td colspan="4" class="text-muted py-4">
                      왼쪽에서 생산지시를 선택하세요.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ▣ 출고 실행 버튼 -------------------------------------------- -->
        <div class="text-end">
          <button
            class="btn btn-success"
            :disabled="!selectedInst || !bomRows.length"
            @click="processOutbound"
          >
            출고 실행
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MOutboundForm',
  data() {
    return {
      instList: [],      // J01 상태 생산지시 목록
      selectedInst: '',  // 선택한 inst_head
      bomRows: []        // 필요 자재 목록
    };
  },
  async created() {
    await this.refreshInstList();
  },
  watch: {
    /* 지시 선택 → 필요 자재 재조회 */
    selectedInst: {
      async handler(instHead) {
        if (!instHead) {
          this.bomRows = [];
          return;
        }
        try {
          const { data } = await axios.get(`/api/outbound_candidates/instruction/${instHead}`);
          this.bomRows = data;
        } catch (e) {
          console.error('BOM 자재 조회 실패', e);
          this.bomRows = [];
        }
      }
    }
  },
  methods: {
    async refreshInstList() {
      try {
        const { data } = await axios.get('/api/instructions/open');
        this.instList = data;
      } catch (e) {
        console.error('생산지시 조회 실패', e);
      }
    },

    /* ▣ 출고 실행 --------------------------------------------------- */
    async processOutbound() {
      const instHead = this.selectedInst;
      const today    = new Date().toISOString().slice(0, 10);

      /* payload 생성 */
      const records = this.bomRows.map(r => ({
        mout_id:      `${instHead}-${r.mater_code}-${Date.now()}`,
        mater_code:   r.mater_code,
        mout_qty:     r.required_qty,
        mout_date:    today,
        mout_checker: '현재사용자',
        lot_cnt:      null,          // LOT 구분 사용 안함
        mater_lot:    null
      }));

      try {
        const { data } = await axios.post('/api/m_outbound/instruction', {
          inst_head: instHead,
          records
        });

        if (data.success) {
          alert('자재 출고가 완료되었습니다.');
          /* 화면 초기화 및 목록 갱신 */
          this.selectedInst = '';
          this.bomRows = [];
          await this.refreshInstList();
        } else {
          // 오류 메시지 하나만 추려 표시
          const msg = (data.results && data.results[0]?.error) || '알 수 없는 오류';
          alert(`출고 실패: ${msg}`);
        }
      } catch (e) {
        console.error('출고 처리 서버 오류', e);
        alert('서버 오류가 발생했습니다.');
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

/* 테두리 색상을 통일 */
.table-bordered th,
.table-bordered td {
  border: 1px solid #adb5bd !important;
}
</style>
