<!-- src/views/components/MaterialDetail.vue -->
<template>
  <form @submit.prevent class="d-flex flex-column gap-3">
    <div><label>자재코드</label><input v-model="mat.mater_code" class="form-control " readonly /></div>
    <div><label>자재명</label><input v-model="mat.mater_name" class="form-control " /></div>
    <div>
      <label>단위</label>
      <select v-model="mat.unit_code" class="form-select ">
        <option value="">-- 선택하세요 --</option>
        <option v-for="unit in unitList" :key="unit.code_values" :value="unit.code_values">
          {{ unit.code_name }}
        </option>
      </select>
    </div>
    <div><label>단가</label><input type="number" v-model.number="mat.m_price" class="form-control " /></div>
    <div><label>안전재고</label><input type="number" v-model.number="mat.safe_stock" class="form-control " /></div>
    <div class="d-flex gap-2 mt-auto">
      <button type="button" @click="$emit('clear')" class="btn btn-outline-secondary flex-grow-1">초기화</button>
      <button type="button" @click="$emit('create')" class="btn btn-success flex-grow-1">등록</button>
      <button type="button" @click="$emit('delete')" class="btn btn-danger flex-grow-1" :disabled="!mat.mater_code">삭제</button>
    </div>
  </form>
</template>

<script>
export default {
  props: ['mat', 'unitList'],
  emits: ['create', 'delete', 'clear']
};
</script>
