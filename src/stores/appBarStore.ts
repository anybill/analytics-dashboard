import { defineStore } from 'pinia'



export const useAppBarStore = defineStore('appBar', {
    state: () => ({
        selectedMonth: 3,
        selectedCategory: 2025,
    }),

    actions: {
        setMonth(month: number) {
            this.selectedMonth = month
        },

        setCategory(category: string) {
            this.selectedCategory = category
        },
    }
}) 