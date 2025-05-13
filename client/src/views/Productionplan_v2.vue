<template>
  <div class="form-wrapper">
    <div class="form-header">
      <div v-if="!isOrderModalOpen" class="date-group">
        <span>등록일자</span>
        <Datepicker
          v-model="searchDate"
          :format="'yy-MM-dd'"
          :min-date="minDate"
          :max-date="maxDate"
          :teleport="true"
          class="datepicker-input"
        />
      </div>

      <div v-if="!isOrderModalOpen" class="button-group">
        <button @click="openOrderModal">주문서 조회</button>
        <button @click="resetAll">초기화</button>
        <button @click="registerPlan">등록</button>
      </div>
    </div>

    <OrderSelectModal
      v-if="isOrderModalOpen"
      @selectOrder="handleSelectedOrders"
    />
    <div class="grid-container" v-if="!isOrderModalOpen"></div>
    <ag-grid-vue
      ref="gridRef"
      v-if="!isOrderModalOpen"
      class="ag-theme-alpine"
      style="width: 100%; height: 400px"
      :rowData="selectedOrder"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import { useProductionPlanStore } from "@/store/production";
import { useUserStore } from "@/store/user";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { AgGridVue } from "ag-grid-vue3";
import OrderSelectModal from "@/views/components/OrderModal.vue";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default {
  components: {
    AgGridVue,
    Datepicker,
    OrderSelectModal,
  },
  data() {
    return {
      searchDate: new Date(),
      minDate: new Date("2024-01-01"),
      maxDate: new Date("2035-01-01"),
      gridRef: null,
      columnDefs: [],
    };
  },
  created() {
    this.columnDefs = [
      { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
      { field: "sorder_code", headerName: "주문번호", flex: 2 },
      { field: "plans_head", headerName: "생산계획번호", flex: 2 },
      { field: "item_code", headerName: "품목번호", flex: 1 },
      { field: "item_name", headerName: "품목명", flex: 2 },
      { field: "sorder_count", headerName: "주문 수량", flex: 1 },
      { field: "plans_vol", headerName: "생산계획수량", flex: 1 },
      {
        field: "delivery_date",
        headerName: "납기일",
        valueFormatter: (params) => this.formatDate(params.value),
        flex: 2,
      },
      {
        field: "plan_start",
        headerName: "계획시작일",
        valueFormatter: (params) => this.formatDate(params.value),
        flex: 2,
      },
      {
        field: "plan_end",
        headerName: "계획종료일",
        valueFormatter: (params) => this.formatDate(params.value),
        flex: 2,
      },
    ];
  },
  computed: {
    productionPlanStore() {
      return useProductionPlanStore();
    },
    selectedOrder() {
      return this.productionPlanStore.selectedOrder;
    },
    isOrderModalOpen() {
      return this.productionPlanStore.isOrderModalOpen;
    },
  },
  methods: {
    openOrderModal() {
      this.productionPlanStore.openOrderModal();
    },
    resetAll() {
      this.productionPlanStore.resetAll();
    },
    onGridReady(params) {
      this.gridRef = params.api;
      setTimeout(() => {
        this.gridRef.setRowData(this.selectedOrder);
      }, 50);
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    },
    handleSelectedOrders(orders) {
      console.log("[plan.vue] 전달받은 주문서:", orders);
      this.productionPlanStore.setSelectedOrders(orders);
    },
    generatePlanCode(index) {
      const date = new Date();
      const y = String(date.getFullYear()).slice(2);
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `PPHN${y}${m}${d}${String(index + 1).padStart(2, "0")}`;
    },
    async registerPlan() {
      const isModify = this.$route.query.mode === "modify";
      const userStore = useUserStore();

      const payload = {
        header: {
          plan_start: this.selectedOrder[0]?.plan_start || "",
          plan_end: this.selectedOrder[0]?.plan_end || "",
          plan_stat: "K01",
          plans_reg: this.formatDate(new Date()),
          planer: userStore.user.id || "관리자",
        },
        details: this.selectedOrder.map((order) => ({
          porder_seq: order.porder_seq,
          sorder_code: order.sorder_code,
          item_code: order.item_code,
          plans_vol: order.plans_vol,
          delivery_date: order.delivery_date,
          item_name: order.item_name,
        })),
      };

      try {
        console.log(isModify ? "수정 요청" : "등록 요청", payload);

        const res = isModify
          ? await axios.put(
              `/api/plan/${this.selectedOrder[0].plans_head}`,
              payload
            )
          : await axios.post("/api/plan", payload);

        if (res.data.isSuccessed) {
          alert(isModify ? "수정 성공" : "등록 성공");
          this.resetAll();
          if (isModify) {
            this.$router.push({ name: "ProductionPlanInquiry" });
          }
        } else {
          alert(isModify ? "수정 실패" : "등록 실패");
        }
      } catch (err) {
        console.error(isModify ? "수정 실패:" : "등록 실패:", err);
        alert(isModify ? "수정 실패" : "등록 실패");
      }
    },
  },
  mounted() {
    if (
      this.$route.query.mode === "modify" &&
      this.productionPlanStore.editTarget
    ) {
      const header = this.productionPlanStore.editTarget;
      const details = this.productionPlanStore.editDetails;
      //상세 세부계획 리스트도 복구
      this.productionPlanStore.setSelectedOrders(details);
      this.searchDate = new Date(header.plans_reg || new Date());
    }
  },
  //selectedOrder 값이 변할 때마다 setRowData() 실행
  watch: {
    selectedOrder: {
      handler(newVal) {
        if (this.gridRef) {
          this.gridRef.setRowData(newVal);
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>
.form-wrapper {
  max-width: 1400px;
  margin: 60px auto 0;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  max-width: 1400px;
  margin: 0 auto;
}

.date-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.grid-container {
  max-width: 1400px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
}
.datepicker-input {
  max-width: 150px;
  min-width: 120px;
  width: 100%;
}
</style>
