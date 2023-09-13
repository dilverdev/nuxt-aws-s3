<script setup>
const listObjects = useState('listObjects')

const isOpenModalUpload = ref(false)
</script>

<template>
  <div class="box-view p-10 bg-slate-100 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="font-sans">Media Library</h1>

      <a-button type="primary" @click="isOpenModalUpload = true">
        <PlusOutlined /> Add file
      </a-button>
    </div>

    <ListFiles/>
  </div>

  <a-modal
      destroyOnClose
      v-model:open="isOpenModalUpload"
      title="Add files"
      centered
      :footer="null"
      @ok="isOpenModalUpload = false"
  >
    <Upload class="py-4"/>
  </a-modal>
</template>

<style>
.box-view {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
