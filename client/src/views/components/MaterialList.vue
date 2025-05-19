<!-- src/views/components/MaterialList.vue -->
<template>
  <!-- 🆕 스크롤 전용 래퍼: h-100 로 카드 높이를 그대로 상속 -->
  <div class="table-wrapper h-100">
    <table class="table table-hover table-sm mb-0">
      <thead>
        <tr>
          <th>자재코드</th>
          <th>자재명</th>
          <th>단위</th>
          <th>단가</th>
          <th>안전재고</th>
        </tr>
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

        <!-- 데이터가 없을 때 -->
        <tr v-if="!materialList.length">
          <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['materialList', 'selectedCode'],
  emits: ['select']
};
</script>

<style scoped>
/* 1) 래퍼 div 에 스크롤 적용 */
.table-wrapper {
  overflow: auto;
}

/* 2) 헤더 고정 & 겹침 방지 */
table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8f9fa;
}

/* 3) 선택·호버 색상(부모 스타일과 동일) */
.table-active { background-color: #d0ebff; }
tbody tr:hover { background-color: #f8f9fa; }
</style>
