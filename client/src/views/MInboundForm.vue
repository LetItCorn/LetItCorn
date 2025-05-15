<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">자재 입고 처리</h2>

    <div class="card mb-4 shadow-sm" style="min-height:200px;">
      <div class="card-header bg-light">
        <strong>품질검사 합격 발주서 목록</strong>
      </div>
      <div
        class="card-body p-0 d-flex align-items-center justify-content-center"
      >
        <div v-if="!inboundRows.length" class="text-center w-100 text-muted">
          합격된 발주서가 없습니다.
        </div>
        <div v-else class="table-responsive w-100">
          <table class="table modern-table text-center mb-0">
            <thead>
              <tr>
                <th style="width:1%">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleAllRows"
                  />
                </th>
                <th>발주ID</th>
                <th>자재코드</th>
                <th>발주수량</th>
                <th>입고수량</th>
                <th>품질검사</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in inboundRows" :key="idx">
                <td>
                  <input
                    type="checkbox"
                    v-model="selectedRows"
                    :value="row"
                  />
                </td>
                <td>{{ row.moder_id }}</td>
                <td>{{ row.mater_code }}</td>
                <td>{{ row.moder_qty }}</td>
                <td>
                  <input
                    v-model.number="row.min_qty"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
                <td>{{ row.quality }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-primary" @click="processInbound">
        <i class="bi bi-box-arrow-in-down me-1"></i> 입고
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useInboundStore } from '@/store/inbound';

export default {
  name: 'MInboundForm',
  setup() {
    const inboundStore = useInboundStore();
    return { inboundStore };
  },
  data() {
    return {
      inboundRows: [],   // 중복 제거된 발주서 목록
      selectedRows: []   // 체크된 행 객체 배열
    };
  },
  computed: {
    allSelected() {
      return (
        this.inboundRows.length > 0 &&
        this.inboundRows.every(r => this.selectedRows.includes(r))
      );
    }
  },
  watch: {
    // pendingOrders 변경 시 중복 제거 후 세팅
    'inboundStore.pendingOrders': {
      immediate: true,
      handler(list) {
        const seen = new Set();
        const unique = list.reduce((acc, o) => {
          const key = `${o.moder_id}-${o.mater_code}`;
          if (!seen.has(key)) {
            seen.add(key);
            acc.push({
              ...o,
              min_qty: o.moder_qty,
              // PASS면 적합, FAIL면 부적합
              quality: o.qc_result === 'PASS' ? '적합' : '부적합'
            });
          }
          return acc;
        }, []);
        this.inboundRows = unique;
        this.selectedRows = [...unique];
      }
    }
  },
  methods: {
    toggleAllRows(evt) {
      this.selectedRows = evt.target.checked
        ? [...this.inboundRows]
        : [];
    },
    async processInbound() {
      if (!this.selectedRows.length) {
        return alert('선택된 행이 없습니다.');
      }
      try {
        const today = new Date().toISOString().slice(0, 10);

        await Promise.all(
          this.selectedRows.map(r =>
            axios.post('/api/m_inbound', {
              min_id: `${r.moder_id}-${Date.now()}`,
              moder_id: r.moder_id,
              mater_code: r.mater_code,
              min_qty: r.min_qty,
              min_date: today,
              min_checker: '현재사용자',
              mater_lot: '',
              min_edate: null,
              min_stock: 0,
              min_oqty: 0,
              test_no: null
            })
          )
        );

        alert('입고가 완료되었습니다.');

        const entries = this.selectedRows.map(r => ({
          min_id: `${r.moder_id}-${Date.now()}`,
          mater_code: r.mater_code,
          min_qty: r.min_qty,
          min_date: today,
          min_checker: '현재사용자',
          lot_cnt: '',
          mater_lot: ''
        }));
        this.inboundStore.addProcessedInbounds(entries);
        this.inboundStore.clearPendingOrders();
        this.$router.push({ name: 'MMovement', query: { type: 'inbound' } });

      } catch (e) {
        console.error('입고 처리 오류', e);
        alert('입고 처리 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.modern-table thead th {
  background-color: #f4f6f8;
  color: #333;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}
.modern-table tbody td {
  padding: 0.75rem 1rem;
  color: #555;
}
.modern-table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}
.modern-table tbody tr:hover {
  background-color: #eef6ff;
}
.card {
  border: 1px solid #dee2e6;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>
