<template>
  <div class="container-fluid vh-100 py-3 d-flex flex-column">
    <!-- 1) 상단 조회 바 -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="ms-auto d-flex align-items-center">
              <input
                v-model="searchValue"
                placeholder="자재명 또는 코드"
                class="form-control form-control-sm me-2"
                style="width:200px"
              />
              <button @click="loadMaterials" class="btn btn-sm btn-primary me-2" style="width:80px">조회</button>
              <button @click="resetFilter" class="btn btn-sm btn-outline-secondary" style="width:80px">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) 자재 리스트 및 상세 -->
    <div class="row flex-grow-1 gx-3">
      <!-- 좌측 리스트 -->
      <div class="col-md-8 h-100">
        <div class="card h-100">
          <div class="card-header">자재 리스트</div>
          <div class="card-body p-0 overflow-auto">
            <table class="table table-hover table-sm mb-0">
              <thead class="thead-light sticky-top">
                <tr>
                  <th>자재코드</th>
                  <th>자재명</th>
                  <th>구분</th>
                  <th>안전재고</th>
                  <th>현재재고</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="mat in materialList"
                  :key="mat.mater_code"
                  @click="selectMaterial(mat)"
                  :class="{ 'table-active': mat.mater_code === selected.mater_code }"
                  style="cursor:pointer"
                >
                  <td>{{ mat.mater_code }}</td>
                  <td>{{ mat.mater_name }}</td>
                  <td>{{ mat.category_name }}</td>
                  <td>{{ mat.safe_stock }}</td>
                  <td>{{ mat.total_stock }}</td>
                </tr>
                <tr v-if="materialList.length === 0">
                  <td colspan="5" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 우측 상세 -->
      <div class="col-md-4 h-100">
        <div class="card h-100">
          <div class="card-header">자재 상세</div>
          <div class="card-body">
            <table class="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th>자재코드</th>
                  <td><input v-model="selected.mater_code" class="form-control form-control-sm" :readonly="!!selected.mater_code" /></td>
                </tr>
                <tr>
                  <th>자재명</th>
                  <td><input v-model="selected.mater_name" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>단위</th>
                  <td><input v-model="selected.mater_unit" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>안전재고</th>
                  <td><input v-model="selected.safe_stock" type="number" class="form-control form-control-sm" /></td>
                </tr>
                <tr>
                  <th>보관위치</th>
                  <td><input v-model="selected.mater_storage" class="form-control form-control-sm" /></td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary flex-grow-1" @click="clearDetail">초기화</button>
              <button class="btn btn-success flex-grow-1" @click="onCreate">등록</button>
              <button class="btn btn-warning flex-grow-1" @click="onUpdate" :disabled="!selected.mater_code">수정</button>
              <button class="btn btn-danger flex-grow-1" @click="onDelete" :disabled="!selected.mater_code">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Material',
  data() {
    return {
      searchValue: '',
      materialList: [],
      selected: {}
    };
  },
  created() {
    this.loadMaterials();
  },
  methods: {
    async loadMaterials() {
      const list = await axios.get('/api/materials').then(res => res.data).catch(() => []);
      this.materialList = list.filter(mat => {
        return (
          !this.searchValue ||
          mat.mater_code.includes(this.searchValue) ||
          mat.mater_name.includes(this.searchValue)
        );
      });
    },
    resetFilter() {
      this.searchValue = '';
      this.loadMaterials();
    },
    selectMaterial(mat) {
      this.selected = { ...mat };
    },
    clearDetail() {
      this.selected = {};
    },
    async onCreate() {
      try {
        await axios.post('/api/materials', this.selected);
        await this.loadMaterials();
        this.clearDetail();
      } catch (err) {
        console.error('등록 오류', err);
      }
    },
    async onUpdate() {
      try {
        await axios.put(`/api/materials/${this.selected.mater_code}`, this.selected);
        await this.loadMaterials();
      } catch (err) {
        console.error('수정 오류', err);
      }
    },
    async onDelete() {
      try {
        await axios.delete(`/api/materials/${this.selected.mater_code}`);
        await this.loadMaterials();
        this.clearDetail();
      } catch (err) {
        console.error('삭제 오류', err);
      }
    }
  }
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.sticky-top th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
</style>
