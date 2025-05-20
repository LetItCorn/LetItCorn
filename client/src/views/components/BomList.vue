<template>
  <div class="card h-100 d-flex flex-column">
   
      <!-- 💡 리스트 스크롤 영역 -->
      <div class="table-responsive flex-fill overflow-auto p-2">
        <table class="table table-hover table-sm ">
          <thead class="thead-light">
            <tr class="sticky-header">
              <th>BOM ID</th>
              <th>품목코드</th>
              <th>품목명</th>
              <th>등록일</th>
            </tr>
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
              <td >{{dateFormat(bom.registered_date) }}</td>
            </tr>
            <tr v-if="bomList.length === 0">
              <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 버튼 영역 -->
      <div class="mt-2 d-flex justify-content-end">
        <button @click="$emit('add')" class="btn btn-sm btn-warning me-1" style="width:100px;">등록</button>
        <button @click="$emit('delete')" class="btn btn-sm btn-danger" :disabled="!selectedBom" style="width:100px;">삭제</button>
      </div>
   
  </div>
</template>

<script>
import useDates from '@/utils/useDates';
export default {
  name: 'BomList',
  props: {
    bomList: Array,
    selectedBom: Object
  },
 methods:{
  dateFormat(value){
 return useDates.dateFormat(value, 'yyyy-MM-dd')
  }
 }
};
</script>

<style scoped>
.table-active {
  background-color: #d0ebff;
}

/* 🧷 헤더 고정 (thead-light는 Bootstrap 클래스) */
.sticky-header th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

/* 줄 hover 스타일 */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
