<template>
    <div class="search-wrapper">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Search..."
            @focus="showSuggestions = true" @blur="hideSuggestionsWithDelay" @keydown.down.prevent="moveDown"
            @keydown.up.prevent="moveUp" @keydown.enter.prevent="selectItem" />

        <ul v-if="filteredRoutes.length && showSuggestions" class="search-dropdown">
            <li v-for="(route, index) in filteredRoutes" :key="route.path" class="search-item px-3 py-2" :class="{
                'bg-primary text-white': index === highlightedIndex,
            }" @mousedown.prevent="goToRoute(route.path)" @mouseenter="highlightedIndex = index"
                @mouseleave="highlightedIndex = -1">
                {{ route.name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { routes as routeDefinitions } from '@/router/index'

const router = useRouter()

const searchQuery = ref('')
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)

const flattenRoutes = (routes, basePath = '') => {
    const result = []
    for (const route of routes) {
        const fullPath = basePath + (route.path.startsWith('/') ? route.path : '/' + route.path)
        if (route.meta?.title) {
            result.push({ name: route.meta.title, path: fullPath })
        }
        if (route.children) {
            result.push(...flattenRoutes(route.children, fullPath))
        }
    }
    return result
}

const allSearchableRoutes = flattenRoutes(routeDefinitions).filter(r => r.name && r.path)

const filteredRoutes = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return allSearchableRoutes.slice(0, 4)
    return allSearchableRoutes.filter(route =>
        route.name.toLowerCase().includes(query)
    )
})

const goToRoute = (path) => {
    showSuggestions.value = false
    searchQuery.value = ''
    router.push(path)
}

const hideSuggestionsWithDelay = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

const moveDown = () => {
    if (highlightedIndex.value < filteredRoutes.value.length - 1) {
        highlightedIndex.value++
    }
}

const moveUp = () => {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--
    }
}

const selectItem = () => {
    const route = filteredRoutes.value[highlightedIndex.value]
    if (route) {
        goToRoute(route.path)
    }
}

watch(searchQuery, () => {
    highlightedIndex.value = -1
})
</script>

<style scoped>
.search-wrapper {
    position: relative;
}

.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: var(--hope-colors-bg, white);
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    max-height: 250px;
    overflow-y: auto;
    padding: 0;
    margin-top: 4px;
    list-style: none;
}

.search-item {
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 0.25rem;
}

.search-item:hover {
    background-color: var(--hope-colors-primary9, #3a57e8);
    color: var(--hope-colors-white, #ffffff);
}
</style>
