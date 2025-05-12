<template>
  <div class="card-header">
    <div class="row">
      <div class="col-2"><span>{{ processes.process_name }}</span></div>
      <span class="col-8">공정시작</span>
    </div>
  </div>
  <div class="card-body container row">
    <div class="col-8" style="border-right: 1px solid #555;">
      <div class="mb-3 text-end">
        <button class="btn btn-success">저장</button>
      </div>
      <div class="mb-3">
        <label v-if="orderQty" class="form-label">지시량: {{ orderQty }}</label>
        <input class="form-control" v-model="manuFac" placeholder="생산수량" type="number">
      </div>
      <div class="mb-3">
        <input class="form-control" v-model="manuErr" placeholder="불량수량" type="number">
      </div>
    </div>

    <div class="col-3"></div>
  </div>
</template>
<script>
  import {
    useProcess
  } from '@/store/processStat';
  import {
    mapState
  } from 'pinia';
  export default {
    components: {},
    data() {
      return {
        manuFac: '',
        manuErr: ''
      };
    },
    created() {},
    mounted() {},
    methods: {

    },
    computed: {
  ...mapState(useProcess, ['processes', 'orderQty'])
}
  }
</script>
<style scoped />