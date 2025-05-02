<!-- client/src/components/QualityInspectionModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">품질 검사</h5>
          <button class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex mb-2 gap-2">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-sm"
              placeholder="발주ID 또는 자재코드 검색"
            />
            <button class="btn btn-sm btn-dark" @click="applyFilter">
              검색
            </button>
          </div>
          <div class="table-responsive">
            <table class="table modern-table text-center mb-0">
              <thead>
                <tr>
                  <th style="width:1%"><input type="checkbox" :checked="allSelected" @change="toggleAll" /></th>
                  <th>발주ID</th>
                  <th>자재코드</th>
                  <th>수량</th>
                  <th>발주일</th>
                  <th>납기일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in filtered" :key="o.moder_id+'-'+o.mater_code">
                  <td><input type="checkbox" v-model="selected" :value="o" /></td>
                  <td>{{ o.moder_id }}</td>
                  <td>{{ o.mater_code }}</td>
                  <td>{{ o.moder_qty }}</td>
                  <td>{{ o.moder_date }}</td>
                  <td>{{ o.due_date }}</td>
                </tr>
                <tr v-if="filtered.length===0">
                  <td colspan="6" class="text-muted">조회된 발주서가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="runInspection" :disabled="!selected.length">
            검사 실행
          </button>
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
    orders: Array
  },
  data() {
    return {
      selected: [],
      searchQuery: '',
      filtered: []
    };
  },
  computed: {
    allSelected() {
      return this.filtered.length && this.filtered.every(o => this.selected.includes(o));
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.filtered = [...this.orders];
        this.selected = [];
        this.searchQuery = '';
      }
    }
  },
  methods: {
    applyFilter() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) {
        this.filtered = [...this.orders];
      } else {
        this.filtered = this.orders.filter(o =>
          o.moder_id.includes(q) || o.mater_code.toLowerCase().includes(q)
        );
      }
      this.selected = [];
    },
    toggleAll(evt) {
      this.selected = evt.target.checked ? [...this.filtered] : [];
    },
    runInspection() {
      // 랜덤으로 PASS or FAIL
      const results = this.selected.map(o => ({
        order: o,
        status: Math.random() < 0.5 ? 'PASS' : 'FAIL'
      }));
      this.$emit('inspect', results);
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
  position: fixed; top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.5);
  display:flex; align-items:center; justify-content:center;
  z-index:1050;
}
.modal-dialog {
  width:90%; max-width:700px;
}
.modal-content {
  max-height:80vh; display:flex; flex-direction:column;
}
.modal-body {
  flex:1 1 auto; overflow-y:auto; padding:1rem;
}
.modal-footer {
  flex:0 0 auto; padding:1rem; border-top:1px solid #e0e0e0;
  text-align:right;
}
.btn-close {
  background:none; border:none; font-size:1.25rem;
}
</style>
