<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 100%; height: 500px;"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :modules="modules"
  />
</template>

<script>
import { onMounted, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3' // Vue3 AgGrid Component

import 'ag-grid-enterprise' // enterprise 기능 사용 시 import
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { ClientSideRowModelModule } from 'ag-grid-community'
import { ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([ClientSideRowModelModule])

export default {
  components: { AgGridVue },
  setup() {
    const columnDefs = ref([
      { field: 'make' },
      { field: 'model' },
      { field: 'price' }
    ])

    const rowData = ref([
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxster', price: 72000 },
      { make: 'Genesis', model: 'GV80', price: 90000 }
    ])

    return { columnDefs, rowData }
  }
}
</script>