<!-- src/views/components/MaterialFilter.vue -->
<template>
  <div class="d-flex align-items-center justify-content-end">
    <select v-model="modelType" class="form-select form-select-sm me-2" style="width:140px">
      <option value="">[선택 없음]</option>
      <option value="code">자재코드</option>
      <option value="name">자재명</option>
    </select>
    <input v-model="modelValue" :placeholder="placeholder" class="form-control form-control-sm me-2" style="width:200px" />
    <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px">조회</button>
    <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px">초기화</button>
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
      return this.searchType === 'code' ? '자재코드' :
             this.searchType === 'name' ? '자재명' : '';
    }
  }
};
</script>
