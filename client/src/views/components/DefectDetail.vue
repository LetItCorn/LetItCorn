<!-- src/views/components/DefectDetail.vue -->
<template>
  <div class="d-flex flex-column">
    <div class="mb-2">
      <label class="form-label">결함코드</label>
      <input v-model="defect.defect_code" readonly class="form-control  " />
    </div>
    <div class="mb-2">
      <label class="form-label">유형</label>
      <input v-model="defect.defect_type" class="form-control  " />
    </div>
    <div class="mb-2">
      <label class="form-label">사용여부</label>
      <select v-model="defect.is_used" class="form-select form-select-sm">
        <option value="Y">Y</option>
        <option value="N">N</option>
      </select>
    </div>
    <div class="mb-2">
      <label class="form-label">생성일자</label>
      <input v-model="defect.created_date" type="date" class="form-control  " />
    </div>

    <div class="mt-auto d-flex gap-2">
      <button @click="$emit('clear')" class="btn btn-outline-secondary flex-grow-1">초기화</button>
      <button @click="$emit('create')" class="btn btn-success flex-grow-1">등록</button>
      <button @click="$emit('delete')" class="btn btn-danger flex-grow-1" :disabled="!defect.defect_code">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefectDetail',
  props: ['defect'],
  emits: ['create', 'delete', 'clear']
}
</script>
