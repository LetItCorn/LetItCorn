<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h5>구성품 {{ edit ? '수정' : '등록' }}</h5>

      <div class="mb-2">
        <label class="form-label mb-1">자재선택</label>
        <select v-model="form.mater_code" class="form-select form-select-sm">
          <option value="">-- 선택 --</option>
          <option
            v-for="m in materials"
            :key="m.mater_code"
            :value="m.mater_code"
          >
            {{ m.mater_code }} | {{ m.mater_name }}
          </option>
        </select>
      </div>

      <div class="mb-2">
        <label class="form-label mb-1">수량</label>
        <input
          type="number"
          min="1"
          v-model.number="form.quantity"
          class="form-control form-control-sm"
        />
      </div>

      <div class="d-flex justify-content-end">
        <button
          class="btn btn-sm btn-primary me-2"
          @click="$emit('submit')"
          :disabled="!form.mater_code || form.quantity < 1"
        >
          {{ edit ? '수정' : '등록' }}
        </button>
        <button class="btn btn-sm btn-secondary" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BomCompModal',
  props: {
    form: Object,
    materials: Array,
    edit: Boolean
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
