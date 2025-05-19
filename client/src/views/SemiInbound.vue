<template>
    <div class="container py-4">
      <h2 class="text-center mb-4">반제품 품질검사·입고</h2>
  
      <!-- 1) 외주 출고 완료된 반제품 리스트 -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-light">
          <strong>외주 출고 내역</strong>
        </div>
        <div class="card-body p-0">
          <table class="table table-sm table-hover mb-0 text-center">
            <thead class="table-secondary">
              <tr>
                <th style="width:1%"></th>
                <th>지시번호</th>
                <th>반제품 코드</th>
                <th>수량</th>
                <th>출고일</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in outboundList"
                :key="item.instNo"
                :class="{ 'table-active': item.instNo === selectedInst }"
              >
                <td>
                  <input
                    type="radio"
                    name="semiInbound"
                    :value="item.instNo"
                    v-model="selectedInst"
                  />
                </td>
                <td>{{ item.instNo }}</td>
                <td>{{ item.itemCode }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.date }}</td>
              </tr>
              <tr v-if="!outboundList.length">
                <td colspan="5" class="text-muted py-4">
                  외주 출고된 반제품이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 2) 검사 & 입고 버튼 -->
      <div class="text-end mb-4">
        <button
          class="btn btn-primary"
          :disabled="!selectedInst"
          @click="showQcModal = true"
        >
          품질검사 &amp; 입고
        </button>
      </div>
  
      <!-- 3) QC 모달 (재활용) -->
      <QualityInspectionModal
        :visible="showQcModal"
        :orders="qcModalOrders"
        @close="showQcModal = false"
        @inspect="handleQcAndInbound"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import QualityInspectionModal from '@/views/components/QualityInspectionModal.vue';
  
  export default {
    name: 'SemiInbound',
    components: { QualityInspectionModal },
    data() {
      return {
        outboundList: [],    // 외주 출고 완료된 반제품(지시) 목록
        selectedInst: '',    // 선택된 instNo
        showQcModal: false,  // QC 모달 표시 여부
        qcModalOrders: []    // QC 모달에 전달할 orders 배열
      };
    },
    async created() {
      try {
        // m_outbound 에 넣었던 semi 출고 기록을 가져옵니다.
        // 여기서는 전체 m_outbound를 가져와 instNo 기준으로 그룹화합니다.
        const res = await axios.get('/api/m_outbound');
        const raw = res.data;
        // instNo는 mout_id 앞부분(instNo-...)로 파싱
        const map = new Map();
        raw.forEach(r => {
          const instNo = r.mout_id.split('-')[0];
          if (!map.has(instNo)) {
            // 첫 번째 항목의 itemCode, qty, date 그대로 사용
            map.set(instNo, {
              instNo,
              itemCode: r.mater_code,
              qty: r.mout_qty,
              date: r.mout_date
            });
          }
        });
        this.outboundList = Array.from(map.values());
      } catch (e) {
        console.error('외주 출고 목록 조회 실패', e);
        alert('외주 출고 내역을 불러오는 중 오류가 발생했습니다.');
      }
    },
    watch: {
      // 선택된 instNo가 바뀌면 QC모달에 줄 orders 배열 준비
      selectedInst(instNo) {
        if (!instNo) {
          this.qcModalOrders = [];
        } else {
          // QC 대상은 instNo 하나이므로 orders 배열에 단일 객체 삽입
          this.qcModalOrders = [{ test_target: instNo }];
          // QualityInspectionModal은 { moder_id, mater_code } 형태를 기대했는데
          // 여기서는 instNo만 필요하니 임의 필드로 전달합니다.
          // 컴포넌트 내부에서 this.orders를 활용해 r.test_target을 읽도록 약속
        }
      }
    },
    methods: {
      /**
       * QC 완료 후 입고 처리
       * payload: [{ qc_no, moder_id (instNo), mater_code, qc_date, qc_result, inspector, ... }, ...]
       */
      async handleQcAndInbound(payload) {
        this.showQcModal = false;
  
        try {
          // 1) QC 결과 저장
          // semi_qc API는 { inst_no, qc_result } 배열을 기대
          const qcResults = payload.map(r => ({
            inst_no: r.moder_id,
            qc_result: r.qc_result
          }));
          await axios.post('/api/semi/qc', qcResults);
  
          // 2) 입고 처리
          const inst = this.outboundList.find(o => o.instNo === this.selectedInst);
          await axios.post('/api/semi/inbound', {
            instNo: inst.instNo,
            materCode: inst.itemCode,
            qty: inst.qty
          });
  
          alert('품질검사 및 입고가 완료되었습니다.');
          // 처리된 항목은 목록에서 제거
          this.outboundList = this.outboundList.filter(o => o.instNo !== inst.instNo);
          this.selectedInst = '';
        } catch (e) {
          console.error('QC 또는 입고 처리 중 오류', e);
          alert('품질검사 또는 입고 처리 중 오류가 발생했습니다.');
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
  