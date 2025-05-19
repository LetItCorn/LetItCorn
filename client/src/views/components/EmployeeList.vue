<template>
  <div class="table-wrapper">
    <table class="table table-hover table-sm mb-0">
      <thead class="thead-light sticky-top">
        <tr>
          <th>사원ID</th><th>이름</th><th>사용자ID</th><th>휴대폰</th><th>입사일</th><th>퇴사일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="emp in employees"
          :key="emp.emp_id"
          @click="$emit('select', emp)"
          :class="{ 'table-active': emp.emp_id === selectedId }"
          style="cursor:pointer"
        >
          <td>{{ emp.emp_id }}</td>
          <td>{{ emp.emp_name }}</td>
          <td>{{ emp.user_id }}</td>
          <td>{{ emp.user_phone }}</td>
          <td>{{ format(emp.hire_date) }}</td>
          <td>{{ format(emp.retire_date) }}</td>
        </tr>
        <tr v-if="!employees.length">
          <td colspan="6" class="text-center py-4">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['employees', 'selectedId'],
  emits: ['select'],
  methods: {
    format(val) {
      if (!val) return '';
      const d = new Date(val);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
};
</script>

<style scoped>
.table-wrapper {
  height: 100%;
  overflow-y: auto;
}

.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
</style>
