<!-- 이용진 -->
<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4">반제품 생산지시 조회</h2>

    <div class="card shadow-sm">
      
      <div class="col-md-4">
        <input 
          v-model="searchQuery"
          @input="applyFilters"
          type="text"
          class="form-control form-control-sm"
          placeholder="생산지시번호 검색"
        />
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover text-ceter mb-0">
            <tr>
              <th style="width: 1%">
                <input 
                  type="checkbox"
                  :checked="allSelected"
                  @change="togglAllSelection"
                />
              </th>
              <th></th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
</script>
<style>
</style>