<!-- src/views/components/DefectDetail.vue -->
<template>
  <div class="d-flex flex-column">
    <div class="mb-2">
      <label class="form-label">결함코드</label>
      <input v-model="defect.test_no" readonly class="form-control " />
    </div>
    <div class="mb-2">
      <label class="form-label">검사이름</label>
      <input v-model="defect.test_feild" class="form-control " />
    </div>
    <div class="mb-2">
      <label class="form-label">기준</label>
      <input v-model="defect.defect_type" class="form-control " />
      <input v-model="defect.defect_type" class=" " />
    </div>
    <div class="mb-2">
      
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
  name: 'QcDetail',
  props: ['defect'],
  emits: ['create', 'delete', 'clear']
}
</script>
