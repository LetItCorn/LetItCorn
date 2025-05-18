<!-- src/views/components/EquipmentFilter.vue -->
<template>
  <div class="d-flex justify-content-end align-items-center">
    <select v-model="modelType" class="form-select form-select-sm me-2" style="width:140px">
      <option value="">[선택 없음]</option>
      <option value="code">장비코드</option>
      <option value="name">장비명</option>
      <option value="type">유형코드</option>
    </select>
    <input v-model="modelValue" :placeholder="placeholder" class="form-control form-control-sm me-2" style="width:200px" />
    <button class="btn btn-sm btn-primary me-2" style="width:80px" @click="$emit('search')">조회</button>
    <button class="btn btn-sm btn-outline-secondary" style="width:80px" @click="$emit('reset')">초기화</button>
  </div>
</template>

<script>
export default {
  props: ['searchType', 'searchValue'],
  emits: ['update:searchType', 'update:searchValue', 'search', 'reset'],
  computed: {
    modelType: {
      get() { return this.searchType },
      set(v) { this.$emit('update:searchType', v) }
    },
    modelValue: {
      get() { return this.searchValue },
      set(v) { this.$emit('update:searchValue', v) }
    },
    placeholder() {
      return (
        { code: '장비코드', name: '장비명', type: '유형코드' }[this.searchType] || ''
      );
    }
  }
};
</script>
