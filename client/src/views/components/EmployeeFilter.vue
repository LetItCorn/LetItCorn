<!-- src/components/EmployeeFilter.vue -->
<template>
  <div class="d-flex align-items-center">
    <select v-model="modelSearchType" class="form-select form-select-sm me-2" style="width:140px">
      <option value="">[선택 없음]</option>
      <option value="id">사원ID</option>
      <option value="name">이름</option>
      <option value="user">사용자ID</option>
    </select>

    <input
      v-model="modelSearchValue"
      :placeholder="placeholder"
      class="form-control form-control-sm me-2"
      style="width:200px"
    />

    <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px">조회</button>
    <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px">초기화</button>
  </div>
</template>

<script>
export default {
  props: ['searchType', 'searchValue'],
  emits: ['update:searchType', 'update:searchValue', 'search', 'reset'],
  computed: {
    modelSearchType: {
      get() {
        return this.searchType;
      },
      set(value) {
        this.$emit('update:searchType', value);
      }
    },
    modelSearchValue: {
      get() {
        return this.searchValue;
      },
      set(value) {
        this.$emit('update:searchValue', value);
      }
    },
    placeholder() {
      switch (this.searchType) {
        case 'id': return '사원ID';
        case 'name': return '이름';
        case 'user': return '사용자ID';
        default: return '';
      }
    }
  }
};
</script>
