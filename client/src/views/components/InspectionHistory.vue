<!-- src/views/components/InspectionHistory.vue -->
<template>
  <div class="d-flex flex-column h-100">
    <!-- 상단: 제목과 버튼 고정 -->
    <div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
      <strong>설비 점검 이력 ({{ inspectionList.length }})</strong>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-primary" @click="$emit('add')">추가</button>
        <button class="btn btn-outline-secondary" @click="$emit('reload')">새로고침</button>
      </div>
    </div>

    <!-- 하단: 스크롤 가능 테이블 -->
    <div class="table-responsive flex-grow-1 overflow-auto">
      <table class="table table-sm table-hover mb-0">
        <thead>
          <tr>
            <th>점검자</th>
            <th>점검일</th>
            <th>내용</th>
            <th>결과</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ins, idx) in inspectionList" :key="idx">
            <td><input v-model="ins.inspector_id" class="form-control form-control-sm" /></td>
            <td><input v-model="ins.inspection_date" type="date" class="form-control form-control-sm" /></td>
            <td><input v-model="ins.contents" class="form-control form-control-sm" /></td>
            <td>
              <select v-model="ins.result" class="form-select form-select-sm">
                <option>정상</option>
                <option>이상</option>
              </select>
            </td>
            <td class="text-nowrap">
              <button class="btn btn-sm btn-success me-1" @click="$emit('save', ins)">저장</button>
              <button class="btn btn-sm btn-danger" @click="$emit('delete', ins)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['inspectionList'],
  emits: ['add', 'save', 'delete', 'reload']
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
