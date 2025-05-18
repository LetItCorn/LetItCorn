<template>
  <div class="card h-100 d-flex flex-column">
    <div class="card-body p-2 d-flex flex-column flex-fill">
      <div class="table-responsive flex-fill overflow-auto">
        <table class="table table-hover table-sm mb-0">
          <thead class="thead-light sticky-top">
            <tr><th>BOM ID</th><th>품목코드</th><th>품목명</th><th>등록일</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="bom in bomList"
              :key="bom.bom_id"
              @click="$emit('select', bom)"
              :class="{ 'table-active': bom.bom_id === selectedBom?.bom_id }"
              style="cursor:pointer;"
            >
              <td>{{ bom.bom_id }}</td>
              <td>{{ bom.item_code }}</td>
              <td>{{ bom.item_name }}</td>
              <td>{{ bom.registered_date }}</td>
            </tr>
            <tr v-if="bomList.length === 0">
              <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2 d-flex justify-content-end">
        <button @click="$emit('add')" class="btn btn-sm btn-warning me-1" style="width:100px;">등록</button>
        <button @click="$emit('delete')" class="btn btn-sm btn-danger" :disabled="!selectedBom" style="width:100px;">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BomList',
  props: {
    bomList: Array,
    selectedBom: Object
  }
};
</script>

<style scoped>
.table-active {
  background-color: #d0ebff;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}
</style>
