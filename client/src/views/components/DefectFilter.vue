<!-- src/views/components/DefectFilter.vue -->
<template>
  <div class="d-flex justify-content-end align-items-center">
    <select v-model="searchTypeModel" class="form-control form-control-sm me-2" style="width:120px">
      <option value="">[선택 없음]</option>
      <option value="code">결함코드</option>
      <option value="type">유형</option>
      <option value="used">사용여부</option>
    </select>
    <input v-model="searchValueModel" :placeholder="placeholder" class="form-control form-control-sm me-2" style="width:200px" />
    <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px">조회</button>
    <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px">초기화</button>
  </div>
</template>

<script>
export default {
  name: 'DefectFilter',
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
    placeholder() {
      return {
        code: '결함코드',
        type: '유형',
        used: 'Y/N'
      }[this.searchType] || ''
    }
  }
}
</script>
