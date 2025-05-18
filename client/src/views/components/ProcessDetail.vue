<!-- src/views/components/ProcessDetail.vue -->
<template>
  <form @submit.prevent class="d-flex flex-column gap-3">
    <div>
      <label class="form-label">공정코드</label>
      <input v-model="process.process_code" class="form-control form-control-sm" readonly />
    </div>
    <div>
      <label class="form-label">공정명</label>
      <input v-model="process.process_name" class="form-control form-control-sm" />
    </div>
    <div>
      <label class="form-label">소요시간(분)</label>
      <input v-model.number="process.duration_min" type="number" min="0" class="form-control form-control-sm" />
    </div>
    <div>
      <label class="form-label">단위</label>
      <select v-model="process.unit_code" class="form-select form-select-sm">
        <option value="">선택</option>
        <option v-for="unit in unitList" :key="unit.code_values" :value="unit.code_values">
          {{ unit.code_name }}
        </option>
      </select>
    </div>
    <div class="mt-auto d-flex gap-2">
      <button type="button" class="btn btn-outline-secondary flex-grow-1" @click="$emit('clear')">초기화</button>
      <button type="button" class="btn btn-success flex-grow-1" @click="$emit('save')">등록</button>
      <button type="button" class="btn btn-danger flex-grow-1" @click="$emit('delete')" :disabled="!process.process_code">삭제</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ProcessDetail',
  props: ['process', 'unitList'],
  emits: ['save', 'delete', 'clear']
}
</script>
