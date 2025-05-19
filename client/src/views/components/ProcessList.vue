<template>
  <table class="table table-hover table-sm mb-0">
    <thead>
      <tr>
        <th>공정코드</th>
        <th>공정명</th>
        <th>시간(분)</th>
        <th>단위</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="p in processList"
        :key="p.process_code"
        @click="$emit('select', p)"
        :class="{ 'table-active': p.process_code === selectedCode }"
        style="cursor: pointer"
      >
        <td>{{ p.process_code }}</td>
        <td>{{ p.process_name }}</td>
        <td>{{ p.duration_min }}</td>
        <td>{{ p.spec }}</td>
      </tr>
      <tr v-if="!processList.length">
        <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'ProcessList',
  props: ['processList', 'selectedCode'],
  emits: ['select']
};
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
