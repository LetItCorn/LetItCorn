<!-- src/views/components/DefectDetail.vue -->
<template>
  <div class="d-flex flex-column">
    <div class="mb-2">
      <label class="form-label">결함코드</label>
      <input v-model="defect.test_no" readonly class="form-control " />
    </div>
    <div class="mb-2">
      <label class="form-label">검사이름</label>
      <input v-model="defect.test_feild" class="form-control " placeholder="검사이름" />
    </div>
    <div class="mb-2">
      <label class="form-label">기준</label>
      <div class="d-flex align-items-center gap-2">
        <input v-model="defect.test_stand_min" class="form-control" placeholder="최소값" />
        <span>~</span>
        <input v-model="defect.test_stand_max" class="form-control" placeholder="최대값" />
      </div>
    </div>
    <div class="mb-2">
      <label class="form-label">검사대상</label>
      <select v-model="defect.test_target" class="form-select">
        <option value="">[선택]</option>
        <option v-for="opt in prOptions" :key="opt.process_code" :value="opt.process_code">
          {{ opt.process_name }}
        </option>
      </select>
    </div>

    <div class="mb-2">
      <label class="form-label">단위</label>
      <input v-model="defect.unit_name" class="form-control " placeholder="단위" />
    </div>


    <div class="mt-auto d-flex gap-2">
      <button @click="$emit('clear')" class="btn btn-outline-secondary flex-grow-1">초기화</button>
      <button @click="$emit('create')" class="btn btn-success flex-grow-1">등록</button>
      <button @click="$emit('delete')" class="btn btn-danger flex-grow-1" :disabled="!defect.test_no">삭제</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'QcDetail',
    props: ['defect', 'prOptions'],
    emits: ['create', 'delete', 'clear']
  }
</script>