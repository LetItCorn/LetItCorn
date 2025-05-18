<!-- src/views/components/CommonCodeDetail.vue -->
<template>
  <div class="card h-100 d-flex flex-column">
    <div class="card-body d-flex flex-column flex-fill overflow-auto">
      <div>
        <div v-for="(label, key) in fields" :key="key" class="form-group mb-2">
          <label>{{ label }}</label>
          <input v-if="key !== 'use_yn'" v-model="modelValue[key]" class="form-control form-control-sm" />
          <select v-else v-model="modelValue.use_yn" class="form-control form-control-sm">
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>
      </div>
      <div class="mt-auto d-flex justify-content-end pt-2 border-top">
        <button @click="$emit('clear')" class="btn btn-sm btn-outline-secondary me-2" style="width:80px;">초기화</button>
        <button @click="$emit('save')" class="btn btn-sm btn-warning me-2" style="width:80px;">저장</button>
        <button @click="$emit('delete')" class="btn btn-sm btn-danger" style="width:80px;"
                :disabled="!modelValue.code_group || !modelValue.code_rear">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonCodeDetail',
  props: {
    modelValue: Object
  },
  emits: ['clear', 'save', 'delete'],
  computed: {
    fields() {
      return {
        code_group: '그룹코드',
        code_rear: '하위코드',
        code_name: '코드명',
        use_yn: '사용여부',
        comm_etc: '비고',
        code_values: '코드값'
      };
    }
  }
};
</script>
