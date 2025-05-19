<template>
  <table class="table table-hover table-sm mb-0">
    <thead class="thead-light">
      <tr>
        <th>코드</th>
        <th>유형</th>
        <th>사용여부</th>
        <th>생성일자</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="def in list"
        :key="def.defect_code"
        @click="$emit('select', def)"
        :class="{ 'table-active': def.defect_code === selectedCode }"
        style="cursor:pointer"
      >
        <td>{{ def.defect_code }}</td>
        <td>{{ def.defect_type }}</td>
        <td>{{ def.is_used }}</td>
        <td>{{ formatDate(def.created_date) }}</td>
      </tr>
      <tr v-if="!list.length">
        <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'DefectList',
  props: ['list', 'selectedCode'],
  emits: ['select'],
  methods: {
    formatDate(val) {
      if (!val) return '';
      const d = new Date(val);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
/* 헤더 고정 */
thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 선택 강조 및 호버 */
.table-active {
  background-color: #d0ebff;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
