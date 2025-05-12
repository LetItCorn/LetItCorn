import { defineStore } from 'pinia';
import axios from 'axios';

export const useInstStore = defineStore('inst', {
  state: () => ({
    selectedPlan: null,
    isPlanModalOpen: false,
    planModalData: [],
    selectedPlans: []
  }),

  actions: {
    setSelectedPlan(plan) {
      this.selectedPlan = plan;
    },
    reset() {
      this.selectedPlan = null;
      this.isPlanModalOpen = false;
    },
    openModal() {
      this.isPlanModalOpen = true;
    },
    closeModal() {
      this.isPlanModalOpen = false;
    },
    setPlanModalData(data) {
      this.planModalData = data
    },
    setSelectedPlans(data) {
      this.selectedPlans = data
    },
    resetAll() {
      this.selectedPlans = []
      this.selectedPlan = null
      this.planModalData = []
    },
    async registerInstData(data) {
      try {
        await axios.post('/api/inst/register', data);        
        this.resetAll();
      } catch (err) {
        console.error(err);
      }
    },
  },
});