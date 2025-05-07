<!-- src/views/ProcessMain.vue -->
<template>
  <!-- 전체 컨테이너: 상단 조회 영역 + 하단 리스트/상세 영역 -->
  <div class="container-fluid vh-100 d-flex flex-column p-3">
    

    <!-- 2) 하단 메인 영역: 좌측 리스트(3/5), 우측 상세(2/5) -->
    <div class="row flex-grow-1 gx-3">
      <!-- 2-1) 좌측 리스트 영역 -->
      <div class="col-md-7">
        <div class="card h-100">
          <div class="card-header">공정 리스트</div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>공정코드</th>
                  <th>공정명</th>
                  <th>소요시간</th>
                </tr>
              </thead>
              <tbody>
                <!-- 리스트 행 클릭 시 상세 표시 -->
                <tr
                  v-for="proc in processList"
                  :key="proc.process_code"
                  @click="selectRow(proc)"
                  style="cursor:pointer"
                  :class="{ 'table-active': proc.process_code === detail.process_code }"
                >
                  <td>{{ proc.process_code }}</td>
                  <td>{{ proc.process_name }}</td>
                  <td>{{ proc.duration_min }}</td>
                </tr>
                <!-- 데이터 없을 때 안내문 -->
                <tr v-if="processList.length === 0">
                  <td colspan="3" class="text-center py-4">
                    조회된 데이터가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측 상세 영역 -->
      <div class="col-md-5">
        <div class="card h-100">
          <div class="card-header">공정 상세</div>
          <div class="card-body">
            <form @submit.prevent class="d-flex flex-column gap-3">
              <!-- 공정코드 -->
              <div class="mb-2">
                <label for="detailCode" class="form-label">공정코드</label>
                <input
                  id="detailCode"
                  v-model="detail.process_code"
                  type="text"
                  class="form-control"
                />
              </div>
              <!-- 공정명 수정 가능 -->
              <div class="mb-2">
                <label for="detailName" class="form-label">공정명</label>
                <input
                  id="detailName"
                  v-model="detail.process_name"
                  type="text"
                  class="form-control"
                />
              </div>
              <!-- 소요시간 수정 가능 -->
              <div class="mb-2">
                <label for="detailDuration" class="form-label">소요시간(분)</label>
                <input
                  id="detailDuration"
                  v-model.number="detail.duration_min"
                  type="number"
                  class="form-control"
                />
              </div>
              <!-- 액션 버튼 그룹: 등록/수정/삭제/초기화 -->
              <div class="mt-auto d-flex gap-2">
                <button
                  type="button"
                  @click="onDetailReset"
                  class="btn btn-outline-secondary flex-grow-1"
                >
                  초기화
                </button>
                <button
                  type="button"
                  @click="onCreate"
                  class="btn btn-success flex-grow-1"
                >
                  등록
                </button>
                <button
                  type="button"
                  @click="onUpdate"
                  class="btn btn-warning flex-grow-1"
                >
                  수정
                </button>
                <button
                  type="button"
                  @click="onDelete"
                  class="btn btn-danger flex-grow-1"
                >
                  삭제
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ProcessMain.vue (Vue 3 Composition API)
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'ProcessMain',
  setup() {
    // 상태 변수 선언
    const dropdownProcesses = ref([])      // 드롭다운용 전체 공정 목록
    const processList = ref([])           // 실제 조회된 리스트
    const detail = ref({                  // 상세 조회 바인딩 객체
      process_code: '',
      process_name: '',
      duration_min: null
    })

    // 필터 입력값
    const codeSelect = ref('')            // 드롭다운 선택값
    const codeInput = ref('')             // 직접 입력값
    const nameSelect = ref('')
    const nameInput = ref('')

    // 컴포넌트 마운트 시 초기 데이터 로드
    onMounted(async () => {
      await fetchAllProcesses()          // 드롭다운용 전체 목록 가져오기
      processList.value = dropdownProcesses.value  // 초기 리스트 표시
    })

    /**
     * 전체 공정 목록 조회
     * GET /processes (파라미터 없이 호출)
     */
    const fetchAllProcesses = async () => {
      try {
        const { data } = await axios.get('api/processes')
        dropdownProcesses.value = data
      } catch (err) {
        console.error('fetchAllProcesses error', err)
      }
    }

    /**
     * 조회 버튼 클릭 핸들러
     * codeInput 또는 codeSelect 우선 사용
     * nameInput 또는 nameSelect 다음 사용
     */
    const onSearch = async () => {
      const code = codeInput.value || codeSelect.value
      const name = nameInput.value || nameSelect.value
      const params = {}
      if (code) params.code = code
      else if (name) params.name = name

      try {
        const { data } = await axios.get('api/processes', { params })
        processList.value = data
      } catch (err) {
        console.error('onSearch error', err)
      }
      onDetailReset()  // 검색 후 상세 초기화
    }

    /**
     * 필터 초기화 및 리스트/상세 초기화
     */
    const onReset = () => {
      codeSelect.value = ''
      codeInput.value = ''
      nameSelect.value = ''
      nameInput.value = ''
      processList.value = dropdownProcesses.value
      onDetailReset()
    }

    /**
     * 리스트 행 클릭 시 상세 데이터 셋팅
     */
    const selectRow = (proc) => {
      detail.value = { ...proc }
    }

    /**
     * 상세 영역 초기화
     */
    const onDetailReset = () => {
      detail.value = {
        process_code: '',
        process_name: '',
        duration_min: null
      }
    }

    /**
     * 신규 공정 등록
     */
    const onCreate = async () => {
      try {
        await axios.post('/processes', detail.value)
        await fetchAllProcesses()
        onReset()
      } catch (err) {
        console.error('onCreate error', err)
      }
    }

    /**
     * 공정 정보 수정
     */
    const onUpdate = async () => {
      try {
        await axios.put(`/processes/${detail.value.process_code}`, detail.value)
        await fetchAllProcesses()
        onReset()
      } catch (err) {
        console.error('onUpdate error', err)
      }
    }

    /**
     * 공정 정보 삭제
     */
    const onDelete = async () => {
      try {
        await axios.delete(`/processes/${detail.value.process_code}`)
        await fetchAllProcesses()
        onReset()
      } catch (err) {
        console.error('onDelete error', err)
      }
    }

    // 템플릿에서 사용할 변수/함수 반환
    return {
      dropdownProcesses,
      processList,
      detail,
      codeSelect,
      codeInput,
      nameSelect,
      nameInput,
      onSearch,
      onReset,
      selectRow,
      onDetailReset,
      onCreate,
      onUpdate,
      onDelete
    }
  }
}
</script>

<style scoped>
/* 필요 시 추가 스타일 작성 */
</style>
