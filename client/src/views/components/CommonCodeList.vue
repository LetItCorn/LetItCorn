<!-- src/views/components/CommonCodeList.vue -->
<template>
  <div class="card h-100 d-flex flex-column">
    <div class="card-body p-0 flex-fill overflow-auto">
      <table class="table table-sm table-hover mb-0">
        <thead class="thead-light sticky-top">
          <tr><th>그룹</th><th>하위코드</th><th>코드명</th><th>사용여부</th><th>비고</th></tr>
        </thead>
        <tbody>
          <tr v-for="code in codeList" :key="code.code_group + code.code_rear"
              @click="$emit('select', code)"
              :class="{ 'table-active': isSelected(code) }"
              style="cursor:pointer;">
            <td>{{ code.code_group }}</td>
            <td>{{ code.code_rear }}</td>
            <td>{{ code.code_name }}</td>
            <td>{{ code.use_yn }}</td>
            <td>{{ code.comm_etc }}</td>
          </tr>
          <tr v-if="codeList.length === 0">
            <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonCodeList',
  props: {
    codeList: Array,
    selected: Object,
  },
  emits: ['select'],
  methods: {
    isSelected(code) {
      return code.code_group === this.selected?.code_group &&
             code.code_rear === this.selected?.code_rear;
    }
  }
};
</script>
