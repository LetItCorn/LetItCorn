<!-- src/components/ItemFilter.vue -->
<template>
  <div class="d-flex align-items-center">
    <select v-model="modelSearchType" class="form-control form-control-sm me-2 border" style="width:120px">
      <option value="">[선택 없음]</option>
      <option value="code">품목코드</option>
      <option value="name">품목명</option>
      <option value="type">구분</option>
    </select>

    <input v-model="modelSearchValue" :placeholder="placeholder" class="form-control form-control-sm me-2 border" style="width:200px" />

    <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px;">조회</button>
    <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px;">초기화</button>
  </div>
</template>

<script>
export default {
  props: ['searchType', 'searchValue'],
  emits: ['update:searchType', 'update:searchValue', 'search', 'reset'],
  computed: {
    modelSearchType: {
      get() { return this.searchType },
      set(v) { this.$emit('update:searchType', v) }
    },
    modelSearchValue: {
      get() { return this.searchValue },
      set(v) { this.$emit('update:searchValue', v) }
    },
    placeholder() {
      switch (this.searchType) {
        case 'code': return '품목코드';
        case 'name': return '품목명';
        case 'type': return '구분';
        default: return '';
      }
    }
  }
};
</script>
