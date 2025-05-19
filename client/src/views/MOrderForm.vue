<!-- client/src/views/MOrderForm.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">발주서 등록</h2>

    <!-- 기본 정보 & 등록 정보 카드 -->
    <div class="row mb-4">
      <!-- 기본 정보 카드 -->
      <div class="col-md-6">
        <div class="card border-primary mb-3 h-100">
          <div class="card-header bg-primary text-white">기본 정보</div>
          <div class="card-body">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="w-25">발주ID</th>
                  <td>
                    <input
                      v-model="form.moder_id"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>수신</th>
                  <td>
                    <select
                      v-model="form.client_code"
                      class="form-select form-select-sm"
                    >
                      <option value="" disabled>거래처 선택</option>
                      <option
                        v-for="c in clients"
                        :key="c.client_code"
                        :value="c.client_code"
                      >
                        {{ c.client_code }} — {{ c.client_name }}
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>요청자</th>
                  <td>
                    <input
                      v-model="form.moder_req"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>참조</th>
                  <td>
                    <input
                      v-model="form.reference"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </td>
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
                  <td>
                    <input
                      v-model="form.payment_term"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 등록 정보 카드 -->
      <div class="col-md-6">
        <div class="card border-secondary mb-3 h-100">
          <div class="card-header bg-secondary text-white">등록 정보</div>
          <div class="card-body">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="w-25">등록번호</th>
                  <td>
                    <input
                      v-model="form.reg_number"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>상호</th>
                  <td>
                    <input
                      v-model="form.partner_name"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>대표자명</th>
                  <td>
                    <input
                      v-model="form.ceo_name"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>
                    <input
                      v-model="form.address"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>업태/종목</th>
                  <td>
                    <input
                      v-model="form.business_type"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <th>연락처</th>
                  <td>
                    <input
                      v-model="form.contact"
                      type="text"
                      class="form-control form-control-sm"
                      readonly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 발주 품목 테이블 -->
    <div class="card mb-4">
      <div class="card-header">발주 품목</div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered text-center mb-2">
            <thead class="table-light">
              <tr>
                <th class="w-5">번호</th>
                <th>자재코드</th>
                <th>자재명</th>
                <th>규격</th>
                <th>수량</th>
                <th>단가</th>
                <th>공급가액</th>
                <th>부가세</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in rows" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  <select
                    v-model="row.mater_code"
                    class="form-select form-select-sm"
                    @change="onMaterChange(row)"
                  >
                    <option value="" disabled>선택</option>
                    <option
                      v-for="m in materials"
                      :key="m.mater_code"
                      :value="m.mater_code"
                    >
                      {{ m.mater_code }} — {{ m.mater_name }}
                    </option>
                  </select>
                </td>
                <td>
                  {{
                    materials.find(m => m.mater_code === row.mater_code)
                      ?.mater_name || '-'
                  }}
                </td>
                <td>
                  <input
                    v-model="row.spec"
                    type="text"
                    class="form-control form-control-sm"
                    readonly
                  />
                </td>
                <td>
                  <input
                    v-model.number="row.qty"
                    type="number"
                    min="1"
                    class="form-control form-control-sm"
                    @input="onQtyChange(row)"
                  />
                </td>
                <td>
                  <input
                    v-model.number="row.unit_price"
                    type="number"
                    class="form-control form-control-sm"
                    readonly
                  />
                </td>
                <td>{{ formatCurrency(row.supply_amount) }}</td>
                <td>{{ formatCurrency(row.tax_amount) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="text-end"><strong>합계:</strong></td>
                <td colspan="3">
                  <strong>{{ formatCurrency(totalSupply) }}</strong> /
                  <strong>{{ formatCurrency(totalTax) }}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="p-2 text-end">
          <button
            @click="addRow"
            class="btn btn-outline-primary btn-sm"
          >
            행 추가
          </button>
        </div>
      </div>
    </div>

    <!-- 등록 / 취소 버튼 -->
    <div class="text-center">
      <button
        @click="submitForm"
        :disabled="!canSubmit"
        class="btn btn-success me-3"
      >
        등록
      </button>
      <button
        @click="$router.push({ name: 'MOrdersList' })"
        class="btn btn-danger"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import useDates from '@/utils/useDates';

export default {
  name: 'MOrderForm',
  components: { VueDatePicker },
  data() {
    return {
      clients: [],
      materials: [],
      form: {
        moder_id: '',
        client_code: '',
        moder_req: '',
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
        mater_code: '',
        spec: '',
        qty: 1,
        unit_price: 0,
        supply_amount: 0,
        tax_amount: 0
      }))
    };
  },
  computed: {
    dateFormat() { return 'yyyy-MM-dd'; },
    totalSupply() { return this.rows.reduce((sum, r) => sum + r.supply_amount, 0); },
    totalTax()    { return this.rows.reduce((sum, r) => sum + r.tax_amount, 0); },
    canSubmit()   { return this.form.moder_id && this.form.client_code && this.rows.some(r => r.mater_code); }
  },

  // ← 이 부분을 추가하세요.
  watch: {
    'form.client_code'(newCode) {
      const client = this.clients.find(c => c.client_code === newCode);
      if (client) {
        this.form.partner_name  = client.client_name;
        this.form.ceo_name      = client.client_ceo;      // DB 필드명에 맞춰 사용
        this.form.address       = client.client_address;
        this.form.business_type = client.code_name;
        this.form.contact       = client.client_phone;
      } else {
        this.form.partner_name = '';
        this.form.ceo_name     = '';
        this.form.address      = '';
        this.form.business_type= '';
        this.form.contact      = '';
      }
    }
  },

  methods: {
    formatCurrency(val) {
      return val != null ? val.toLocaleString() : '0';
    },
    addRow() {
      this.rows.push({
        mater_code: '',
        spec: '',
        qty: 1,
        unit_price: 0,
        supply_amount: 0,
        tax_amount: 0
      });
    },
    onMaterChange(row) {
      const mat = this.materials.find(m => m.mater_code === row.mater_code);
      if (mat) {
        row.spec          = mat.spec || '';
        row.unit_price    = mat.m_price || 0;
        row.qty           = 1;
        row.supply_amount = row.qty * row.unit_price;
        row.tax_amount    = Math.floor(row.supply_amount * 0.1);
      }
    },
    onQtyChange(row) {
      row.supply_amount = row.qty * row.unit_price;
      row.tax_amount    = Math.floor(row.supply_amount * 0.1);
    },
    async submitForm() {
      try {
        const header = {
          ...this.form,
          moder_date: useDates.dateFormat(this.form.moder_date, this.dateFormat),
          due_date:   useDates.dateFormat(this.form.due_date,   this.dateFormat)
        };
        const details = this.rows
          .filter(r => r.mater_code)
          .map(r => ({
            mater_code:    r.mater_code,
            product_name:  this.materials.find(m => m.mater_code === r.mater_code)?.mater_name || '',
            spec:           r.spec,
            unit:           '',
            qty:            r.qty,
            unit_price:     r.unit_price,
            supply_amount:  r.supply_amount,
            tax_amount:     r.tax_amount
          }));
        await axios.post('/api/m_orders', { header, details });
        this.$router.push({ name: 'MOrdersList' });
      } catch (err) {
        console.error('발주서 등록 실패:', err.response?.data || err);
        alert('발주서 등록 중 오류가 발생했습니다.');
      }
    }
  },

  async created() {
    // 발주ID 및 등록번호 자동 생성
    const prefix    = 'MORD';
    const date      = useDates.dateFormat(new Date(), 'yyyyMMdd');
    const timestamp = Date.now();
    this.form.moder_id    = `${prefix}${date}${timestamp}`;
    this.form.reg_number  = this.form.moder_id;

    // 거래처 목록 조회
    try {
      const { data } = await axios.get('/api/m_clients');
      this.clients = data;
    } catch (e) {
      console.error('거래처 목록 조회 실패', e);
      alert('거래처 목록을 불러오는 중 오류가 발생했습니다.');
    }

    // 자재 목록 조회
    try {
      const { data } = await axios.get('/api/materials/stock');
      this.materials = data;
    } catch (e) {
      console.error('자재 목록 조회 실패', e);
      alert('자재 목록을 불러오는 중 오류가 발생했습니다.');
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
