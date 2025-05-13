<!-- client/src/views/MOutboundForm.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 출고 처리 <small class="text-muted">(생산지시 기반)</small></h2>

    <!-- ─────────────── 생산지시 선택 ─────────────── -->
    <div class="row align-items-end g-2 mb-3">
      <div class="col-auto">
        <label class="form-label fw-bold">생산지시번호</label>
        <select v-model="selectedInst" class="form-select">
          <option value="" disabled>(지시 선택)</option>
          <option v-for="i in instList" :key="i.inst_head" :value="i.inst_head">
            {{ i.inst_head }} — {{ i.inst_start }}
          </option>
        </select>
      </div>

      <div class="col-auto pt-4">
        <button class="btn btn-primary px-4"
                :disabled="!selectedInst"
                @click="loadCandidatesByInst">
          조회
        </button>
      </div>
    </div>

    <!-- ─────────────── 재고 현황 & 출고 후보 ─────────────── -->
    <div class="row g-3">
      <!-- 현재 재고 -->
      <div class="col-lg-5">
        <h5 class="mb-2">현재 재고 현황</h5>
        <div class="table-responsive">
          <table class="table table-bordered text-center small mb-0">
            <thead class="table-light">
              <tr>
                <th>자재코드</th><th>자재명</th>
                <th>안전재고</th><th>현재재고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in summaryList" :key="item.mater_code">
                <td>{{ item.mater_code }}</td>
                <td class="text-start px-2">{{ item.mater_name }}</td>
                <td>{{ item.safe_stock }}</td>
                <td :class="{'text-danger': item.current_stock < item.safe_stock}">
                  {{ item.current_stock }}
                </td>
              </tr>
              <tr v-if="!summaryList.length">
                <td colspan="4" class="text-muted py-3">재고 데이터를 불러오는 중...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 출고 후보 -->
      <div class="col-lg-7">
        <h5 class="mb-2">출고 후보 (LOT)</h5>
        <div class="table-responsive" style="max-height:55vh; overflow:auto">
          <table class="table table-bordered text-center small mb-0">
            <thead class="table-light">
              <tr>
                <th style="width:1%">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll"/>
                </th>
                <th>자재코드</th><th>자재명</th>
                <th>필요수량</th><th>가용수량</th>
                <th>출고수량</th><th>LOT#</th><th>LOT번호</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.lot_cnt + '-' + row.mater_code">
                <td><input type="checkbox" v-model="selected" :value="row"/></td>
                <td>{{ row.mater_code }}</td>
                <td class="text-start px-2">{{ row.mater_name }}</td>
                <td>{{ row.req_qty }}</td>
                <td>{{ row.total_stock }}</td>
                <td>
                  <input v-model.number="row.mout_qty"
                         type="number" min="1" :max="Math.min(row.req_qty,row.total_stock)"
                         class="form-control form-control-sm"/>
                </td>
                <td>{{ row.lot_cnt }}</td>
                <td>{{ row.mater_lot }}</td>
              </tr>
              <tr v-if="!rows.length">
                <td colspan="8" class="text-muted py-3">후보가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 출고 실행 버튼 -->
    <div class="text-end mt-3">
      <button class="btn btn-success px-4"
              :disabled="!selected.length"
              @click="processOutbound">
        출고 실행
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MOutboundForm',
  data() {
    return {
      /* 생산지시 */
      instList: [],            // 드롭다운 목록
      selectedInst: '',        // v-model
      /* 재고 & 후보 */
      summaryList: [],
      rows: [],
      selected: []
    };
  },
  computed: {
    allSelected() {
      return this.rows.length > 0 && this.selected.length === this.rows.length;
    }
  },
  created() {
    this.loadInstList();
    this.loadMaterialStock();
  },
  methods: {
    /* ───────── 1. 생산지시 목록 ───────── */
    async loadInstList() {
      try {
        const { data } = await axios.get('/api/instructions/open');
        this.instList = data;          // [{inst_head, inst_start}, ...]
      } catch (e) {
        console.error('지시 목록 조회 실패', e);
        alert('생산지시 목록을 불러오지 못했습니다.');
      }
    },

    /* ───────── 2. 현재 재고 ───────── */
    async loadMaterialStock() {
      try {
        const { data } = await axios.get('/api/materials/stock');
        this.summaryList = data;
      } catch (e) {
        console.error('재고 조회 실패', e);
      }
    },

    /* ───────── 3. 후보 LOT ───────── */
    async loadCandidatesByInst() {
      if (!this.selectedInst) return;
      try {
        const { data } = await axios
          .get(`/api/outbound_candidates/instruction/${this.selectedInst}`);
        this.rows = data.map(r => ({
          ...r,
          mout_qty: Math.min(r.req_qty, r.total_stock)   // 기본값
        }));
        this.selected = [];
      } catch (e) {
        console.error('출고 후보 조회 실패', e);
        alert('출고 후보를 불러오는 중 오류가 발생했습니다.');
      }
    },

    toggleAll(e) {
      this.selected = e.target.checked ? [...this.rows] : [];
    },

    /* ───────── 4. 출고 실행 ───────── */
    async processOutbound() {
      if (!this.selected.length) return;
      try {
        const today = new Date().toISOString().slice(0,10);
        /* 4-1) 출고 API 호출 */
        await axios.post('/api/m_outbound/instruction', {
          instHead : this.selectedInst,
          records  : this.selected.map(r => ({
            lot_cnt     : r.lot_cnt,
            mater_code  : r.mater_code,
            mout_qty    : r.mout_qty,
            mater_lot   : r.mater_lot,
            mout_date   : today,
            mout_checker: '현재사용자'
          }))
        });
        alert('출고 완료!');
        /* 4-2) 화면 초기화 */
        this.loadMaterialStock();
        this.loadCandidatesByInst();
      } catch (e) {
        console.error('출고 처리 오류', e.response?.data || e);
        alert('출고 처리 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
h5 { font-weight: 600; }
.table th, .table td { vertical-align: middle; }
.table tbody tr:nth-child(even){ background:#f9f9f9; }
</style>
