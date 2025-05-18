<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h5>BOM 등록</h5>
      <table class="table table-hover table-sm mb-2">
        <thead class="thead-light sticky-top">
          <tr><th>품목코드</th><th>품목명</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.item_code"
            @click="$emit('select', item)"
            :class="{ 'table-active': item.item_code === selected?.item_code }"
            style="cursor:pointer;"
          >
            <td>{{ item.item_code }}</td>
            <td>{{ item.item_name }}</td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="2" class="text-center py-4">완제품이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-end">
        <button class="btn btn-sm btn-primary me-2" @click="$emit('register')" :disabled="!selected">등록</button>
        <button class="btn btn-sm btn-secondary" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BomModal',
  props: {
    items: Array,
    selected: Object
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.table-active {
  background-color: #d0ebff;
}
</style>
