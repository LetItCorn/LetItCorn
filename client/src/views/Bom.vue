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
              <label class="me-2 mb-0">완제품코드</label>
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
          <label class="form-label mb-1">자재선택</label>
          <select v-model="compForm.mater_code" class="form-select form-select-sm">
            <option value="">-- 선택 --</option>
            <option v-for="m in materialsList" :key="m.mater_code" :value="m.mater_code">
              {{ m.mater_code }} | {{ m.mater_name }}
            </option>
          </select>
        </div>
        <div class="mb-2">
          <label class="form-label mb-1">수량</label>
          <input
            v-model.number="compForm.quantity"
            type="number"
            class="form-control form-control-sm"
            min="1"
          />
        </div>
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-sm btn-primary me-2"
            @click="saveComp"
            :disabled="!compForm.mater_code || compForm.quantity < 1"
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
      bomItemsList: [],
      materialsList: [],
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
    async loadBoms() {
      const { data } = await axios.get('/api/boms', {
        params: { itemCode: this.searchItemCode.trim() }
      });
      this.bomList = data;
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
    async loadComps(bomId) {
      const { data } = await axios.get(`/api/boms/${bomId}/components`);
      this.compList = data;
      this.selectedComp = null;
    },
    selectComp(comp) {
      this.selectedComp = comp;
    },
    async openBomModal() {
      const { data } = await axios.get('/api/boms/bomitemsList');
      this.bomItemsList = data;
      this.selectedBomItem = null;
      this.showBomModal = true;
    },
    async registerBom() {
      await axios.post('/api/boms', {
        item_code: this.selectedBomItem.item_code,
        item_name: this.selectedBomItem.item_name
      });
      this.showBomModal = false;
      this.loadBoms();
    },
    deleteBom() {
      if (!this.selectedBom) return;
      axios.delete(`/api/boms/${this.selectedBom.bom_id}`)
        .then(() => this.loadBoms());
    },
    async loadMaterials() {
      const { data } = await axios.get('/api/materials');
      this.materialsList = data;
    },
    openCompModal(comp = null) {
      this.editComp = !!comp;
      this.compForm = comp
        ? { mater_code: comp.mater_code, quantity: comp.quantity }
        : { mater_code: '', quantity: 1 };
      this.showCompModal = true;
    },
    async saveComp() {
      const bomId = this.selectedBom.bom_id;
      if (this.editComp) {
        // 수정
        await axios.put(
          `/api/boms/${bomId}/components/${this.selectedComp.item_seq_id}`,
          this.compForm
        );
      } else {
        // 신규: item_seq_id 생성 (BC + 3자리 순번)
        const maxSeq = this.compList
          .map(c => parseInt(c.item_seq_id.slice(2)))
          .reduce((max, cur) => Math.max(max, cur), 0);
        const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
        const item_seq_id = `BC${nextSeq}`;
        await axios.post(
          `/api/boms/${bomId}/components`,
          { ...this.compForm, item_seq_id }
        );
      }
      this.showCompModal = false;
      this.loadComps(bomId);
    },
    deleteComp() {
      if (!this.selectedComp) return;
      const bomId = this.selectedBom.bom_id;
      axios.delete(
        `/api/boms/${bomId}/components/${this.selectedComp.item_seq_id}`
      ).then(() => this.loadComps(bomId));
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
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
