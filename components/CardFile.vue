<script setup>
import {message} from 'ant-design-vue';
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

const listSelectedObjects= useState('selectedObjects')
const isSelectedCard = computed(() => listSelectedObjects.value.includes(props.file))

const selectedCard = (val) => {
  if(val.target.checked) {
    listSelectedObjects.value.push(props.file)
  } else {
    const index = listSelectedObjects.value.indexOf(props.file)
    const newFileList = listSelectedObjects.value.slice()
    newFileList.splice(index, 1)
    listSelectedObjects.value = newFileList
  }
}

const copyUrl = async (url) => {
  await copy(url)

  if(copied) {
    message.success('Copied to clipboard')
  }
}
</script>

<template>
  <a-card size="small" class="card-file h-full flex flex-col relative group" hoverable :class="{ active: isSelectedCard}">
    <div class="absolute top-3 left-3 transform scale-75" :class="{ 'opacity-0 group-hover:opacity-100': !isSelectedCard}">
      <a-checkbox :checked="isSelectedCard" @change="selectedCard" />
    </div>

    <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100" v-if="!isSelectedCard">
      <DeleteFile :file="file"/>
    </div>

    <template #cover>
      <div>
        <div class="box-preview flex justify-center items-center w-full p-2">
          <img
              alt="example"
              :src="file.Url"
              class="object-contain max-w-full max-h-full"
          />
        </div>
      </div>
    </template>

    <template #actions>
      <a-tooltip placement="top">
        <template #title>
          <span>Copy url</span>
        </template>

        <a :href="file.Url" @click.prevent="copyUrl(file.Url)">
          <CopyOutlined/>
        </a>
      </a-tooltip>

      <a-tooltip placement="top">
        <template #title>
          <span>Open link</span>
        </template>

        <a :href="file.Url" target="_blank">
          <LinkOutlined />
        </a>
      </a-tooltip>
    </template>

    <div>
      <h3 class="text-xs break-all w-full">{{ file.Key }}</h3>
    </div>
  </a-card>
</template>

<style>
.box-preview {
  height: 12rem;
  background: repeating-conic-gradient(rgb(246, 246, 249) 0%, rgb(246, 246, 249) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
}

:where(.css-dev-only-do-not-override-kqecok).ant-card .ant-card-cover img {
  border-radius: 0;
}

.card-file {
  box-shadow: 0 0 0 2px transparent;
  border-radius: 4px;
  overflow: hidden;
}

.card-file .ant-card-body {
  height: 100%;
}

.card-file.active {
  box-shadow: 0 0 0 2px #1777ff;
}

.card-file :where(.css-dev-only-do-not-override-kqecok).ant-checkbox .ant-checkbox-inner {
  width: 24px;
  height: 24px;
}

.card-file :where(.css-dev-only-do-not-override-kqecok).ant-checkbox-checked .ant-checkbox-inner:after {
  inset-inline-start: 31.5%;
}
</style>
