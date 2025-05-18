<!-- src/components/ItemProcessFlow.vue -->
<template>
  <div class="card h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>공정 흐름</span>
      <div>
        <button @click="$emit('add')">추가</button>
        <button @click="$emit('delete')">삭제</button>
        <button @click="$emit('save')">저장</button>
      </div>
    </div>
    <div class="card-body p-3 overflow-auto">
      <table class="table table-sm table-bordered text-center mb-0">
        <thead class="thead-light">
          <tr><th style="width: 10%;">순서</th><th style="width: 60%;">공정 선택</th><th style="width: 30%;">소요시간</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="group in flows"
            :key="group.sequence_order"
            :class="{ selected: group.sequence_order === selectedSeq }"
            @click="$emit('select', group)"
          >
            <template v-if="!group.isAdding">
              <td>{{ group.sequence_order }}</td>
              <td>{{ group.process_name }}</td>
              <td><input :value="`${group.duration_min}분`" readonly class="form-control form-control-sm text-center" /></td>
            </template>
            <template v-else>
              <td>{{ group.sequence_order }}</td>
              <td>
                <select v-model="group.process_code" @change="$emit('change', group)">
                  <option value="">-- 선택하세요 --</option>
                  <option v-for="p in processes" :key="p.process_code" :value="p.process_code">{{ p.process_name }}</option>
                </select>
              </td>
              <td></td>
            </template>
          </tr>
          <tr v-if="!flows.length">
            <td colspan="3" class="text-center">등록된 공정이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['flows', 'processes', 'selectedSeq'],
  emits: ['add', 'delete', 'save', 'select', 'change']
};
</script>
