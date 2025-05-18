<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center justify-content-end">
            <ItemFilter
              v-model:searchType="searchType"
              v-model:searchValue="searchValue"
              @search="loadItems"
              @reset="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단: 리스트(좌) / 상세(우) -->
    <div class="row" style="height: 70vh;">
      <!-- 2-1) 좌측: 품목 리스트 -->
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-body p-0 overflow-auto">
            <ItemList
              :itemList="itemList"
              :selectedCode="selected.item_code"
              @select="selectItem"
            />
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 상세 + 공정 -->
      <div class="col-md-4 d-flex flex-column h-100">
        <div class="card flex-fill mb-2">
          <div class="card-body d-flex flex-column">
            <ItemDetail
              :item="selected"
              :codeList="codeList"
              :unitList="unitList"
              @clear="clearDetail"
              @save="saveItem"
              @delete="deleteItem"
            />
          </div>
        </div>

        <ItemProcessFlow
          :flows="itemProcessFlowsList"
          :processes="processesListArr"
          :selectedSeq="selectedSeq"
          @add="addProcessFlow"
          @delete="deleteProcessItem"
          @save="saveProcessFlows"
          @select="selectProcessItemFunc"
          @change="handleProcessSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ItemFilter from './components/ItemFilter.vue';
import ItemList from './components/ItemList.vue';
import ItemDetail from './components/ItemDetail.vue';
import ItemProcessFlow from './components/ItemProcessFlow.vue';

export default {
  name: 'Item',
  components: {
    ItemFilter,
    ItemList,
    ItemDetail,
    ItemProcessFlow,
  },
  data() {
    return {
      searchType: '',
      searchValue: '',
      itemList: [],
      codeList: [],
      unitList: [],
      itemProcessFlowsList: [],
      processesListArr: [],
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        qty: '',
        spec: ''
      },
      selectedSeq: null,
      selectProcessItem: {}
    };
  },
  async created() {
    await this.loadItems();
    await this.processesList();
    await this.itemCode();
    await this.unitCode();
  },
  methods: {
    async loadItems() {
      const params = {
        code: this.searchType === 'code' ? this.searchValue : '',
        name: this.searchType === 'name' ? this.searchValue : '',
        type: this.searchType === 'type' ? this.searchValue : ''
      };
      try {
        const res = await axios.get('/api/items', { params });
        this.itemList = res.data;
      } catch (err) {
        console.error('loadItems error', err);
        this.itemList = [];
      } finally {
        this.clearDetail();
      }
    },
    async itemCode() {
      try {
        const res = await axios.get('/api/items/itemCode');
        this.codeList = res.data;
      } catch (err) {
        console.error('itemCode error', err);
        this.codeList = [];
      }
    },
    async unitCode() {
      try {
        const res = await axios.get('/api/items/unitCode');
        this.unitList = res.data;
      } catch (err) {
        console.error('unitCode error', err);
        this.unitList = [];
      }
    },
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadItems();
    },
    selectItem(item) {
      this.selected = { ...item };
      this.fetchProcessFlows(item.item_code);
    },
    clearDetail() {
      let nextNum = 1;
      if (this.itemList.length) {
        const nums = this.itemList.map(i =>
          parseInt(i.item_code.replace(/^ITM/, ''), 10) || 0
        );
        nextNum = Math.max(...nums) + 1;
      }
      this.selected = {
        item_code: 'ITM' + String(nextNum).padStart(3, '0'),
        item_name: '',
        item_type: '',
        qty: '',
        spec: ''
      };
      this.itemProcessFlowsList = [];
      this.selectedSeq = null;
      this.selectProcessItem = {};
    },
    async saveItem() {
      try {
        await axios.post('/api/items', this.selected);
        await this.loadItems();
      } catch (err) {
        console.error('saveItem error', err);
      }
    },
    async deleteItem() {
      if (!this.selected.item_code) return;
      const confirmDelete = confirm('정말 삭제하시겠습니까?');
      if (!confirmDelete) return;
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        await this.loadItems();
      } catch (err) {
        console.error('deleteItem error', err);
      }
    },
    async fetchProcessFlows(code) {
      try {
        const res = await axios.get(`/api/items/itemProcessFlowsList/${code}`);
        this.itemProcessFlowsList = res.data;
      } catch (err) {
        console.error('fetchProcessFlows error', err);
        this.itemProcessFlowsList = [];
      }
    },
    addProcessFlow() {
      const nextSeq = this.itemProcessFlowsList.length
        ? Math.max(...this.itemProcessFlowsList.map(f => +f.sequence_order)) + 1
        : 1;
      this.itemProcessFlowsList.push({
        process_header: '',
        process_code: '',
        sequence_order: nextSeq,
        item_code: this.selected.item_code,
        isAdding: true,
        duration_min: ''
      });
    },
    async saveProcessFlows() {
      try {
        const res = await axios.post('/api/items/saveProcessFlows', {
          flows: this.itemProcessFlowsList.map(f => ({
            process_code: f.process_code,
            sequence_order: f.sequence_order,
            item_code: f.item_code
          }))
        });
        const { process_header } = res.data;
        this.itemProcessFlowsList = this.itemProcessFlowsList.map(f => ({
          ...f,
          process_header
        }));
        await this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('saveProcessFlows error', err);
      }
    },
    async deleteProcessItem() {
      if (!this.selectProcessItem.sequence_order) return;
      try {
        await axios.post('/api/items/deleteProcessItem', {
          process_header: this.selectProcessItem.process_header,
          item_code: this.selectProcessItem.item_code,
          sequence_order: this.selectProcessItem.sequence_order
        });
        await this.fetchProcessFlows(this.selected.item_code);
      } catch (err) {
        console.error('deleteProcessItem error', err);
      }
    },
    async processesList() {
      try {
        const res = await axios.get('/api/items/processesList');
        this.processesListArr = res.data;
      } catch (err) {
        console.error('processesList error', err);
        this.processesListArr = [];
      }
    },
    handleProcessSelect(group) {
      // 추후 필요 시 로직 추가 가능
    },
    selectProcessItemFunc(group) {
      this.selectedSeq = group.sequence_order;
      this.selectProcessItem = { ...group };
    }
  }
};
</script>

<style scoped>
.selected {
  background-color: #d0ebff;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
