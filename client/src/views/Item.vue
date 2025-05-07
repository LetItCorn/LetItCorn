<style scoped>
.selected {
  background-color: #d0ebff; /* 연한 하늘색 */
}
</style>
<template>
  <div class="container-fluid py-3">
    <!-- 1) 상단 조회·필터 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <select
                v-model="searchType"
                class="form-control form-control-sm me-2 border"
                style="width:120px"
              >
                <option value="">[선택 없음]</option>
                <option value="code">품목코드</option>
                <option value="name">품목명</option>
                <option value="type">구분</option>
              </select>

              <input
                v-model="searchValue"
                :placeholder="filterPlaceholder"
                class="form-control form-control-sm me-2 border"
                style="width:200px"
              />

              <button @click="loadItems" class="btn btn-sm btn-primary me-2" style="width:80px;">
                조회
              </button>
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px;">
                초기화
              </button>
            </div>
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
            <table class="table table-sm table-hover mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>품목코드</th>
                  <th>품목명</th>
                  <th>구분</th>
                  <th>단위</th>
                  <th>규격</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in itemList"
                  :key="item.item_code"
                  @click="selectItem(item)"
                  :class="{ 'table-active': item.item_code === selected.item_code }"
                  style="cursor:pointer"
                >                  
                  <td>{{ item.item_code }}</td>
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.item_type }}</td>
                  <td>{{ item.unit_code }}</td>
                  <td>{{ item.spec }}</td>
                </tr>
                <tr v-if="itemList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-2) 우측: 상세 + 공정 -->
      <div class="col-md-4 d-flex flex-column h-100">
        <!-- 품목 상세 카드 -->
        <div class="card flex-fill mb-2">
          <div class="card-body d-flex flex-column">
            <div class="form-row flex-fill">
              <div class="form-group col-6">
                <label>품목코드</label>
                <input v-model="selected.item_code" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-6">
                <label>품목명</label>
                <input v-model="selected.item_name" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-6">
                <label>구분</label>
                <input v-model="selected.item_type" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-6">
                <label>단위</label>
                <input v-model="selected.unit_code" class="form-control form-control-sm" />
              </div>
              <div class="form-group col-12">
                <label>규격</label>
                <input v-model="selected.spec" class="form-control form-control-sm" />
              </div>
            </div>
            <div class="mt-auto d-flex justify-content-end">
              <button @click="clearDetail" class="btn btn-sm btn-outline-secondary mr-2" style="width:80px;">
                초기화
              </button>
              <button @click="createItem" class="btn btn-sm btn-warning mr-2" style="width:80px;">
                등록
              </button>
              <button @click="updateItem" class="btn btn-sm btn-success mr-2" style="width:80px;">
                수정
              </button>
              <button @click="deleteItem" class="btn btn-sm btn-danger" style="width:80px;">
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 공정 흐름 카드 -->
        <div class="card" style="height: 45%;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>공정 흐름</span>
            <div>
              <button @click="addProcessFlow">추가</button>
              <button @click="deleteProcessItem">삭제</button>
              <button @click="saveProcessFlows">저장</button>
            </div>
          </div>
          <div class="card-body p-3 overflow-auto">
            <table class="table table-sm table-bordered text-center mb-0">
              <thead class="thead-light">
                <tr>
                  <th style="width: 10%;">순서</th>
                  <th style="width: 60%;">공정 선택</th>
                  <th style="width: 30%;">소요시간</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="itemProcessFlowsList.length > 0">
                  <tr v-for="group in itemProcessFlowsList" :key="group.sequence_order"  :class="{ selected: selectedSeq === group.sequence_order }" @click="selectProcessItemFunc(group)"  >
                    <!-- ✅ group에 item_code가 있으면 기존 행 -->
                    <template v-if="group?.isAdding != true">
                      <td  >{{ group.sequence_order }}</td>
                      <td>
                        <div>
                          {{ group.process_name }}
                        </div>
                      </td>
                      <td>
                        <div>                      
                          <input
                            v-model="group.duration"
                            class="form-control form-control-sm text-center mb-1"
                            :placeholder="`예: ${group.duration_min}분`"
                          />
                        </div>
                      </td>
                    </template>

                    <!-- ❌ item_code 없으면 빈 행 보여주기 -->
                    <template v-else>
                      <td>{{ group.sequence_order }}</td>
                      <td >                      
                          <select  v-model="group.process_header"  @change="handleProcessSelect(group)">
                            <option value="">-- 선택하세요 --</option>
                            <option v-for="item in processesListArr" :key="item.process_header" :value="item.process_header">
                              {{ item.process_name }}
                            </option>
                          </select>        
                      </td>
                      <td>
                         
                      </td>
                    </template>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="2" class="text-center">등록된 공정이 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios';

export default { // 외부에서 사용할 수 있도록 내보냄.
  name: 'Item',
  data() {
    return {
      searchType: '',
      searchValue: '',
      itemList: [],
      itemProcessFlowsList: [],
      processesListArr : [],
      selected: {
        item_code: '',
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: ''
      },
      selectedSeq: null, 
      selectProcessItem:{},
    };
  },
  computed: { // 정의된 데이터 값 변경 감시,  변경될 떄마다 정의된 함수 실행
    filterPlaceholder() {
      switch (this.searchType) {
        case 'code': return '품목코드';
        case 'name': return '품목명';
        case 'type': return '구분';
        default:     return '';
      }
    }
  },
  created() { // 컴포넌트가 처음 화면에 등장할 때 함수를 자동으로 호출하겠단 의미
    this.loadItems();
    this.processesList();
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
      } catch {
        this.itemList = [];
      }
    },   
    resetFilter() {
      this.searchType = '';
      this.searchValue = '';
      this.loadItems();
    },
    async selectItem(item) {
      this.selected = { ...item };
      
      //let response = await axios.put(`/items/itemProcessFlowsList/${this.selected.item_code}`,'');
      //await axios.put(`/api/items/${this.selected.item_code}`, this.selected);
      //this.loadItems();
      
       try {
        const response = await axios.get(`/api/items/itemProcessFlowsList/${this.selected.item_code}`,this.selected);
        this.itemProcessFlowsList = response.data;        
      } catch {
        this.itemProcessFlowsList = [];
      }
      
    },
    clearDetail() {
      this.selected = {
        item_code: '',
        item_name: '',
        item_type: '',
        unit_code: '',
        spec: ''
      };
    },
    async createItem() {
      try {
        await axios.post('/api/items', this.selected);
        this.loadItems();
        this.clearDetail();
      } catch {}
    },
    async updateItem() {
      try {
        await axios.put(`/api/items/${this.selected.item_code}`, this.selected);
        this.loadItems();
      } catch {}
    },
    async deleteItem() {
      if (!this.selected.item_code) return;
      try {
        await axios.delete(`/api/items/${this.selected.item_code}`);
        this.loadItems();
        this.clearDetail();
      } catch {}
    },
    addProcessFlow(){
      // 현재 최대 sequence_order 기준으로 설정
        const nextSeq =
          this.itemProcessFlowsList.length > 0
            ? Math.max(...this.itemProcessFlowsList.map(f => Number(f.sequence_order))) + 1
            : 1;

        this.itemProcessFlowsList.push({
          sequence_order: nextSeq,
          process_code: '',
          process_header: '',
          item_code : this.selected.item_code,
          isAdding : true
        });        
    },
    async saveProcessFlows() {
       try {
          console.log(this.itemProcessFlowsList);
          const res = await axios.post('/api/saveProcessFlows', {
            flows: this.itemProcessFlowsList
          });
          alert('저장 완료!');
          try {
            const response = await axios.get(`/api/items/itemProcessFlowsList/${this.selected.item_code}`,this.selected);
            this.itemProcessFlowsList = response.data;        
          } catch {
            this.itemProcessFlowsList = [];
          }          
        } catch (err) {
          console.error('저장 실패:', err);
          alert('저장 중 오류 발생');
        }
    },
    async processesList(){
      try{       
        const res = await axios.get(`/api/items/processesList` );                
        this.processesListArr = res.data;
      }catch{
        this.processesListArr = [];
      }
    },handleProcessSelect(group){
      console.log(group);
      console.log(this.itemProcessFlowsList);
      
    },selectProcessItemFunc(group){
       this.selectedSeq = group.sequence_order;
       this.selectProcessItem = group;
       console.log(this.selectedSeq);
       console.log( this.selectProcessItem );
    },async deleteProcessItem(){
      try{
        
        console.log( this.selectProcessItem);
        const res = await axios.post(`/api/items/deleteProcessItem` , this.selectProcessItem );   
         const response = await axios.get(`/api/items/itemProcessFlowsList/${this.selected.item_code}`,this.selected);
        this.itemProcessFlowsList = response.data;                     
        
      }catch{

      }
    }     
  }
};
</script>

<style scoped>
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
}
</style>
