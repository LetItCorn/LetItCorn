<!-- src/views/components/EquipmentList.vue -->
<template>
  <table class="table table-hover table-sm mb-0">
    <thead class="thead-light sticky-top">
      <tr>
        <th>코드</th><th>장비명</th><th>유형</th><th>설치일</th><th>제조사</th><th>다음점검</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="eq in equipmentList"
        :key="eq.equipment_code"
        @click="$emit('select', eq)"
        :class="{ 'table-active': eq.equipment_code === selectedCode }"
        style="cursor:pointer"
      >
        <td>{{ eq.equipment_code }}</td>
        <td>{{ eq.equipment_name }}</td>
        <td>{{ eq.type_name || eq.equipment_type }}</td>
        <td>{{ formatDate(eq.install_date) }}</td>
        <td>{{ eq.manufacturer }}</td>
        <td>{{ formatDate(eq.next_inspection_dt) }}</td>
      </tr>
      <tr v-if="!equipmentList.length">
        <td colspan="6" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['equipmentList', 'selectedCode'],
  emits: ['select'],
  methods: {
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
};
</script>
