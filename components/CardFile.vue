<script setup>
import DeleteFile from "~/components/DeleteFile.vue";
import {message} from 'ant-design-vue';

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

const copyUrl = () => {
  const url = `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${props.file.Key}`
  navigator.clipboard.writeText(url)
  message.success('Copied to clipboard')
}

const downloadFile = () => {
  // code download file
}
</script>

<template>
  <a-card class="card-preview h-full flex flex-col relative group">
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100">
      <DeleteFile :file="file"/>
    </div>

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
      <a-tooltip placement="top">
        <template #title>
          <span>Copy url</span>
        </template>

        <a :href="file.Url" @click.prevent="copyUrl">
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

    <div class="-m-2">
      <h3 class="text-xs break-all w-full">{{ file.Key }}</h3>
    </div>
  </a-card>
</template>
