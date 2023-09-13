<script setup>
const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <a-card class="card-preview h-full flex flex-col">
    <template #cover>
      <div class="box-preview flex justify-center items-center w-full p-2">
        <img
            alt="example"
            :src="file.Url"
            class="object-contain w-full h-full"
        />
      </div>
    </template>

    <template #actions>
      <a href="#">
        <DownloadOutlined />
      </a>
      <a href="#">
        <CopyOutlined />
      </a>
    </template>

    <div class="-m-2">
      <h3 class="text-xs break-all w-full">{{ file.Key }}</h3>
    </div>
  </a-card>
</template>

<style scoped>

</style>
