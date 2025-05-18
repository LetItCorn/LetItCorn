<!-- src/components/ItemList.vue -->
<template>
  <table class="table table-sm table-hover mb-0">
    <thead class="thead-light sticky-top">
      <tr>
        <th>품목코드</th><th>품목명</th><th>구분</th><th>수량</th><th>단위</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in itemList"
        :key="item.item_code"
        @click="$emit('select', item)"
        :class="{ 'table-active': item.item_code === selectedCode }"
        style="cursor:pointer"
      >
        <td>{{ item.item_code }}</td>
        <td>{{ item.item_name }}</td>
        <td>{{ item.type_name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.spec }}</td>
      </tr>
      <tr v-if="!itemList.length">
        <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['itemList', 'selectedCode'],
  emits: ['select']
};
</script>
