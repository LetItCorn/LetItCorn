<!-- src/views/Bom.vue -->
<template>
  <div class="container-fluid p-0" style="height:100vh;">
    <!-- 1) 상단 헤더 (높이 10%) -->
    <div class="row m-0" style="height:10vh;">
      <div class="col-12 h-100">
        <div class="card h-100 position-relative overflow-visible">
          <div class="card-body p-0">
            <div
              class="position-absolute top-0 end-0 d-flex align-items-center"
              style="margin:0.5rem; z-index:1000;"
            >
              완제품코드
              <input
                v-model="searchItemCode"
                placeholder="코드입력"
                class="form-control form-control-sm me-1"
                style="width:150px; height:32px;"
              />
              <button
                @click="loadBoms"
                class="btn btn-sm btn-outline-primary me-1"
                style="width:100px; height:32px;"
              >
                조회
              </button>
              <button
                @click="resetFilter"
                class="btn btn-sm btn-outline-secondary"
                style="width:100px; height:32px;"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단 (높이 90%) 좌/우 50% -->
    <div class="row g-3 m-0" style="height:90vh;">
      <!-- 2-1) 왼쪽: BOM 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr>
                    <th>BOM ID</th>
                    <th>품목코드</th>
                    <th>품목명</th>
                    <th>등록일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="bom in bomList"
                    :key="bom.bom_id"
                    @click="selectBom(bom)"
                    :class="{ 'table-active': bom.bom_id === selectedBom?.bom_id }"
                    style="cursor:pointer;"
                  >
                    <td>{{ bom.bom_id }}</td>
                    <td>{{ bom.item_code }}</td>
                    <td>{{ bom.item_name }}</td>
                    <td>{{ bom.registered_date }}</td>
                  </tr>
                  <tr v-if="bomList.length === 0">
                    <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-2 d-flex justify-content-end">
              <button
                @click="openBomModal"
                class="btn btn-sm btn-warning me-1"
                style="width:100px; height:32px;"
              >
                등록
              </button>
              <button
                @click="deleteBom"
                class="btn btn-sm btn-danger"
                style="width:100px; height:32px;"
                :disabled="!selectedBom"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2-2) 오른쪽: 구성품 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0">
                <thead class="thead-light sticky-top">
                  <tr>
                    <th>순번</th>
                    <th>자재코드</th>
                    <th>자재명</th>
                    <th>규격</th>
                    <th>단위</th>
                    <th>수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="comp in compList"
                    :key="comp.item_seq_id"
                    @click="selectComp(comp)"
                    :class="{ 'table-active': comp.item_seq_id === selectedComp?.item_seq_id }"
                    style="cursor:pointer;"
                  >
                    <td>{{ comp.item_seq_id }}</td>
                    <td>{{ comp.mater_code }}</td>
                    <td>{{ comp.mater_name }}</td>
                    <td>{{ comp.spec }}</td>
                    <td>{{ comp.unit_code }}</td>
                    <td>{{ comp.quantity }}</td>
                  </tr>
                  <tr v-if="compList.length === 0">
                    <td colspan="6" class="text-center py-4">BOM을 선택하세요.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 수정 버튼 제거 후, 등록/수정을 하나의 버튼으로 합침 -->
            <div class="mt-2 d-flex justify-content-end">
              <button
                @click="openCompModal(selectedComp)"
                class="btn btn-sm btn-warning me-1"
                style="width:100px; height:32px;"
                :disabled="!selectedBom"
              >
                {{ selectedComp ? '수정' : '등록' }}
              </button>
              <button
                @click="deleteComp"
                class="btn btn-sm btn-danger"
                style="width:100px; height:32px;"
                :disabled="!selectedComp"
              >
                삭제
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- BOM 등록 Modal -->
    <div v-if="showBomModal" class="modal-backdrop">
      <div class="modal-box">
        <h5>BOM 등록</h5>
        <table class="table table-hover table-sm mb-2">
          <thead class="thead-light sticky-top">
            <tr>
              <th>품목코드</th>
              <th>품목명</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in bomItemsList"
              :key="item.item_code"
              @click="selectedBomItem = item"
              :class="{ 'table-active': item.item_code === selectedBomItem?.item_code }"
              style="cursor:pointer;"
            >
              <td>{{ item.item_code }}</td>
              <td>{{ item.item_name }}</td>
            </tr>
            <tr v-if="bomItemsList.length === 0">
              <td colspan="2" class="text-center py-4">완제품이 없습니다.</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-sm btn-primary me-2"
            @click="registerBom"
            :disabled="!selectedBomItem"
          >
            등록
          </button>
          <button class="btn btn-sm btn-secondary" @click="showBomModal = false">
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 구성품 등록/수정 Modal -->
    <div v-if="showCompModal" class="modal-backdrop">
      <div class="modal-box">
        <h5>구성품 {{ editComp ? '수정' : '등록' }}</h5>
        <div class="mb-2">
          <label>자재선택</label>
          <select v-model="compForm.mater_code" class="form-select form-select-sm">
            <option value="">-- 선택 --</option>
            <option v-for="m in materialsList" :key="m.mater_code" :value="m.mater_code">
              {{ m.mater_code }} | {{ m.mater_name }}
            </option>
          </select>
        </div>
        <div class="mb-2">
          <label>수량</label>
          <input v-model.number="compForm.quantity" type="number" class="form-control form-control-sm" />
        </div>
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-sm btn-primary me-2"
            @click="saveComp"
            :disabled="!compForm.mater_code || !compForm.quantity"
          >
            {{ editComp ? '수정' : '등록' }}
          </button>
          <button class="btn btn-sm btn-secondary" @click="showCompModal = false">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Bom',
  data() {
    return {
      searchItemCode: '',
      bomList: [],
      compList: [],
      bomItemsList: [],   // 완제품 목록
      materialsList: [],  // 자재 목록
      selectedBom: null,
      selectedComp: null,
      selectedBomItem: null,
      editComp: false,
      compForm: { mater_code: '', quantity: 1 },
      showBomModal: false,
      showCompModal: false,
    };
  },
  created() {
    this.loadBoms();
    this.loadMaterials();
  },
  methods: {
    // BOM 목록 조회 (완제품만)
    async loadBoms() {
      const params = { itemCode: this.searchItemCode.trim() };
      const res = await axios.get('/api/boms', { params });
      this.bomList = res.data;
      this.compList = [];
      this.selectedBom = this.selectedComp = null;
    },
    resetFilter() {
      this.searchItemCode = '';
      this.loadBoms();
    },
    selectBom(bom) {
      this.selectedBom = bom;
      this.loadComps(bom.bom_id);
    },
    // 구성품 목록 조회
    async loadComps(bomId) {
      const res = await axios.get(`/api/boms/${bomId}/components`);
      this.compList = res.data;
      this.selectedComp = null;
    },
    selectComp(comp) {
      this.selectedComp = comp;
    },
    // 완제품 등록 모달 열기
    async openBomModal() {
      const res = await axios.get('/api/boms/bomitemsList');
      this.bomItemsList = res.data;
      this.selectedBomItem = null;
      this.showBomModal = true;
    },
    // BOM 등록
    async registerBom() {
      await axios.post('/api/boms', {
        item_code: this.selectedBomItem.item_code,
        item_name: this.selectedBomItem.item_name
      });
      this.showBomModal = false;
      this.loadBoms();
    },
    deleteBom() {
      axios.delete(`/api/boms/${this.selectedBom.bom_id}`)
        .then(this.loadBoms);
    },
    // 자재 목록 로드
    async loadMaterials() {
      const res = await axios.get('/api/materials');
      this.materialsList = res.data;
    },
    // 구성품 Modal 열기 (등록/수정 공통)
    openCompModal(comp = null) {
      this.editComp = !!comp;
      this.compForm = comp
        ? { mater_code: comp.mater_code, quantity: comp.quantity }
        : { mater_code: '', quantity: 1 };
      this.showCompModal = true;
    },
    // 구성품 등록/수정
    async saveComp() {
      if (this.editComp) {
        await axios.put(
          `/api/boms/${this.selectedBom.bom_id}/components/${this.selectedComp.item_seq_id}`,
          this.compForm
        );
      } else {
        await axios.post(
          `/api/boms/${this.selectedBom.bom_id}/components`,
          this.compForm
        );
      }
      this.showCompModal = false;
      this.loadComps(this.selectedBom.bom_id);
    },
    deleteComp() {
      axios.delete(
        `/api/boms/${this.selectedBom.bom_id}/components/${this.selectedComp.item_seq_id}`
      ).then(() => this.loadComps(this.selectedBom.bom_id));
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}
.modal-box {
  background: #fff; padding: 1.5rem; border-radius: 8px;
  width: 600px; max-width: 90vw;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
.sticky-top th {
  position: sticky; top: 0; background: white; z-index: 10;
}
</style>
