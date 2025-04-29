  <template>
  <nav aria-label="breadcrumb">
    <ol
      class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb"
      :class="configStore.isRTL ? '' : ' me-sm-6'"
    >
      <li class="text-sm breadcrumb-item" :class="color">
        <a v-if="configStore.isRTL" :class="color" class="opacity-5 ps-2" href="#">
          لوحات القيادة
        </a>
        <a v-else :class="color" class="opacity-8" href="#">
          Pages
        </a>
      </li>
      <li
        class="text-sm breadcrumb-item active"
        :class="color"
        aria-current="page"
      >
        {{ currentPage }}
      </li>
    </ol>
    <h6 class="mb-0 font-weight-bolder" :class="color">
      {{ currentPage }}
    </h6>
  </nav>
</template>

<script setup>
import { useConfigStore } from "@/store"; // store 위치 주의

const configStore = useConfigStore();

defineProps({
  currentPage: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "text-dark",
  },
});
</script>
