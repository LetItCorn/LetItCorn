<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">자재 출고 처리</h2>

    <div class="row gx-4">
      <!-- 왼쪽 : 현재 재고 현황 ----------------------------------------- -->
      <div class="col-md-6 col-lg-7 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-secondary text-white">
            <i class="bi bi-stack"></i> 현재 재고 현황
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle text-center mb-0">
                <thead class="table-dark">
                  <tr>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>안전재고</th>
                    <th>현재재고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in summaryList" :key="item.mater_code">
                    <td>{{ item.mater_code }}</td>
                    <td>{{ item.mater_name }}</td>
                    <td>{{ item.safe_stock }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="item.current_stock < item.safe_stock ? 'bg-danger' : 'bg-success'"
                      >
                        {{ item.current_stock }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!summaryList.length">
                    <td colspan="4" class="text-muted py-4">
                      재고 데이터를 불러오는 중입니다...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 : 출고 후보 목록 --------------------------------------- -->
      <div class="col-md-6 col-lg-5 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-primary text-white">
            <i class="bi bi-box-arrow-up-right"></i> 출고 후보 목록
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle text-center mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width:1%">
                      <input
                        type="checkbox"
                        :checked="allSelected"
                        @change="toggleAll"
                      />
                    </th>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>현재재고</th>
                    <th>출고수량</th>
                    <th>LOT 카운트</th>
                    <th>LOT 번호</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in rows"
                    :key="row.lot_cnt + '-' + row.mater_code"
                  >
                    <td>
                      <input
                        type="checkbox"
                        v-model="selected"
                        :value="row"
                      />
                    </td>
                    <td>{{ row.mater_code }}</td>
                    <td>{{ row.mater_name }}</td>
                    <td>{{ row.total_stock }}</td>
                    <td>
                      <input
                        v-model.number="row.mout_qty"
                        type="number"
                        min="1"
                        :max="row.total_stock"
                        class="form-control form-control-sm"
                      />
                    </td>
                    <td>
                      <input
                        v-model="row.lot_cnt"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="LOT 카운트"
                      />
                    </td>
                    <td>
                      <input
                        v-model="row.mater_lot"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="LOT 번호"
                      />
                    </td>
                  </tr>
                  <tr v-if="!rows.length">
                    <td colspan="7" class="text-muted py-4">
                      출고할 자재가 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 출고 버튼 -------------------------------------------------------- -->
    <div class="text-end">
      <button
        class="btn btn-success btn-lg"
        :disabled="!selected.length"
        @click="processOutbound"
      >
        <i class="bi bi-truck"></i> 선택 출고 처리
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
      summaryList: [],   // 현재 재고 현황
      rows: [],          // 출고 후보 (LOT 단위)
      selected: []       // 체크된 행
    };
  },
  computed: {
    allSelected() {
      return this.rows.length > 0 && this.selected.length === this.rows.length;
    }
  },
  created() {
    this.loadMaterialStock();
    this.loadCandidates();
  },
  methods: {
    // 재고 현황
    async loadMaterialStock() {
      try {
        const res = await axios.get('/api/materials');
        /* API 스펙 변경 방어 : 배열인지 확인 */
        const list = Array.isArray(res.data) ? res.data : res.data?.materials ?? [];
        this.summaryList = list.map(item => ({
          mater_code:    item.mater_code,
          mater_name:    item.mater_name,
          safe_stock:    item.safe_stock,
          current_stock: item.total_stock ?? item.current_stock ?? 0  // ← 필드명 호환
        }));
      } catch (e) {
        console.error('현재 재고 조회 실패', e);
        alert('현재 재고를 불러오는 중 오류가 발생했습니다.');
      }
    },

    //출고 후보 불러오는 것
    async loadCandidates() {
      try {
        const res = await axios.get('/api/outbound_candidates');
        // 넘어오는 데이터가 배열이 아닐 때 방어하는 함수 
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.candidates)
            ? res.data.candidates
            : [];

        this.rows = list.map(r => ({
          ...r,
          /* 기본값 지정 */
          mout_qty:  1,
          lot_cnt:   r.lot_cnt ?? '',
          mater_lot: r.mater_lot ?? ''
        }));
      } catch (e) {
        console.error('출고 후보 조회 실패', e);
        alert('출고 후보를 불러오는 중 오류가 발생했습니다.');
      }
    },

    toggleAll(evt) {
      this.selected = evt.target.checked ? [...this.rows] : [];
    },

    // 출고 처리 
    async processOutbound() {
      if (!this.selected.length) {
        return alert('출고할 자재가 선택되지 않았습니다.');
      }

      const today = new Date().toISOString().slice(0, 10);

      try {
        const results = await Promise.all(
          this.selected.map(r =>
            axios.post('/api/m_outbound', {
              mout_id:      `${r.mater_code}-${Date.now()}`,
              mater_code:   r.mater_code,
              mout_qty:     r.mout_qty,
              mout_date:    today,
              mout_checker: '현재사용자',
              lot_cnt:      r.lot_cnt,
              mater_lot:    r.mater_lot
            })
          )
        );

        const failed = results.filter(r => r.data?.isSuccess === false);
        if (failed.length) {
          console.error('일부 출고 실패', failed.map(f => f.data.error));
          return alert(
            '일부 항목 출고 실패:\n' +
            failed.map(f => f.data.error).join('\n')
          );
        }

        alert('출고가 완료되었습니다.');
        /* 화면 갱신 */
        this.selected = [];
        await Promise.all([this.loadMaterialStock(), this.loadCandidates()]);
      } catch (err) {
        console.error('출고 처리 오류', err.response?.data || err);
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
.current-stock h5,
.card-header {
  font-weight: 600;
  font-size: 1.05rem;
}
.btn-success {
  width: 220px;
}
</style>
