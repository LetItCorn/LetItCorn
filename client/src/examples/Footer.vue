<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { useConfigStore } from "@/store/index"; // Pinia store import

export default {
  name: "app-footer",
  data() {
    return {
      store: useConfigStore(), // store를 등록
    };
  },
};
</script>
