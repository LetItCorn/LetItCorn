<!-- client/src/views/MOrderForm.vue -->
<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">발주서 등록</h2>

    <!-- 동작흐름
      1 data()로 초기 state 설정 -> form,rows,materials 준비
      
      2 v-model 바인딩: 사용자 입력 즉시 form/rows 상태 업데이트

      3 computed(dateFormat, totalSupply, totalTax, canSubmit) 자동 평가 -> ui 표시 제어

      4 @click 이벤트 발생 -> methods 호출
    -->
    <!-- 기본정보 & 등록 정보 카드 렌더링 -->
    <div class="row mb-4">
      <!-- 기본 정보 카드 (form 필드) -->
      <div class="col-md-6">
        <div class="card border-primary mb-3">
          <div class="card-header bg-primary text-white">기본 정보</div>
          <div class="card-body">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="w-25">발주ID</th>
                  <!-- 사용자 입력 -> v-model="form.moder_id" 적용 -> form 상태 변경 ui 업데이트 -->
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
                  <!-- 3 computed.dateFormat으로 포맷 적용 -> vueDatePicker 렌더링 흐름 -->
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
      <!-- 등록 정보 카드 (form 필드) 동일 흐름 반복 -->
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

    <!-- 발주 품목 테이블: rows 배열 기반 렌더링 흐름 -->
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
                <td>
                  <select
                    v-model="row.mater_code"
                    class="form-select form-select-sm"
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
                  {{ materials.find(m => m.mater_code === row.mater_code)?.mater_name || '-' }}
                </td>
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
                <td colspan="3">
                  <strong>{{ formatCurrency(totalSupply) }}</strong> /
                  <strong>{{ formatCurrency(totalTax) }}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="p-2 text-end">
          <button @click="addRow" class="btn btn-outline-primary btn-sm">행 추가</button>
        </div>
      </div>
    </div>

    <!-- 등록 / 취소 -->
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
import axios from 'axios';     // http 클라이언트트
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';   //날짜 포맷 유틸
import useDates from '@/utils/useDates';

export default {
  name: 'MOrderForm',               //컴포넌트 이름 선언  
  components: { VueDatePicker },    // 외부 컴포넌트 등록
  data() {                          // data() 초기 상태 설정 흐름:
    return {                        // 컴포넌트 인스턴스 생성 -> data() 실행 -> 초기 state 반환
      materials: [],                // materials = [] (빈 배열)
      form: {                       // form = { moder_id:'', reciver:'', ... } (폼 필드 초기화)
        moder_id: '',               // 발주 id 
        receiver: '',               // 수신
        reference: '',              // 참조
        moder_date: null,           // 발주일 (Date 객체)
        due_date: null,             // 납기일 (Date 객체)
        payment_term: '',           // 지불조건
        reg_number: '',             // 등록번호
        partner_name: '',           // 상호 
        ceo_name: '',               // 대표자명
        address: '',                // 주소
        business_type: '',          // 업태종목
        contact: ''                 // 연락처
      },
      rows: Array.from({ length: 3 }, () => ({    // 발주 품목 3행 생성
        mater_code: '',               // 자재코드
        spec: '',                     // 규격
        unit: '',                     // 단위
        quantity: 0,                  // 수량
        unit_price: 0                 // 단가
      }))
    };
  },
   // 2) computed 속성 흐름:
  //    - dateFormat: 달력 포맷 지정 ('yyyy-MM-dd')
  //    - totalSupply: rows 변경 감지 → 합계 계산 → 반환
  //    - totalTax: totalSupply 변경 감지 → 0.1 곱 → 반환
  //    - canSubmit: form 필수 필드 + rows 검사 → boolean 반환
  computed: {
    dateFormat() { return 'yyyy-MM-dd'; },
    totalSupply() { return this.rows.reduce((sum, r) => sum + r.quantity * r.unit_price, 0); },
    totalTax()    { return this.totalSupply * 0.1; },
    canSubmit() {
      return (
        this.form.moder_id &&
        this.form.receiver &&
        this.rows.some(r => r.mater_code)
      );
    }
  },
  async created() {
    try {
      const res = await axios.get('/api/materials');
      this.materials = res.data;
    } catch (e) {
      console.error('자재 목록 조회 실패', e);
      alert('자재 목록을 불러오는 중 오류가 발생했습니다.');
    }
  },
    // 4) methods 흐름:
  //    - formatCurrency: 템플릿 호출 → 숫자 포맷 문자열 반환
  //    - addRow: 버튼 클릭 → this.rows.push → 뷰 반영
  //    - submitForm:
  //        1. 클릭 → 함수 실행
  //        2. 날짜 포맷 변환(useDates)
  //        3. payload 구성(header + details)
  //        4. axios.post('/api/m_orders', payload)
  //        5. 성공: this.$router.push → 목록 페이지 이동
  //        6. 오류: console.error + alert
  methods: {
    formatCurrency(val) { return val.toLocaleString(); },
    addRow() {
      this.rows.push({ mater_code: '', spec: '', unit: '', quantity: 0, unit_price: 0 });
    },
    async submitForm() {
      try {
        const md = useDates.dateFormat(this.form.moder_date, this.dateFormat);
        const dd = useDates.dateFormat(this.form.due_date, this.dateFormat);

        await axios.post('/api/m_orders', {
          header: {
            ...this.form,
            moder_date: md,
            due_date: dd
          },
          details: this.rows
            .filter(r => r.mater_code)
            .map(r => ({
              mater_code:    r.mater_code,
              product_name:  this.materials.find(m => m.mater_code === r.mater_code)?.mater_name || '',
              spec:          r.spec,
              unit:          r.unit,
              qty:           r.quantity,
              unit_price:    r.unit_price,
              supply_amount: r.quantity * r.unit_price,
              tax_amount:    (r.quantity * r.unit_price) * 0.1
            }))
        });

        this.$router.push({ name: 'MOrdersList' });
      } catch (err) {
        console.error('발주서 등록 실패:', err.response?.data || err);
        alert('발주서 등록 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.table th, .table td { vertical-align: middle; }
.card-header { font-weight: bold; }
</style>
