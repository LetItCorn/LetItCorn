<!-- src/views/components/EquipmentDetail.vue -->
<template>
  <div class="d-flex flex-column gap-3">
    <!-- 입력 폼 -->
    <table class="table table-borderless mb-0">
      <tbody>
        <tr><th>코드</th><td><input v-model="eq.equipment_code" class="form-control form-control-sm" readonly /></td></tr>
        <tr><th>장비명</th><td><input v-model="eq.equipment_name" class="form-control form-control-sm" /></td></tr>
        <tr><th>유형코드</th><td>
          <select v-model="eq.equipment_type" class="form-select form-select-sm">
            <option value="">선택</option>
            <option v-for="c in typeList" :key="c.code_values" :value="c.code_values">{{ c.code_name }}</option>
          </select>
        </td></tr>
        <tr><th>설치일</th><td><input v-model="eq.install_date" type="date" class="form-control form-control-sm" /></td></tr>
        <tr><th>제조사</th><td><input v-model="eq.manufacturer" class="form-control form-control-sm" /></td></tr>
        <tr><th>다음점검일</th><td><input v-model="eq.next_inspection_dt" type="date" class="form-control form-control-sm" /></td></tr>
        <tr><th>적합여부</th><td>
          <select v-model="eq.is_suitable" class="form-select form-select-sm">
            <option value="">선택</option>
            <option v-for="c in suitableList" :key="c.code_values" :value="c.code_values">{{ c.code_name }}</option>
          </select>
        </td></tr>
        <tr><th>단위코드</th><td>
          <select v-model="eq.unit_code" class="form-select form-select-sm">
            <option value="">선택</option>
            <option v-for="c in unitList" :key="c.code_values" :value="c.code_values">{{ c.code_name }}</option>
          </select>
        </td></tr>
        <tr><th>용량/수량</th><td><input v-model="eq.qty" type="number" class="form-control form-control-sm" /></td></tr>
      </tbody>
    </table>

    <!-- 버튼 -->
    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary flex-grow-1" @click="$emit('clear')">초기화</button>
      <button class="btn btn-success flex-grow-1" @click="$emit('create')">등록/수정</button>
      <button class="btn btn-danger flex-grow-1" @click="$emit('delete')" :disabled="!eq.equipment_code || eq.mode==='reg'">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['eq', 'typeList', 'unitList', 'suitableList'],
  emits: ['create', 'delete', 'clear']
};
</script>
