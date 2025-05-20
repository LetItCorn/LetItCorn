<template>
  <div class="row m-0" style="height:10vh;">
    <div class="col-12 h-100">
      <div class="card h-100 position-relative overflow-visible">
        <div class="card-body pt-5">
          <div class="position-absolute top-0 end-0 d-flex align-items-center" style="margin:1.5rem; z-index:1000;">
            <label class="me-2 mb-0">완제품코드</label>
            <input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              placeholder="코드입력"
              class="form-control   me-1"
              style="width:150px; height:32px;"
            />
            <button @click="$emit('search')" class="btn btn-sm btn-outline-primary me-1" style="width:100px; height:32px;">
              조회
            </button>
            <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary" style="width:100px; height:32px;">
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BomFilter',
  props: {
    modelValue: String
  }
};
</script>
