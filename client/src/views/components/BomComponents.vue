<template>
  <div class="card h-100 d-flex flex-column">
      <!-- 💡 스크롤 가능한 테이블 영역 -->
      <div class="table-responsive flex-fill overflow-auto p-2">
        <table class="table table-hover table-sm mb-0">
          <thead>
            <tr class="sticky-header">
              <th>순번</th>
              <th>자재코드</th>
              <th>자재명</th>
              <th>단위</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comp in compList"
              :key="comp.item_seq_id"
              @click="$emit('select', comp)"
              :class="{ 'table-active': comp.item_seq_id === selectedComp?.item_seq_id }"
              style="cursor:pointer;"
            >
              <td>{{ comp.item_seq_id }}</td>
              <td>{{ comp.mater_code }}</td>
              <td>{{ comp.mater_name }}</td>
              <td>{{ comp.spec }}</td>
              <td>{{ comp.quantity }}</td>
            </tr>
            <tr v-if="compList.length === 0">
              <td colspan="5" class="text-center py-4">BOM을 선택하세요.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 버튼 영역 -->
      <div class="mt-2 d-flex justify-content-end">
        <button
          @click="$emit('openComp', selectedComp)"
          class="btn btn-sm btn-warning me-1"
          :disabled="!selectedBom"
          style="width:100px;"
        >
          {{ selectedComp ? '수정' : '등록' }}
        </button>
        <button
          @click="$emit('deleteComp')"
          class="btn btn-sm btn-danger"
          :disabled="!selectedComp"
          style="width:100px;"
        >
          삭제
        </button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'BomComponents',
  props: {
    compList: Array,
    selectedBom: Object,
    selectedComp: Object
  }
};
</script>

<style scoped>
.table-active {
  background-color: #d0ebff;
}

/* ✅ 헤더 고정 */
.sticky-header th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 행 hover 효과 */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
