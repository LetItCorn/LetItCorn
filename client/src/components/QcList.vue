<template>
  <table class="table table-hover table-sm mb-0">
    <thead class="thead-light">
      <tr>
        <th>코드</th>
        <th>검사이름</th>
        <th>검사기준</th>
        <th>검사대상</th>
        <th>대상명</th>
        <th>단위</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="def in list"
        :key="def.test_no"
        @click="$emit('select', def)"
        :class="{ 'table-active': def.test_no === selectedCode }"
        style="cursor:pointer"
      >
        <td>{{ def.test_no }}</td>
        <td>{{ def.test_feild }}</td>
        <td>{{ def.test_stand }}</td>
        <td>{{ def.test_target }}</td>
        <td>{{ def.process_name }}</td>
        <td>{{ def.unit }}</td>
      </tr>
      <tr v-if="!list.length">
        <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'QcList',
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
