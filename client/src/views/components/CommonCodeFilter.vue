<!-- src/views/components/CommonCodeFilter.vue -->
<template>
  <div class="card">
    <div class="card-body d-flex align-items-center">
      <div class="ms-auto d-flex align-items-center">
        <select v-model="modelValue.searchType" class="form-control form-control-sm me-2" style="width:140px">
          <option value="">[전체]</option>
          <option value="group">그룹코드</option>
          <option value="rear">하위코드</option>
          <option value="name">코드명</option>
          <option value="useYn">사용여부</option>
        </select>
        <input v-model="modelValue.searchValue" :placeholder="placeholder"
               class="form-control form-control-sm me-2" style="width:200px" />
        <button @click="$emit('search')" class="btn btn-sm btn-primary me-2" style="width:80px;">조회</button>
        <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:80px;">초기화</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonCodeFilter',
  props: {
    modelValue: Object,
  },
  emits: ['update:modelValue', 'search', 'reset'],
  computed: {
    placeholder() {
      const type = this.modelValue?.searchType;
      return {
        group: '그룹코드',
        rear: '하위코드',
        name: '코드명',
        useYn: '사용여부(Y/N)'
      }[type] || '전체 조회';
    }
  }
};
</script>
