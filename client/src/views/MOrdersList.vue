<!-- client/src/views/MOrdersList.vue -->
<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">발주서 목록</h2>
      <div class="text-end mb-3">
        <router-link to="/m_orders" class="btn btn-primary">새 발주서 등록</router-link>
      </div>
      <div class="table-responsive">
        <table class="table table-striped text-center">
          <thead class="table-light">
            <tr>
              <th>발주ID</th>
              <th>자재코드</th>
              <th>수량</th>
              <th>발주일</th>
              <th>납기일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.moder_id + '-' + order.mater_code"
            >
              <td>{{ order.moder_id }}</td>
              <td>{{ order.mater_code }}</td>
              <td>{{ order.moder_qty }}</td>
              <td>{{ order.moder_date }}</td>
              <td>{{ order.due_date }}</td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteOrder(order)"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'MOrdersList',
    data() {
      return {
        orders: []
      };
    },
    async created() {
      await this.fetchOrders();
    },
    methods: {
      async fetchOrders() {
        try {
          const res = await axios.get('/api/m_orders');
          this.orders = res.data;
        } catch (e) {
          console.error('목록 조회 실패', e);
        }
      },
      async deleteOrder(order) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
          await axios.delete(
            `/api/m_orders/${order.moder_id}/${order.mater_code}`
          );
          this.orders = this.orders.filter(
            o =>
              !(
                o.moder_id === order.moder_id &&
                o.mater_code === order.mater_code
              )
          );
        } catch (e) {
          console.error('삭제 실패', e);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .table th,
  .table td {
    vertical-align: middle;
  }
  </style>
  