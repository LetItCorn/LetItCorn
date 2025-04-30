<!-- src/views/ItemInfo.vue -->
<template>
  <div class="container">
    <h2>품목 상세: {{ itemInfo.item_code }}</h2>
    <table class="table">
      <tr><th>품목코드</th><td>{{ itemInfo.item_code }}</td></tr>
      <tr><th>품목명</th><td>{{ itemInfo.item_name }}</td></tr>
      <tr><th>구분</th><td>{{ itemInfo.item_type }}</td></tr>
      <tr><th>단위</th><td>{{ itemInfo.unit_code }}</td></tr>
      <tr><th>규격</th><td>{{ itemInfo.spec }}</td></tr>
    </table>
    <button @click="$router.back()" class="btn btn-light mt-4">목록으로</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ItemInfo',
  data() {
    return { itemInfo: {} }
  },
  async created() {
    const code = this.$route.query.item_code
    console.log(code);
    if (code) {
      const res = await axios
        .get(`/api/items/${code}`)
        .catch(console.error)
      this.itemInfo = res.data 
    }
  }
}
</script>
