<!-- src/views/components/InspectionHistory.vue -->
<template>
  <div class="card flex-grow-1 d-flex flex-column">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>설비 점검 이력 ({{ inspectionList.length }})</span>
      <div class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-primary" @click="$emit('add')">추가</button>
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('reload')">새로고침</button>
      </div>
    </div>
    <div class="card-body p-0 overflow-auto">
      <table class="table table-sm table-hover mb-0">
        <thead class="thead-light sticky-top">
          <tr>
            <th style="width:20%">점검자</th>
            <th style="width:20%">점검일</th>
            <th style="width:35%">내용</th>
            <th style="width:15%">결과</th>
            <th style="width:10%"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ins, idx) in inspectionList"
            :key="ins.inspection_id || `new-${idx}`"
          >
            <td><input v-model="ins.inspector_id" class="form-control form-control-sm" /></td>
            <td><input v-model="ins.inspection_date" type="date" class="form-control form-control-sm" /></td>
            <td><input v-model="ins.contents" class="form-control form-control-sm" /></td>
            <td>
              <select v-model="ins.result" class="form-select form-select-sm">
                <option value="정상">정상</option>
                <option value="이상 발견">이상 발견</option>
              </select>
            </td>
            <td>
              <button class="btn btn-sm btn-success me-1" @click="$emit('save', ins)">저장</button>
              <button class="btn btn-sm btn-danger" @click="$emit('delete', ins)">삭제</button>
            </td>
          </tr>
          <tr v-if="!inspectionList.length">
            <td colspan="5" class="text-center py-3">이력이 없습니다.</td>
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
