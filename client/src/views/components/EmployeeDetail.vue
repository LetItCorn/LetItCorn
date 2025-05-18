<!-- src/components/EmployeeDetail.vue -->
<template>
  <div>
    <table class="table table-borderless mb-3">
      <tbody>
        <tr>
          <th>사원ID</th>
          <td><input v-model="emp.emp_id" class="form-control form-control-sm" readonly /></td>
        </tr>
        <tr><th>이름</th><td><input v-model="emp.emp_name" class="form-control form-control-sm" /></td></tr>
        <tr><th>사용자ID</th><td><input v-model="emp.user_id" class="form-control form-control-sm" /></td></tr>
        <tr><th>비밀번호</th><td><input v-model="emp.user_passd" class="form-control form-control-sm" /></td></tr>
        <tr><th>휴대폰</th><td><input v-model="emp.user_phone" class="form-control form-control-sm" /></td></tr>
        <tr><th>주소</th><td><input v-model="emp.user_addr" class="form-control form-control-sm" /></td></tr>
        <tr><th>이메일</th><td><input v-model="emp.user_email" class="form-control form-control-sm" /></td></tr>
        <tr>
          <th>생년월일</th>
          <td><input type="date" v-model="emp.user_birth" class="form-control form-control-sm" /></td>
        </tr>
        <tr>
          <th>성별</th>
          <td>
            <select v-model="emp.user_gender" class="form-select form-select-sm">
              <option value="">선택</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </td>
        </tr>
        <tr>
          <th>권한코드</th>
          <td>
            <select v-model="emp.role_code" class="form-select form-select-sm">
              <option value="">선택</option>
              <option v-for="code in codeList" :key="code.code_values" :value="code.code_values">
                {{ code.code_name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>근무상태코드</th>
          <td>
            <select v-model="emp.status_code" class="form-select form-select-sm">
              <option value="">선택</option>
              <option v-for="code in workList" :key="code.code_values" :value="code.code_values">
                {{ code.code_name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>입사일</th>
          <td><input type="date" v-model="emp.hire_date" class="form-control form-control-sm" /></td>
        </tr>
        <tr>
          <th>퇴사일</th>
          <td><input type="date" v-model="emp.retire_date" class="form-control form-control-sm" /></td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary flex-grow-1" @click="$emit('clear')">초기화</button>
      <button class="btn btn-success flex-grow-1" @click="$emit('create')">등록</button>
      <button class="btn btn-danger flex-grow-1" @click="$emit('delete')" :disabled="!emp.emp_id || emp.mode === 'reg'">삭제</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['emp', 'codeList', 'workList'],
  emits: ['create', 'delete', 'clear']
};
</script>
