<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 출고 처리</h2>
    <div class="row gx-4">
      <!-- 좌측: 생산지시 단일 선택 (J01) -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light">
            <strong>출고 대상 생산지시 (J01)</strong>
          </div>
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
                    <td colspan="3" class="text-muted py-4">
                      처리 가능한 생산지시가 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: BOM 자재 리스트 -->
      <div class="col-md-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light">
            <strong>필요 자재</strong>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-bordered mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>단위</th>
                    <th>필요수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="r in bomRows"
                    :key="r.lot_cnt + '-' + r.mater_code"
                  >
                    <td>{{ r.mater_code }}</td>
                    <td class="text-start px-2">{{ r.mater_name }}</td>
                    <td>{{ r.unit_name }}</td>
                    <td>{{ r.required_qty }}</td>
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
        <!-- 출고 실행 버튼 -->
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
      selectedInst: '',  // 단일 선택된 inst_head
      bomRows: []        // 선택 지시 기반 BOM 자재 리스트
    };
  },
  async created() {
    try {
      const res = await axios.get('/api/instructions/open');
      this.instList = res.data;
    } catch (e) {
      console.error('생산지시 조회 실패', e);
    }
  },
  watch: {
    // 지시 선택이 바뀔 때마다 BOM 자재 조회
    selectedInst: {
      async handler(instHead) {
        if (!instHead) {
          this.bomRows = [];
          return;
        }
        try {
          const { data } = await axios.get(
            `/api/outbound_candidates/instruction/${instHead}`
          );
          this.bomRows = data;
        } catch (e) {
          console.error('BOM 자재 조회 실패', e);
          this.bomRows = [];
        }
      }
    }
  },
  methods: {
    async processOutbound() {
      const instHead = this.selectedInst;
      const today = new Date().toISOString().slice(0, 10);

      // 일괄 출고용 payload 생성
      const records = this.bomRows.map(r => ({
        inst_head: instHead,
        mout_id:    `${instHead}-${r.mater_code}-${Date.now()}`,
        lot_cnt:    r.lot_cnt,
        mater_code: r.mater_code,
        mout_qty:   r.required_qty,
        mout_date:  today,
        mout_checker: '현재사용자',
        mater_lot:  r.mater_lot
      }));

      try {
        const results = [];
        for (const record of records) {
          const res = await axios.post('/api/m_outbound', record);
          results.push(res.data);
        }
        // 실패한 항목 확인
        const failed = results.filter(r => !r.isSuccess);
        if (failed.length) {
          alert(
            `일부 출고 실패:\n${failed.map(f => `${f.mater_code}: ${f.error}`).join('\n')}`
          );
        } else {
          alert('자재 출고가 모두 완료되었습니다.');
        }
        // 초기화 및 목록 갱신
        this.selectedInst = '';
        this.bomRows = [];
        const tmp = await axios.get('/api/instructions/open');
        this.instList = tmp.data;
      } catch (e) {
        console.error('서버 오류', e);
        alert('서버 에러가 발생했습니다.');
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

.table-bordered th,
.table-bordered td {
  border: 1px solid #adb5bd !important;
}
</style>
