<!-- src/views/ItemList.vue -->
<template>
  <div class="p-6 space-y-4">
    <!-- 1) 코드 조회 바 -->
    <div class="flex items-center space-x-2">
      <input
        v-model="searchCode"
        placeholder="품목코드"
        class="border px-3 py-2 rounded flex-1 max-w-xs"
      />
      <button
        @click="searchByCode"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        조회
      </button>
      <button
        @click="loadAll"
        class="border px-4 py-2 rounded"
      >
        전체
      </button>
    </div>

    <!-- 2) 리스트 -->
    <div class="overflow-auto border rounded">
      <table class="min-w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 border">품목코드</th>
            <th class="px-3 py-2 border">품목명</th>
            <th class="px-3 py-2 border">구분</th>
            <th class="px-3 py-2 border">단위</th>
            <th class="px-3 py-2 border">규격</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in itemList"
            :key="item.item_code"
            @click="goToDetailInfo(item.item_code)"
            class="cursor-pointer hover:bg-gray-50"
          >
            <td class="px-3 py-2 border">{{ item.item_code }}</td>
            <td class="px-3 py-2 border">{{ item.item_name }}</td>
            <td class="px-3 py-2 border">{{ item.item_type }}</td>
            <td class="px-3 py-2 border">{{ item.unit_code }}</td>
            <td class="px-3 py-2 border">{{ item.spec }}</td>
          </tr>
          <tr v-if="itemList.length === 0">
            <td class="px-3 py-2 border text-center" colspan="5">
              데이터가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3) 총 개수 -->
    <div class="text-right text-sm text-gray-600">
      Total: {{ count }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ItemList',
  data() {
    return {
      searchCode: '',
      itemList: []
    };
  },
  computed: {
    count() {
      return this.itemList.length;
    }
  },
  created() {
    this.loadAll();
  },
  methods: {
    // 전체 리스트 조회
    async loadAll() {
      this.searchCode = '';
      try {
        const res = await axios.get('/api/items');
        this.itemList = res.data;
      } catch (err) {
        console.error(err);
        this.itemList = [];
      }
    },
    // 코드 단건 조회
    async searchByCode() {
      const code = this.searchCode.trim();
      if (!code) {
        this.loadAll();
        return;
      }
      try {
        const res = await axios.get(`/api/items/${code}`);
        // 단건 조회라면 객체 혹은 배열 반환 예상.
        // 배열이면 바로, 객체면 [obj]
        this.itemList = Array.isArray(res.data)
          ? res.data
          : (res.data ? [res.data] : []);
      } catch (err) {
        console.error(err);
        this.itemList = [];
      }
    },
    // 상세 페이지로 이동
    goToDetailInfo(code) {
      this.$router.push({
        name: 'ItemInfo',
        query: { item_code: code }
      });
    }
  }
};
</script>

<style scoped>
/* optional */
</style>
