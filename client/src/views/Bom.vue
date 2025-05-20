<template>
  <div class="container-fluid py-3 d-flex flex-column vh-100">
    <!-- 상단 필터 -->
    <div class="row mb-3">
      <div class="col-12">
        
            <BomFilter
              v-model="searchItemCode"
              @search="loadBoms"
              @reset="resetFilter"
            />
         
      </div>
    </div>

    <!-- BOM 리스트 & 구성품 리스트 -->
    <div class="row flex-grow-1" style="height: 70vh;">
      <!-- 좌측: BOM 리스트 -->
      <div class="col-md-6 h-100 d-flex flex-column pe-md-2">
        <div class="card list-card flex-fill">
          <div class="card-header py-2 fs-4"><strong>BOM 리스트</strong></div>
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
      <div class="col-md-6 h-100 d-flex flex-column ps-md-2">
        <div class="card list-card flex-fill">
          <div class="card-header py-2 fs-4"><strong>구성품 리스트</strong></div>
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
import Swal from 'sweetalert2';
import BomFilter from './components/BomFilter.vue';
import BomList from './components/BomList.vue';
import BomComponents from './components/BomComponents.vue';
import BomModal from './components/BomModal.vue';
import BomComponentModal from './components/BomComponentModal.vue';
import useDates from '@/utils/useDates';

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
   async deleteBom() {
  if (!this.selectedBom) {
    return Swal.fire('삭제 오류', '삭제할 BOM을 선택하세요.', 'warning');
  }

  const result = await Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '삭제된 BOM은 복구할 수 없습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`/api/boms/${this.selectedBom.bom_id}`);
    await this.loadBoms();
    Swal.fire('삭제 완료', 'BOM이 삭제되었습니다.', 'success');
  } catch (err) {
    console.error('deleteBom error', err);
    Swal.fire('오류', 'BOM 삭제 중 문제가 발생했습니다.', 'error');
  }
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
    async deleteComp() {
  if (!this.selectedComp) {
    return Swal.fire('삭제 오류', '삭제할 구성품을 선택하세요.', 'warning');
  }

  const result = await Swal.fire({
    title: '구성품 삭제',
    text: '정말 삭제하시겠습니까? 삭제된 구성품은 복구할 수 없습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  });

  if (!result.isConfirmed) return;

  try {
    const bomId = this.selectedBom.bom_id;
    await axios.delete(`/api/boms/${bomId}/components/${this.selectedComp.item_seq_id}`);
    await this.loadComps(bomId);
    this.selectedComp = null;
    Swal.fire('삭제 완료', '구성품이 삭제되었습니다.', 'success');
  } catch (err) {
    console.error('deleteComp error', err);
    Swal.fire('오류', '구성품 삭제 중 오류가 발생했습니다.', 'error');
  }
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
