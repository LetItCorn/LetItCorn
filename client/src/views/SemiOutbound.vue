<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">반제품 자재 출고</h2>
      <div class="row gx-4">
        <!-- 좌측: 외주 대상 생산지시 목록 -->
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-light">
              <strong>외주 대상 지시</strong>
            </div>
            <div class="card-body p-0">
              <table class="table table-sm table-hover mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th style="width:1%"></th>
                    <th>지시번호</th>
                    <th>품목코드</th>
                    <th>수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="inst in instList"
                    :key="inst.inst_no"
                    :class="{ 'table-active': inst.inst_no === selectedInst }"
                  >
                    <td>
                      <input
                        type="radio"
                        name="semiInst"
                        :value="inst.inst_no"
                        v-model="selectedInst"
                      />
                    </td>
                    <td>{{ inst.inst_no }}</td>
                    <td>{{ inst.item_code }}</td>
                    <td>{{ inst.order_qty }}</td>
                  </tr>
                  <tr v-if="!instList.length">
                    <td colspan="4" class="text-muted py-4">
                      외주 대상 지시가 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- 우측: 선택 지시의 BOM 자재 & 출고 -->
        <div class="col-md-8">
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-light d-flex align-items-center">
              <strong class="me-auto">필요 자재</strong>
              <select
                v-model="clientCode"
                class="form-select form-select-sm w-auto"
              >
                <option value="" disabled>외주업체 선택</option>
                <option
                  v-for="c in clients"
                  :key="c.client_code"
                  :value="c.client_code"
                >
                  {{ c.client_name }}
                </option>
              </select>
            </div>
            <div class="card-body p-0">
              <table class="table table-sm table-bordered mb-0 text-center">
                <thead class="table-secondary">
                  <tr>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>단위</th>
                    <th>필요수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in materials" :key="r.mater_code">
                    <td>{{ r.mater_code }}</td>
                    <td class="text-start px-2">{{ r.mater_name }}</td>
                    <td>{{ r.unit }}</td>
                    <td>{{ r.required_qty }}</td>
                  </tr>
                  <tr v-if="!materials.length">
                    <td colspan="4" class="text-muted py-4">
                      지시를 선택하면 자재 목록이 표시됩니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer text-end">
              <button
                class="btn btn-success"
                :disabled="!selectedInst || !materials.length || !clientCode"
                @click="processOutbound"
              >
                출고 실행
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'SemiOutbound',
    data() {
      return {
        instList: [],     // 외주 대상 생산지시
        selectedInst: '', // 선택된 inst_no
        materials: [],    // BOM 자재 목록
        clients: [],      // 외주업체(거래처) 목록
        clientCode: ''    // 선택된 업체 코드
      };
    },
    async created() {
      // 1) 외주 대상 지시 조회
      try {
        const res = await axios.get('/api/semi/outbound/candidates');
        this.instList = res.data;
      } catch (e) {
        console.error('외주 지시 조회 실패', e);
        alert('외주 지시를 가져오는 중 오류가 발생했습니다.');
      }
      // 2) 거래처(외주업체) 목록 조회
      try {
        const res = await axios.get('/api/m_clients');
        this.clients = res.data;
      } catch (e) {
        console.error('거래처 목록 조회 실패', e);
        alert('거래처를 불러오는 중 오류가 발생했습니다.');
      }
    },
    watch: {
      // 지시 선택 시 BOM 자재 조회
      selectedInst(instNo) {
        if (!instNo) {
          this.materials = [];
          return;
        }
        axios
          .get(`/api/semi/outbound/${instNo}/components`)
          .then(res => {
            this.materials = res.data;
          })
          .catch(e => {
            console.error('자재 목록 조회 실패', e);
            this.materials = [];
          });
      }
    },
    methods: {
      async processOutbound() {
        if (!confirm('선택한 자재를 외주로 출고하시겠습니까?')) return;
        try {
          const payload = {
            instNo: this.selectedInst,
            clientCode: this.clientCode,
            records: this.materials.map(r => ({
              mater_code: r.mater_code,
              required_qty: r.required_qty
            }))
          };
          const res = await axios.post('/api/semi/outbound', payload);
          if (res.data.success) {
            alert('외주 자재 출고가 완료되었습니다.');
            // 초기화
            this.selectedInst = '';
            this.clientCode = '';
            this.materials = [];
            // 지시 목록 갱신
            const listRes = await axios.get('/api/semi/outbound/candidates');
            this.instList = listRes.data;
          } else {
            alert('출고 실패: ' + (res.data.error || '알 수 없는 오류'));
          }
        } catch (e) {
          console.error('출고 요청 실패', e);
          alert('출고 처리 중 오류가 발생했습니다.');
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
  