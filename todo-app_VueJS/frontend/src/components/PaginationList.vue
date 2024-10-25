<template>
    <div class="flex justify-center items-center space-x-2 py-4 text-xs md:text-lg">
        <!-- Bouton Previous -->
        <button @click="goToPreviousPage" :disabled="currentPage === 1"
            class="text-blue-950 hover:text-blue-500 px-3 py-1 hidden sm:inline">
            Previous
        </button>

        <!-- Pages avant, actuelle, et après -->
        <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
            :class="{ 'text-blue-500 font-bold': page === currentPage, 'text-blue-950': page !== currentPage }"
            class="px-3 py-1">
            {{ page }}
        </button>

        <!-- Bouton Next -->
        <button @click="goToNextPage" :disabled="currentPage === totalPages"
            class="text-blue-950 hover:text-blue-500 px-3 py-1 hidden sm:inline">
            Next
        </button>
    </div>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        }
    },
    computed: {
    visiblePages() {
        const pages = [];

        // Ajouter la première page
        pages.push(1);

        // Si la page actuelle est proche du début
        if (this.currentPage > 3) {
            // Ajouter les points de suspension après la première page
            pages.push('...');
        }

        // Calcul des pages centrales (autour de la page actuelle)
        const startPage = Math.max(2, this.currentPage - 1);
        const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Si la page actuelle est proche de la fin
        if (this.currentPage < this.totalPages - 2) {
            // Ajouter les points de suspension avant la dernière page
            pages.push('...');
        }

        // Ajouter la dernière page
        if (this.totalPages > 1) {
            pages.push(this.totalPages);
        }

        return pages;
    }
}
,
    methods: {
        goToPreviousPage() {
            if (this.currentPage > 1) {
                this.$emit('page-changed', this.currentPage - 1);
            }
        },
        goToNextPage() {
            if (this.currentPage < this.totalPages) {
                this.$emit('page-changed', this.currentPage + 1);
            }
        },
        changePage(page) {
            this.$emit('page-changed', page);
        }
    }
}
</script>