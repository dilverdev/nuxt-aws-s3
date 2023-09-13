<script setup lang="ts">
import {PutObjectCommand} from '@aws-sdk/client-s3'
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const fileList = ref<UploadProps['fileList']>([])

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  });
}

const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}


const onImageUploaded = async (file) => {
  await console.log(file)

  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: file.name,
    Body: file,
    CacheControl: 'max-age=31536000',
    ACL: 'public-read',
  })

  try {
    const response = await $s3Client.send(command)
    console.log(response)
  } catch (err) {
    console.error(err)
  }

  console.log(`https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${file.name}`)
}
</script>

<template>
  <div class="clearfix">
    <a-upload
        v-model:file-list="fileList"
        :action="onImageUploaded"
        list-type="picture-card"
        @preview="handlePreview"
    >
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>

    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
