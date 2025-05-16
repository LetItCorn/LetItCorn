<template>
  <div class="insertfinishedproduct-container">
    <div class="header-container">
      <div class="main-title">
        <h2>완제품 입고 등록</h2>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
  .insertfinishedproduct-container {
  margin: 25px;
  color: #000 !important;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.main-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.main-title h2 {
  margin: 0;
  font-weight: bold;
  color: #000 !important;
  line-height: 50px;
}

/* button */
.btn {
  margin-bottom: 0 !important;
  width: 100%;
  background-color: #000 !important;
  color: #fff !important;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px !important;
  border: 1px solid #000 !important;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 액션 버튼 스타일 */
.btn-reroad {
  background-color: #00ffc8 !important;
  color: #000 !important;
  width: 110px !important;
  border: none !important;
}

.btn-select {
  background-color: #0000ff !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-update {
  background-color: #28a745 !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-delete {
  background-color: #dc3545 !important;
  color: #fff !important;
  width: 100px !important;
  border: none !important;
}

.btn-insert {
  background-color: #fbff00 !important;
  color: #000 !important;
  width: 100px !important;
  border: none !important;
}

.order-table {
overflow-x: auto;
margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  border: 1px solid #bebebe !important;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #ddd;
}

td {
  background-color: #fff;
}

.modal {
  position: fixed;
  width: 100% !important;
  height: 100% !important;
  z-index: 99 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  color: black;
}

.modal-title h3 {
  color: #000;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}


.form-group input[readonly] {
  background-color: #f5f5f5;
  color: #666;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>