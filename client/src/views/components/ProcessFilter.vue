<!-- src/views/components/ProcessFilter.vue -->
<template>
  <div class="d-flex justify-content-end align-items-center">
    <select v-model="searchTypeModel" class="form-select form-select-sm me-2" style="width:140px">
      <option value="">[선택 없음]</option>
      <option value="code">공정코드</option>
      <option value="name">공정명</option>
    </select>
    <input v-model="searchValueModel" :placeholder="filterPlaceholder" class="form-control form-control-sm me-2" style="width:200px" />
    <button class="btn btn-sm btn-primary me-2" style="width:80px" @click="$emit('search')">조회</button>
    <button class="btn btn-sm btn-outline-secondary" style="width:80px" @click="$emit('reset')">초기화</button>
  </div>
</template>

<script>
export default {
  name: 'ProcessFilter',
  props: ['searchType', 'searchValue'],
  emits: ['update:searchType', 'update:searchValue', 'search', 'reset'],
  computed: {
    searchTypeModel: {
      get() { return this.searchType },
      set(val) { this.$emit('update:searchType', val) }
    },
    searchValueModel: {
      get() { return this.searchValue },
      set(val) { this.$emit('update:searchValue', val) }
    },
    filterPlaceholder() {
      return this.searchType === 'code' ? '공정코드'
           : this.searchType === 'name' ? '공정명' : ''
    }
  }
}
</script>
