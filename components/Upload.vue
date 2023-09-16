<script setup>
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {message} from "ant-design-vue"

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws
const emit = defineEmits(['finish'])

const listObjects = useState('listObjects')
const previewVisible = ref(false)
const uploading = ref(false)
const files = ref([])
const previewImage = ref('')
const previewTitle = ref('')

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

const createName = (name) => {
  const fileExtension = name.split('.').pop()
  const cleanedFileName = name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_')
  const timestamp = new Date().getTime()
  return `${cleanedFileName}_${timestamp}.${fileExtension}`
}

const beforeUpload = (file) => {
  return false
}

const handleRemove = (file) => {
  const index = files.value.indexOf(file)
  const newFileList = files.value.slice()
  newFileList.splice(index, 1)

  files.value = newFileList;
}

const onImageUploaded = async (file) => {
  const name = createName(file.name)

  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: name,
    Body: file,
    CacheControl: 'max-age=31536000',
    ACL: 'public-read',
  })

  try {
    await $s3Client.send(command)

    const newObject = {
      Key: name,
      LastModified: new Date(),
      Size: file.size,
      Url: `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${name}`
    }

    listObjects.value.unshift(newObject)
  } catch (err) {
    console.error(err)
    message.error(`Error uploading file ${file.name}`)
  }
}

const submitFiles = async () => {
  uploading.value = true

  await Promise.all([...files.value.map(file => onImageUploaded(file.originFileObj))]);

  uploading.value = false
  emit('finish')
}
</script>

<template>
  <div class="clearfix">
      <a-upload-dragger
          v-model:fileList="files"
          name="file"
          list-type="picture-card"
          :multiple="true"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          @preview="handlePreview"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>

        <p class="ant-upload-text">Click or drag file to this area to upload</p>

        <p class="ant-upload-hint">
          Support for a single or bulk upload
        </p>
      </a-upload-dragger>

    <div class="flex justify-end mt-5">
      <a-button
          type="primary"
          :disabled="files.length === 0"
          :loading="uploading"
          @click="submitFiles"
      >
        {{ uploading ? 'Uploading' : 'Start Upload' }}
      </a-button>
    </div>

    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>
