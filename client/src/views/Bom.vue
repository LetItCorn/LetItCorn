<template>
  <div class="container-fluid py-3 d-flex flex-column vh-100">
    <!-- 상단 필터 -->
    <BomFilter
      v-model="searchItemCode"
      @search="loadBoms"
      @reset="resetFilter"
    />

    <!-- BOM 리스트 & 구성품 리스트 -->
    <div class="row g-3 flex-grow-1" style="height: 70vh;">
      <!-- 좌측: BOM 리스트 -->
      <div class="col-md-6 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2"><strong>BOM 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <BomList
              :bomList="bomList"
              :selectedBom="selectedBom"
              @select="selectBom"
              @add="openBomModal"
              @delete="deleteBom"
            />
          </div>
        </div>
      </div>

      <!-- 우측: 구성품 리스트 -->
      <div class="col-md-6 h-100 d-flex flex-column">
        <div class="card list-card flex-fill">
          <div class="card-header py-2"><strong>구성품 리스트</strong></div>
          <div class="card-body p-0 list-scroll flex-grow-1">
            <BomComponents
              :compList="compList"
              :selectedBom="selectedBom"
              :selectedComp="selectedComp"
              @select="selectComp"
              @openComp="openCompModal"
              @deleteComp="deleteComp"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- BOM 등록 모달 -->
    <BomModal
      v-if="showBomModal"
      :items="bomItemsList"
      :selected="selectedBomItem"
      @select="item => selectedBomItem = item"
      @register="registerBom"
      @close="showBomModal = false"
    />

    <!-- 구성품 등록/수정 모달 -->
    <BomComponentModal
      v-if="showCompModal"
      :form="compForm"
      :materials="materialsList"
      :edit="editComp"
      @submit="saveComp"
      @close="showCompModal = false"
    />
  </div>
</template>

<script>
import axios from 'axios';
import BomFilter from './components/BomFilter.vue';
import BomList from './components/BomList.vue';
import BomComponents from './components/BomComponents.vue';
import BomModal from './components/BomModal.vue';
import BomComponentModal from './components/BomComponentModal.vue';

export default {
  name: 'Bom',
  components: {
    BomFilter,
    BomList,
    BomComponents,
    BomModal,
    BomComponentModal
  },
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
      showCompModal: false
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
      axios.delete(`/api/boms/${this.selectedBom.bom_id}`).then(this.loadBoms);
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
        await axios.put(
          `/api/boms/${bomId}/components/${this.selectedComp.item_seq_id}`,
          this.compForm
        );
      } else {
        const maxSeq = this.compList
          .map(c => parseInt(c.item_seq_id.slice(2)))
          .reduce((m, v) => Math.max(m, v), 0);
        const item_seq_id = `BC${(maxSeq + 1).toString().padStart(3, '0')}`;
        await axios.post(`/api/boms/${bomId}/components`, {
          ...this.compForm,
          item_seq_id
        });
      }
      this.showCompModal = false;
      this.loadComps(bomId);
    },
    deleteComp() {
      if (!this.selectedComp) return;
      const bomId = this.selectedBom.bom_id;
      axios
        .delete(`/api/boms/${bomId}/components/${this.selectedComp.item_seq_id}`)
        .then(() => this.loadComps(bomId));
    }
  }
};
</script>

<style scoped>
.list-card   { display: flex; flex-direction: column; height: 100%; }
.list-scroll { overflow: auto; }

table thead th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.table-hover tbody tr:hover { background-color: #f8f9fa; }
.table-active { background-color: #d0ebff; }
</style>
