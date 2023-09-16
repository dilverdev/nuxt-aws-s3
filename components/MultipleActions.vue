<script setup>
import {DeleteObjectCommand} from "@aws-sdk/client-s3"
import {message, Modal} from "ant-design-vue"

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws
const deleting = ref(false)
const listObjects = useState('listObjects', () => [])
const listSelectedObjects = useState('selectedObjects', () => [])

const removeFile = (file) => {
  const index = listObjects.value.indexOf(file)
  const newFileList = listObjects.value.slice()
  newFileList.splice(index, 1)
  listObjects.value = newFileList

  const indexSelected = listSelectedObjects.value.indexOf(file)
  const newSelectedFileList = listSelectedObjects.value.slice()
  newSelectedFileList.splice(indexSelected, 1)
  listSelectedObjects.value = newSelectedFileList
}

const deleteObject = async (file) => {
  const input = {
    Bucket: s3BucketName,
    Key: file.Key,
  }

  const command = new DeleteObjectCommand(input)

  try {
    await $s3Client.send(command)
    removeFile(file)
  } catch (err) {
    message.error('Error deleting file')
  }
}

const submitRemoveFiles = async () => {
  deleting.value = true

  await Promise.all([...listSelectedObjects.value.map(file => deleteObject(file))]);

  deleting.value = false
}

const showConfirm = () => {
  Modal.confirm({
    title: 'Are you sure to delete the file?',
    okButtonProps: {
      danger: true
    },
    okText: 'Delete',
    async onOk() {
      await submitRemoveFiles()
    },
  })
}

</script>

<template>
  <div class="multiple-actions fixed bg-white py-2.5 px-6 rounded-full z-50 shadow-lg"
       :class="{ active: listSelectedObjects.length}">
    <div class="flex items-center gap-4">
      <div class="font-sans text-sm">{{ listSelectedObjects.length }} {{ listSelectedObjects.length > 1 ? 'files': 'file'}} selected</div>

      <div>
        <a-button danger shape="round" @click="showConfirm" :loading="deleting">
          <template #icon>
            <DeleteOutlined :style="{ fontSize: '13px' }"/>
          </template>
          Eliminar
        </a-button>
      </div>
    </div>
  </div>
</template>

<style>
.multiple-actions {
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  transition: bottom 0.3s ease-in-out;
}

.multiple-actions.active {
  bottom: 16px;
}
</style>
