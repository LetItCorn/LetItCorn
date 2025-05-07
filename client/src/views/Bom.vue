<style scoped>
  .modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-box {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 800px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

</style>
<!-- src/views/Bom.vue -->
<template>
  <div class="container-fluid p-0" style="height:100vh;">

    <!-- 1) 상단 헤더 (높이 10%) -->
    <div class="row m-0" style="height:10vh;">
      <div class="col-12 h-100">
        <div class="card h-100 position-relative overflow-visible">
          <div class="card-body p-0">
            <!-- 오른쪽 상단에 고정될 검색폼 -->
            <div
              class="position-absolute top-0 end-0 d-flex align-items-center"
              style="margin:0.5rem; z-index:1000;"
            >
              완제품코드<input
                v-model="searchItemCode"
                placeholder="코드입력"
                class="form-control form-control-sm me-1"
                style="width:150px; height:32px;"
              />
              <button
                @click="loadBoms"
                class="btn btn-sm btn-outline-primary me-1"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                조회
              </button>
              <button
                @click="resetFilter"
                class="btn btn-sm btn-outline-secondary"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 하단 (높이 90%) 좌/우 50% with gutter -->
    <div class="row g-3 m-0" style="height:90vh;">
      <!-- 2-1) 왼쪽: BOM 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <!-- BOM 테이블 -->
            <div class="table-responsive flex-fill overflow-auto">
              <table class="table table-hover table-sm mb-0" >
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
                    :class="{ 'table-active': bom.bom_id===selectedBom?.bom_id }"
                    style="cursor:pointer"
                  >
                    <td>{{bom.bom_id}}</td>
                    <td>{{bom.item_code}}</td>
                    <td>{{bom.item_name}}</td>
                    <td>{{bom.registered_date}}</td>
                  </tr>
                  <tr v-if="bomList.length===0">
                    <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 버튼 그룹 (테이블 아래, 오른쪽 정렬) -->
            <div class="mt-2 d-flex justify-content-end">              
              <button
                @click="createBom"
                class="btn btn-sm btn-warning me-1"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                등록
              </button>              
              <button
                @click="deleteBom"
                class="btn btn-sm btn-danger"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>


      <!-- 2-2) 오른쪽: BOM 구성품 리스트 + CRUD -->
      <div class="col-md-6 h-100">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-2">
            <!-- BOM 구성품 테이블 -->
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
                    :class="{ 'table-active': comp.item_seq_id===selectedComp?.item_seq_id }"
                    style="cursor:pointer"
                  >
                    <td>{{comp.item_seq_id}}</td>
                    <td>{{comp.mater_code}}</td>
                    <td>{{comp.mater_name}}</td>
                    <td>{{comp.spec}}</td>
                    <td>{{comp.unit_code}}</td>
                    <td>{{comp.quantity}}</td>
                  </tr>
                  <tr v-if="compList.length===0">
                    <td colspan="6" class="text-center py-4">BOM을 선택하세요.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 버튼 그룹 (테이블 아래) -->
            <div class="mt-2 d-flex justify-content-end">              
              <button
                @click="createBom"
                class="btn btn-sm btn-warning me-1"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                등록
              </button>
              <button
                @click="updateBom"
                class="btn btn-sm btn-success me-1"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                수정
              </button>
              <button
                @click="deleteBom"
                class="btn btn-sm btn-danger"
                style="width:150px; height:32px; font-size:0.875rem;"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
  <!-- Modal -->
<div v-if="showBomModal" class="modal-backdrop">
  <div class="modal-box">
    <h5>BOM 등록</h5>
    
    <table class="table table-hover table-sm mb-0" >
                <thead class="thead-light sticky-top">
                  <tr>                    
                    <th>품목코드</th>
                    <th>품목명</th>
                    <th>단위코드</th>
                    <th>규격</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in bomitemsList"
                    :key="item.item_code"
                    @click="selectItemBom(item)"
                    :class="{ 'table-active': item.item_code===selectedItemBom?.item_code }"
                    style="cursor:pointer"
                  >
                    <td>{{item.item_code}}</td>
                    <td>{{item.item_name}}</td>
                    <td>{{item.unit_code}}</td>
                    <td>{{item.spec}}</td>
                  </tr>
                  <tr v-if="bomitemsList.length===0">
                    <td colspan="4" class="text-center py-4">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            <button class="btn btn-sm btn-secondary" @click="registeritemBomModal">등록</button>
            <button class="btn btn-sm btn-secondary" @click="showBomModal = false">취소</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Bom',
  data() {
    return {
      searchItemCode: '',
      bomList: [],
      compList: [],
      selectedBom: null,
      selectedComp: null,
      showBomModal: false,
      bomitemsList:[],
      selectedItemBom:null,
    }
  },
  created() {
    this.loadBoms()
  },
  methods: {
    async loadBoms() {
      const params = { itemCode: this.searchItemCode.trim() }
      const res = await axios.get('/api/boms', { params }).catch(()=>({data:[]}))
      this.bomList = res.data
      this.compList = []
      this.selectedBom = this.selectedComp = null
    },
    resetFilter() {
      this.searchItemCode = ''
      this.loadBoms()
    },
    selectBom(bom) {
      this.selectedBom = bom
      this.loadComps(bom.bom_id)
    },
    async loadComps(bomId) {
      const res = await axios.get(`/api/boms/${bomId}/components`).catch(()=>({data:[]}))
      this.compList = res.data
      this.selectedComp = null
    },
    clearBomDetail()   { this.selectedBom = null; this.compList = [] },
    clearCompDetail()  { this.selectedComp = null },    
    updateBom()        { /* PUT  /api/boms/:bomId */ },
    async deleteBom(){        
      
      const res = await axios.delete(`/api/boms/${this.selectedBom.bom_id}`).catch(()=>({data:[]}))
      this.loadBoms();
    },
    createComp()       { /* POST /api/boms/:bomId/components */ },
    updateComp()       { /* PUT  /api/boms/:bomId/components/:seqId */ },
    deleteComp()       { /* DELETE /api/boms/:bomId/components/:seqId */ },
    async createBom() {
      const res = await axios.get(`/api/boms/bomitemsList`).catch(()=>({data:[]}));
      this.bomitemsList = res.data;
      console.log(this.bomitemsList );
      this.showBomModal = true;
    },
    selectItemBom(item) {
      this.selectedItemBom =item
      //this.loadComps(bom.bom_id)
    },
    async registeritemBomModal(){      
      const res = await axios.post('/api/boms',  this.selectedItemBom ).catch(()=>({data:[]}))
      this.showBomModal = false;
      this.loadBoms();
    }
  }
}
</script>

<style scoped>
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
