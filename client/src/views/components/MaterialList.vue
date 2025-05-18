<!-- src/views/components/MaterialList.vue -->
<template>
  <table class="table table-hover table-sm mb-0">
    <thead class="thead-light sticky-top">
      <tr><th>자재코드</th><th>자재명</th><th>단위</th><th>단가</th><th>안전재고</th></tr>
    </thead>
    <tbody>
      <tr
        v-for="mat in materialList"
        :key="mat.mater_code"
        @click="$emit('select', mat)"
        :class="{ 'table-active': mat.mater_code === selectedCode }"
        style="cursor:pointer"
      >
        <td>{{ mat.mater_code }}</td>
        <td>{{ mat.mater_name }}</td>
        <td>{{ mat.spec }}</td>
        <td>{{ mat.m_price }}</td>
        <td>{{ mat.safe_stock }}</td>
      </tr>
      <tr v-if="!materialList.length">
        <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['materialList', 'selectedCode'],
  emits: ['select']
};
</script>
