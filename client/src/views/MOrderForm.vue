<!-- client/src/views/MOrderForm.vue -->
<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">발주서</h2>
  
      <!-- 기본 정보 & 등록 정보 카드 -->
      <div class="row mb-4">
        <!-- 기본 정보 -->
        <div class="col-md-6">
          <div class="card border-primary mb-3">
            <div class="card-header bg-primary text-white">기본 정보</div>
            <div class="card-body">
              <table class="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="w-25">발주ID</th>
                    <td><input v-model="form.moder_id" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>수신</th>
                    <td><input v-model="form.receiver" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>참조</th>
                    <td><input v-model="form.reference" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>발주일</th>
                    <td>
                      <VueDatePicker
                        v-model="form.moder_date"
                        :format="dateFormat"
                        class="form-control form-control-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>납기일</th>
                    <td>
                      <VueDatePicker
                        v-model="form.due_date"
                        :format="dateFormat"
                        class="form-control form-control-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>지불조건</th>
                    <td><input v-model="form.payment_term" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- 등록 정보 -->
        <div class="col-md-6">
          <div class="card border-secondary mb-3">
            <div class="card-header bg-secondary text-white">등록 정보</div>
            <div class="card-body">
              <table class="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="w-25">등록번호</th>
                    <td><input v-model="form.reg_number" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>상호</th>
                    <td><input v-model="form.partner_name" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>대표자명</th>
                    <td><input v-model="form.ceo_name" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td><input v-model="form.address" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>업태/종목</th>
                    <td><input v-model="form.business_type" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                  <tr>
                    <th>연락처</th>
                    <td><input v-model="form.contact" type="text" class="form-control form-control-sm" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 발주 품목 카드 -->
      <div class="card mb-4">
        <div class="card-header">발주 품목</div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered text-center mb-2">
              <thead class="table-light">
                <tr>
                  <th class="w-5">번호</th>
                  <th>품명</th>
                  <th>규격</th>
                  <th>단위</th>
                  <th>수량</th>
                  <th>단가</th>
                  <th>공급가액</th>
                  <th>부가세</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in rows" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td><input v-model="row.product_name" type="text" class="form-control form-control-sm" /></td>
                  <td><input v-model="row.spec" type="text" class="form-control form-control-sm" /></td>
                  <td><input v-model="row.unit" type="text" class="form-control form-control-sm" /></td>
                  <td><input v-model.number="row.quantity" type="number" min="0" class="form-control form-control-sm" /></td>
                  <td><input v-model.number="row.unit_price" type="number" min="0" class="form-control form-control-sm" /></td>
                  <td>{{ formatCurrency(row.quantity * row.unit_price) }}</td>
                  <td>{{ formatCurrency(row.quantity * row.unit_price * 0.1) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6" class="text-end"><strong>합계:</strong></td>
                  <td>{{ formatCurrency(totalSupply) }}</td>
                  <td>{{ formatCurrency(totalTax) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="p-2 text-end">
            <button @click="addRow" class="btn btn-outline-primary btn-sm">행 추가</button>
          </div>
        </div>
      </div>
  
      <!-- 등록 / 취소 버튼 -->
      <div class="text-center">
        <button @click="submitForm" :disabled="!canSubmit" class="btn btn-success me-3">
          등록
        </button>
        <button @click="$router.push({ name: 'MOrdersList' })" class="btn btn-danger">
          취소
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import useDates from '@/utils/useDates';    // 추가
  
  export default {
    name: 'MOrderForm',
    components: { VueDatePicker },
    data() {
      return {
        form: {
          moder_id: '',
          receiver: '',
          reference: '',
          moder_date: null,
          due_date: null,
          payment_term: '',
          reg_number: '',
          partner_name: '',
          ceo_name: '',
          address: '',
          business_type: '',
          contact: ''
        },
        rows: Array.from({ length: 3 }, () => ({
          product_name: '',
          spec: '',
          unit: '',
          quantity: 0,
          unit_price: 0
        }))
      };
    },
    computed: {
      dateFormat() { return 'yyyy-MM-dd'; },
      totalSupply() {
        return this.rows.reduce((sum, r) => sum + r.quantity * r.unit_price, 0);
      },
      totalTax() {
        return this.totalSupply * 0.1;
      },
      canSubmit() {
        return (
          this.form.moder_id &&
          this.form.receiver &&
          this.rows.some(r => r.product_name)
        );
      }
    },
    methods: {
      formatCurrency(val) {
        return val.toLocaleString();
      },
      addRow() {
        this.rows.push({ product_name: '', spec: '', unit: '', quantity: 0, unit_price: 0 });
      },
      async submitForm() {
        try {
          // 날짜를 'yyyy-MM-dd' 문자열로 변환
          const md = useDates.dateFormat(this.form.moder_date, this.dateFormat);
          const dd = useDates.dateFormat(this.form.due_date, this.dateFormat);
  
          const payloads = this.rows
            .filter(r => r.product_name)
            .map(r => ({
              moder_id: this.form.moder_id,
              mater_code: r.product_name,
              moder_qty: r.quantity,
              moder_date: md,
              moder_req: this.form.reference,
              receiver: this.form.receiver,
              reference: this.form.reference,
              due_date: dd,
              payment_term: this.form.payment_term,
              partner_name: this.form.partner_name,
              ceo_name: this.form.ceo_name,
              address: this.form.address,
              business_type: this.form.business_type,
              contact: this.form.contact
            }));
  
          console.log('발주서 요청 페이로드:', payloads);
          await Promise.all(payloads.map(p => axios.post('/api/m_orders', p)));
  
          // 등록 뒤 목록으로 이동
          this.$router.push({ name: 'MOrdersList' });
  
        } catch (err) {
          // 상세 에러 메시지 출력
          console.error('발주서 등록 에러 상세:', err.response?.data || err);
          alert('발주서 등록 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
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
  .card {
    border-width: 2px;
  }
  .card-header {
    font-weight: bold;
  }
  </style>
  