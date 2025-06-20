<script setup lang="ts">
const { defaultProductsPerPage } = useAppConfig()

const {
  title,
  collectionId,
  categoryId,
} = defineProps<{
  title?: string
  collectionId?: string
  categoryId?: string
}>()

const {
  sortOptions,
  sortBy,
  pageNumber,
} = useFilters()

const productsQuery = computed(() => ({
  collection_id: collectionId,
  category_id: categoryId,
  limit: defaultProductsPerPage,
  offset: (pageNumber.value - 1) * defaultProductsPerPage,
}))

const { data } = await useFetchProducts(productsQuery)

const products = computed(() => data.value?.products)
const count = computed(() => data.value?.count || 0)

const displayPagination = computed(() => count.value > defaultProductsPerPage)
</script>

<template>
  <UContainer class="flex flex-col sm:flex-row sm:items-start py-6">
    <div class="py-4 mb-8 sm:px-0 pl-6 sm:min-w-[250px]">
      <URadioGroup
        v-model="sortBy"
        legend="Sortowanie"
        :items="sortOptions"
        color="neutral"
        :ui="{
          fieldset: 'gap-2',
          legend: 'mb-2',
        }"
      />
    </div>
    <div class="w-full">
      <AppHeading
        v-if="title && products"
        as="h1"
        class="mb-8"
      >
        {{ title }} ({{ count }})
      </AppHeading>
      <USkeleton
        v-else
        class="mb-8 h-12 w-[300px]"
      />
      <ProductList
        v-if="products"
        :products="products"
        :sort-by="sortBy"
        class="mb-8"
      />
      <ProductListSkeleton
        v-else
        class="mb-8"
      />
      <div
        v-if="displayPagination"
        class="flex justify-end"
      >
        <UPagination
          v-model:page="pageNumber"
          active-color="neutral"
          :items-per-page="defaultProductsPerPage"
          :total="count"
        />
      </div>
    </div>
  </UContainer>
</template>
