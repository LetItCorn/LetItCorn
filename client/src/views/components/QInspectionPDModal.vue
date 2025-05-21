<template>
  <!-- 검사 모달 -->
  <div v-if="visible" class="modal" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3>품질검사</h3>
          </div>
        </div>
        <div class="modal-body">
          <div class="inspection-table">
            <table class="table table-bordered text-center mb-0">
              <thead>
                <tr>
                  <th>검사번호</th>
                  <th>검사항목</th>
                  <th>기준값</th>
                  <th>측정값</th>
                  <th>단위</th>
                  <th>판정</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="isd in inspectionData" :key="isd.test_no">
                  <td>{{ isd.test_no }}</td>
                  <td>{{ isd.test_feild }}</td>
                  <td>{{ isd.test_stand }}</td>
                  <td>
                    <input
                      type="text"
                      v-model="isd.test_res"
                      placeholder="수치값 입력"
                      @input="checkQuality(isd)"
                    />
                  </td>
                  <td>{{ isd.unit_name }}</td>
                  <td>{{ isd.test_stat }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" @click="confirmCompleteInspection">
            검사 완료
          </button>
          <button class="btn btn-secondary" @click="close">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { checkQc } from '@/utils/checkQc';
import { useUserStore } from '@/store/user';

export default {
  name: 'QInspectionPDModal',
  props: {
    visible: Boolean,
    orders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inspectionData: [],
      isLoading: false,
      store: useUserStore(),
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.orders.length > 0) {
        this.fetchInspectionList();
      }
    }
  },
  methods: {
    // 검사항목 리스트
    async fetchInspectionList() {
      try {
        const response = await axios.get('/api/qfproduct/inspection');
        this.inspectionData = response.data.map(item => ({
          ...item,
          test_res: '',
          test_stat: ''
        }));
      } catch (error) {
        console.error('검사항목 리스트를 가져오는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '데이터 로딩 실패',
          text: '검사항목 리스트를 불러오는데 실패했어요.'
        });
      }
    },
    checkinputresult(){
      const EmptyInput = this.inspectionData.some(item => !item.test_res);

      if(EmptyInput){
        Swal.fire({
          icon: 'error',
          title: '측정값 입력 확인 필요',
          text: '측정값 입력이 빠진것 같아요.'
        });
        return false;
      }

      return true;
    },
    // 품질검사 판정함수
    checkQuality(isd) {
      if (!isd.test_res) {
        isd.test_stat = '';
        return;
      }
      try {
        if (isd.test_stand && isd.test_stand.includes('~')) {
          const result = checkQc(isd.test_res, isd.test_stand);

          isd.test_stat = result === 'pass' ? '적합' : '부적합';

        }
      } catch (error) {
        console.error('검사 기준값을 확인하는 중 오류 발생:', error);
        Swal.fire({
          icon: 'error',
          title: '검사 기준값 오류',
          text: '검사 기준값을 확인해주세요.'
        });
      }
    },
    async confirmCompleteInspection() {
      if(!this.checkinputresult()){
        return;
      }

      const hasFailure = this.inspectionData.some(item => item.test_stat === '부적합');

      if(hasFailure){
        Swal.fire({
          icon: 'error',
          title: '품질 검사 부적합',
          text: '품질 검사 재검이 필요합니다.'
        });
        return;
      }
      const result = await Swal.fire({
        title: '검사 완료',
        text: '판정결과 적합입니다. 검사 완료 하시겠어요?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      });
      if (result.isConfirmed) {
        try {
          await this.submitInspection();
          await Swal.fire({
            title: '완료',
            text: '검사가 성공적으로 완료되었어요.',
            icon: 'success'
          });
          this.$emit('complete', this.orders);
          this.close();
        } catch (error) {
          console.error('검사 저장 중 오류 발생:', error);
          Swal.fire({
            icon: 'error',
            title: '저장 실패',
            text: '검사 결과 저장에 실패했습니다.'
          });
        }
      }
    },
    async submitInspection() {
      try {
        // 검사 데이터 준비 - orders의 첫 번째 항목을 기준으로 생성
        const order = this.orders[0]; // 첫 번째 주문 정보만 사용

        const empName = this.store.empName || 'unknown';  
        
        const payload = this.inspectionData.map(item => ({
          test_no: item.test_no,
          inst_no: order.inst_no,
          lot_cnt: order.lot_cnt,
          qc_date: new Date().toISOString().slice(0, 10),
          qc_result: item.test_stat === '적합' ? 'pass' : 'fail',
          inspector: empName,
          test_res: item.test_res,
          process_code: order.process_code || 'PC999',
          unit_name: item.unit_name || ''
        }));

        console.log('검사 확인자 : ', empName);
        
        // API 호출
        const response = await axios.post('/api/qfproduct/inspection', payload);
        
        return response.data;
      } catch (error) {
        console.error('검사 저장 중 오류 발생:', error);
        throw error;
      }
    },
    close() {
      this.inspectionData = [];
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-dialog {
  width: 80vw;
  max-width: 900px;
  margin: 0;
}
.modal-content {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 0.3rem;
  overflow: hidden;
}
.modal-header,
.modal-footer {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
}
.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
}
.table th,
.table td {
  vertical-align: middle;
  padding: 0.5rem 0.75rem;
}
</style>
