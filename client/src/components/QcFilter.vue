<!-- src/views/components/DefectFilter.vue -->
<template>
  <div class="d-flex justify-content-end align-items-center">
    <select v-model="searchTypeModel" class="form-control form-control-sm me-2" style="width:120px">
      <option value="">[선택 없음]</option>
      <option value="test_no">품질코드</option>
      <option value="test_target">검사대상</option>
      <option value="process_name">대상명</option>
    </select>
    <input v-model="searchValueModel"  class="form-control form-control-sm me-2" style="width:200px" />
    <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px">조회</button>
    <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px">초기화</button>
  </div>
</template>

<script>
export default {
  name: 'QcFilter',
  props: ['searchType', 'searchValue'],
  emits: ['update:searchType', 'update:searchValue', 'search', 'reset'],
  computed: {
    searchTypeModel: {
      get() { return this.searchType },
      set(v) { this.$emit('update:searchType', v) }
    },
    searchValueModel: {
      get() { return this.searchValue },
      set(v) { this.$emit('update:searchValue', v) }
    },
  
  }
}
</script>
