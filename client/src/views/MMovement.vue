<!-- client/src/views/MMovement.vue -->
<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">자재 입/출고 조회</h2>

    <div class="card shadow-sm mb-4">
      <div class="card-header d-flex justify-content-between align-items-center bg-light">
        <div>
          <button
            class="btn btn-sm"
            :class="currentType === 'inbound' ? 'btn-primary' : 'btn-outline-primary'"
            @click="switchType('inbound')"
          >
            입고 이력
          </button>
          <button
            class="btn btn-sm ms-2"
            :class="currentType === 'outbound' ? 'btn-primary' : 'btn-outline-primary'"
            @click="switchType('outbound')"
          >
            출고 이력
          </button>
        </div>
        <small class="text-muted">총 {{ combinedList.length }}건</small>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle text-center mb-0">
            <thead class="table-primary">
              <tr>
                <th scope="col">
                  {{ currentType === 'inbound' ? '입고ID' : '출고ID' }}
                </th>
                <th scope="col">자재코드</th>
                <th scope="col">수량</th>
                <th scope="col">
                  {{ currentType === 'inbound' ? '입고일자' : '출고일자' }}
                </th>
                <th scope="col">담당자</th>
                <th scope="col">LOT 카운트</th>
                <th scope="col">LOT 번호</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in pagedList"
                :key="(currentType === 'inbound' ? item.min_id : item.mout_id) + '-' + item.mater_code"
              >
                <td>
                  {{ currentType === 'inbound' ? item.min_id : item.mout_id }}
                </td>
                <td>{{ item.mater_code }}</td>
                <td>{{ currentType === 'inbound' ? item.min_qty : item.mout_qty }}</td>
                <td>{{ currentType === 'inbound' ? item.min_date : item.mout_date }}</td>
                <td>{{ currentType === 'inbound' ? item.min_checker : item.mout_checker }}</td>
                <td>{{ item.lot_cnt }}</td>
                <td>{{ item.mater_lot }}</td>
              </tr>
              <tr v-if="!combinedList.length">
                <td colspan="7" class="text-muted py-4">
                  조회할 내역이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이징 네비게이션 -->
        <nav v-if="pagesCount > 1" class="mt-3">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                이전
              </a>
            </li>
            <li
              class="page-item"
              v-for="n in pagesCount"
              :key="n"
              :class="{ active: n === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(n)">
                {{ n }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === pagesCount }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                다음
              </a>
            </li>
          </ul>
        </nav>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useInboundStore } from '@/store/inbound';

export default {
  name: 'MMovement',
  setup() {
    const inboundStore = useInboundStore();
    return { inboundStore };
  },
  data() {
    return {
      currentType: 'inbound',
      movementList: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  async created() {
    const { type } = this.$route.query;
    this.currentType = type === 'outbound' ? 'outbound' : 'inbound';
    await this.fetchMovement(this.currentType);
  },
  computed: {
    combinedList() {
      const processed = Array.isArray(this.inboundStore.processedInbounds)
        ? this.inboundStore.processedInbounds
        : [];
      return this.currentType === 'inbound'
        ? [...processed, ...this.movementList]
        : this.movementList;
    },
    pagesCount() {
      return Math.ceil(this.combinedList.length / this.pageSize);
    },
    pagedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.combinedList.slice(start, start + this.pageSize);
    }
  },
  methods: {
    async fetchMovement(type) {
      try {
        const res = await axios.get('/api/m_movement', { params: { type } });
        this.movementList = res.data;
        this.currentPage = 1; // 타입 변경 시 페이지 초기화
      } catch (err) {
        console.error('입/출고 조회 실패', err);
        alert('입/출고 조회 중 오류가 발생했습니다.');
      }
    },
    switchType(type) {
      if (this.currentType === type) return;
      this.currentType = type;
      this.fetchMovement(type);
      this.$router.replace({ name: 'MMovement', query: { type } });
    },
    changePage(page) {
      if (page < 1 || page > this.pagesCount) return;
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.card-header .btn {
  width: 100px;
}
.pagination .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}
</style>
