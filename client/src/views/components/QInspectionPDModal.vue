<!-- 완제품 품질검사 모달입니다. --> <!-- 완제품 품질검사 모달입니다. -->
<!-- 완제품 품질검사 모달입니다. --> <!-- 완제품 품질검사 모달입니다. -->
<!-- 완제품 품질검사 모달입니다. --> <!-- 완제품 품질검사 모달입니다. -->
<!-- 완제품 품질검사 모달입니다. --> <!-- 완제품 품질검사 모달입니다. -->
<!-- 완제품 품질검사 모달입니다. --> <!-- 완제품 품질검사 모달입니다. -->

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
                    <td><input type="text"
                        v-model="isd.test_res"
                        placeholder="수치값 입력"
                        @input="checkQuality(isd)"
                        >
                    </td>
                    <td>{{ isd.unit }}</td>
                    <td>{{ isd.test_stat }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" @click="completeInspection">검사 완료</button>
          <button class="btn btn-secondary" @click="close">닫기</button>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { checkQc } from '@/utils/checkQc';

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
    }
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
          test_stat: '',
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
    // 품질검사 판정함수
    checkQuality(isd){
      // 측정값이 입력되지 않았을 때
      if(!isd.test_res || isd.test_res === ''){
        isd.test_stat = '';
        return;
      }
      try{
        if(isd.test_stand && isd.test_stand.includes('~')){
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
    close() {
      this.inspectionData = [];
      this.$emit('close');
    },
    completeInspection() {
      Swal.fire({
        title: '검사 완료',
        text: '검사를 완료하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitInspection();
        }
      });
      // 검사 완료 로직
      this.$emit('complete', this.orders);
      this.close();
    }
  },
}
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
  z-index: 2000;
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