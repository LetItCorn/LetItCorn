<!-- client/src/views/MOutboundForm.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 출고 처리</h2>
    <div class="row gx-4">
      <!-- ──────────── 좌측: 생산지시 선택 ──────────── -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light">
            <strong>출고 대상 생산지시 (J01)</strong>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-hover mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th style="width:1%">
                      <input
                        type="checkbox"
                        :checked="allInstSelected"
                        @change="toggleAllInsts"
                      />
                    </th>
                    <th>지시번호</th>
                    <th>시작일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="inst in instList"
                    :key="inst.inst_head"
                    :class="{ 'table-active': selectedInsts.includes(inst.inst_head) }"
                  >
                    <td>
                      <input
                        type="checkbox"
                        :value="inst.inst_head"
                        v-model="selectedInsts"
                        @change="onInstChange"
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

      <!-- ──────────── 우측: BOM 자재 리스트 ──────────── -->
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
                    <th>가용수량</th>
                    <th>LOT 번호</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in bomRows" :key="r.lot_cnt + '-' + r.mater_code">
                    <td>{{ r.mater_code }}</td>
                    <td class="text-start px-2">{{ r.mater_name }}</td>
                    <td>{{ r.unit }}</td>
                    <td>{{ r.required_qty }}</td>
                    <td>{{ r.available_qty }}</td>
                    <td>{{ r.mater_lot }}</td>
                  </tr>
                  <tr v-if="!bomRows.length">
                    <td colspan="6" class="text-muted py-4">
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
            :disabled="!selectedInsts.length || !bomRows.length"
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
      instList: [],        // J01 상태 생산지시 목록
      selectedInsts: [],   // 체크된 inst_head 배열
      bomRows: []          // 선택 지시 기반 BOM 자재 리스트
    };
  },
  computed: {
    allInstSelected() {
      return (
        this.instList.length > 0 &&
        this.selectedInsts.length === this.instList.length
      );
    }
  },
  async created() {
    // 1) J01 상태인 생산지시 목록 조회
    try {
      const res = await axios.get('/api/instructions/open');
      this.instList = res.data;
    } catch (e) {
      console.error('생산지시 조회 실패', e);
    }
  },
  methods: {
    toggleAllInsts(evt) {
      this.selectedInsts = evt.target.checked
        ? this.instList.map(i => i.inst_head)
        : [];
      this.onInstChange();
    },
    async onInstChange() {
      // 단일 선택일 때만 처리(복수 선택 시 빈 리스트)
      if (this.selectedInsts.length === 1) {
        try {
          const instHead = this.selectedInsts[0];
          const res = await axios.get(
            `/api/outbound_candidates/instruction/${instHead}`
          );
          this.bomRows = res.data;
        } catch (e) {
          console.error('BOM 자재 조회 실패', e);
          this.bomRows = [];
        }
      } else {
        this.bomRows = [];
      }
    },
    async processOutbound() {
      // 선택 지시 하나만 처리
      const instHead = this.selectedInsts[0];
      const today = new Date().toISOString().slice(0, 10);
      const records = this.bomRows.map(r => ({
        mout_id:      `${instHead}-${r.mater_code}-${Date.now()}`,
        lot_cnt:      r.lot_cnt,
        mater_code:   r.mater_code,
        mout_qty:     r.required_qty,
        mout_date:    today,
        mout_checker: '현재사용자',
        mater_lot:    r.mater_lot
      }));
      try {
        const res = await axios.post('/api/m_outbound/instruction', {
          inst_head: instHead,
          records
        });
        if (res.data.success) {
          alert('자재 출고가 완료되었습니다.');
          // 초기화
          this.selectedInsts = [];
          this.bomRows = [];
          // 목록 다시 불러오기
          const tmp = await axios.get('/api/instructions/open');
          this.instList = tmp.data;
        } else {
          alert('출고 실패: ' + (res.data.results.find(r=>!r.isSuccess)?.error || '알 수 없는 오류'));
        }
      } catch (e) {
        console.error('출고 처리 오류', e);
        alert('출고 처리 중 오류가 발생했습니다.');
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
</style>
