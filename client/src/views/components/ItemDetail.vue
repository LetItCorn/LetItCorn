<!-- src/components/ItemDetail.vue -->
<template>
  <div class="form-row flex-fill">
    <div class="form-group col-6">
      <label>품목코드</label>
      <input v-model="item.item_code" class="form-control form-control-sm" readonly />
    </div>
    <div class="form-group col-6">
      <label>품목명</label>
      <input v-model="item.item_name" class="form-control form-control-sm" />
    </div>
    <div class="form-group col-6">
      <label>구분</label>
      <select v-model="item.item_type" class="form-control form-control-sm">
        <option disabled value="">-- 선택하세요 --</option>
        <option v-for="code in codeList" :key="code.code_values" :value="code.code_values">
          {{ code.code_name }}
        </option>
      </select>
    </div>
    <div class="form-group col-6">
      <label>수량</label>
      <input v-model="item.qty" class="form-control form-control-sm" />
    </div>
    <div class="form-group col-6">
      <label>단위</label>
      <select v-model="item.unit_code" class="form-control form-control-sm">
        <option disabled value="">-- 선택하세요 --</option>
        <option v-for="unit in unitList" :key="unit.code_values" :value="unit.code_values">
          {{ unit.code_name }}
        </option>
      </select>
    </div>
    <div class="mt-auto d-flex justify-content-end w-100">
      <button @click="$emit('clear')" class="btn btn-sm btn-outline-secondary me-2" style="width:80px;">초기화</button>
      <button @click="$emit('save')" class="btn btn-sm btn-warning me-2" style="width:80px;">등록</button>
      <button @click="$emit('delete')" class="btn btn-sm btn-danger" style="width:80px;">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'codeList', 'unitList'],
  emits: ['clear', 'save', 'delete']
};
</script>
