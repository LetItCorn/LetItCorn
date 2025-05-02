<!-- client/src/components/PurchaseOrderLookupModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">발주서 조회</h5>
          <button class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex mb-2 gap-2">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-sm"
              placeholder="발주번호 또는 자재코드 검색"
            />
            <button class="btn btn-sm btn-dark" @click="fetchOrders">
              검색
            </button>
          </div>
          <div class="table-responsive">
            <table class="table modern-table mb-0 text-center">
              <thead>
                <tr>
                  <th style="width:1%"><input type="checkbox" :checked="allSelected" @change="toggleAll" /></th>
                  <th>발주ID</th>
                  <th>품명</th>
                  <th>수량</th>
                  <th>발주일</th>
                  <th>납기일</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="o in filtered"
                  :key="o.moder_id + '-' + o.mater_code"
                >
                  <td>
                    <input
                      type="checkbox"
                      v-model="selected"
                      :value="o"
                    />
                  </td>
                  <td>{{ o.moder_id }}</td>
                  <td>{{ o.mater_code }}</td>
                  <td>{{ o.moder_qty }}</td>
                  <td>{{ o.moder_date }}</td>
                  <td>{{ o.due_date }}</td>
                </tr>
                <tr v-if="!filtered.length">
                  <td colspan="6" class="text-muted">조회된 발주서가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="confirm">등록</button>
          <button class="btn btn-secondary" @click="close">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PurchaseOrderLookupModal',
  props: { visible: Boolean },
  data() {
    return {
      orders: [],
      selected: [],
      searchQuery: ''
    };
  },
  computed: {
    filtered() {
      if (!this.searchQuery) return this.orders;
      const q = this.searchQuery.toLowerCase();
      return this.orders.filter(o =>
        o.moder_id.includes(q) || o.mater_code.toLowerCase().includes(q)
      );
    },
    allSelected() {
      return this.filtered.length &&
        this.filtered.every(o => this.selected.includes(o));
    }
  },
  watch: {
    visible(val) {
      if (val) this.fetchOrders();
      else this.selected = [];
    }
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get('/api/m_orders');
        this.orders = res.data;
      } catch (e) {
        console.error('발주서 조회 실패', e);
      }
    },
    toggleAll(evt) {
      this.selected = evt.target.checked
        ? [...this.filtered]
        : [];
    },
    confirm() {
      this.$emit('select', this.selected);
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
  max-height:80vh;
  display:flex; flex-direction:column;
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
