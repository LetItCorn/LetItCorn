<template>
  <div class="purchase-order-form container py-4">
    <h2 class="text-center mb-4">발주서 등록</h2>

    <!-- ───── Header 입력 ───── -->
    <table class="table table-borderless mb-5">
      <tbody>
        <tr>
          <th>발주ID</th>
          <td><input v-model="po.header.order_id" class="form-control" /></td>
          <th>등록번호</th>
          <td><input v-model="po.header.reg_number" class="form-control" /></td>
        </tr>
        <tr>
          <th>수신</th>
          <td><input v-model="po.header.receiver"    class="form-control" /></td>
          <th>상호</th>
          <td><input v-model="po.header.partner_name" class="form-control" /></td>
        </tr>
        <tr>
          <th>참조</th>
          <td><input v-model="po.header.reference"    class="form-control" /></td>
          <th>대표자명</th>
          <td><input v-model="po.header.ceo_name"     class="form-control" /></td>
        </tr>
        <tr>
          <th>발주일</th>
          <td><input v-model="po.header.order_date"   type="date" class="form-control" /></td>
          <th>주소</th>
          <td><input v-model="po.header.address"      class="form-control" /></td>
        </tr>
        <tr>
          <th>납기일</th>
          <td><input v-model="po.header.due_date"     type="date" class="form-control" /></td>
          <th>업태/종목</th>
          <td><input v-model="po.header.business_type" class="form-control" /></td>
        </tr>
        <tr>
          <th>지불조건</th>
          <td><input v-model="po.header.payment_term" class="form-control" /></td>
          <th>연락처</th>
          <td><input v-model="po.header.contact"      class="form-control" /></td>
        </tr>
      </tbody>
    </table>

    <!-- ───── Detail 입력 ───── -->
    <table class="table table-bordered mb-2 text-center">
      <thead class="table-light">
        <tr>
          <th>번호</th>
          <th>품명</th>
          <th>규격</th>
          <th>단위</th>
          <th>수량</th>
          <th>단가</th>
          <th>공급가액</th>
          <th>부가세(10%)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(d, idx) in po.details"
          :key="idx"
        >
          <td>{{ d.line_no }}</td>
          <td><input v-model="d.product_name" class="form-control" /></td>
          <td><input v-model="d.spec"          class="form-control" /></td>
          <td><input v-model="d.unit"          class="form-control" /></td>
          <td><input v-model.number="d.qty"     type="number" class="form-control" /></td>
          <td><input v-model.number="d.unit_price" type="number" class="form-control" /></td>
          <td>{{ formatNumber(d.qty * d.unit_price) }}</td>
          <td>{{ formatNumber((d.qty * d.unit_price) * 0.1) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 합계 -->
    <div class="d-flex justify-content-end mb-4">
      <strong class="me-4">합계 공급가액: {{ formatNumber(totalSupply) }}</strong>
      <strong>합계 부가세: {{ formatNumber(totalTax) }}</strong>
    </div>

    <!-- 버튼 -->
    <div class="text-center">
      <button class="btn btn-success me-3" @click="registerOrder">
        등록
      </button>
      <button class="btn btn-danger" @click="cancel">
        취소
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PurchaseOrderForm',
  data() {
    return {
      po: {
        header: {
          order_id: '',
          receiver: '',
          reg_number: '',
          reference: '',
          order_date: '',
          due_date: '',
          payment_term: '',
          business_type: '',
          contact: '',
          partner_name: '',
          ceo_name: '',
          address: ''
        },
        details: Array.from({ length: 3 }, (_, i) => ({
          line_no: i + 1,
          product_name: '',
          spec: '',
          unit: '',
          qty: 0,
          unit_price: 0
        }))
      }
    };
  },
  computed: {
    // 공급가액 합계
    totalSupply() {
      return this.po.details.reduce(
        (sum, d) => sum + (d.qty * d.unit_price || 0),
        0
      );
    },
    // 세액 합계
    totalTax() {
      return this.po.details.reduce(
        (sum, d) => sum + ((d.qty * d.unit_price || 0) * 0.1),
        0
      );
    }
  },
  methods: {
    // 숫자 천 단위 콤마 포맷터
    formatNumber(val) {
      return val.toLocaleString();
    },

    // 발주 등록
    async registerOrder() {
      try {
        // payload 구조에 맞춰 헤더·상세를 전송
        const payload = {
          header: this.po.header,
          details: this.po.details.map(d => ({
            line_no:      d.line_no,
            product_name: d.product_name,
            spec:         d.spec,
            unit:         d.unit,
            qty:          d.qty,
            unit_price:   d.unit_price,
            supply_amount: d.qty * d.unit_price
            // note, quality_check, in_charge 필드가 필요하면 여기 추가
          }))
        };
        const res = await axios.post('/api/purchase-orders', payload);
        if (res.data.success) {
          alert('발주서 등록 성공!');
          // 등록 후 초기화 또는 다른 페이지로 이동
          this.$router.push('/materials/order-list');
        } else {
          alert('등록에 실패했습니다.');
        }
      } catch (err) {
        console.error(err);
        alert('서버 오류가 발생했습니다.');
      }
    },

    // 취소 (뒤로가기)
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.purchase-order-form table th,
.purchase-order-form table td {
  vertical-align: middle;
}
</style>
