<script setup>
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {Modal, message} from 'ant-design-vue';

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws
const listObjects = useState('listObjects')

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const removeFile = () => {
  const index = listObjects.value.indexOf(props.file)
  const newFileList = listObjects.value.slice()
  newFileList.splice(index, 1)

  listObjects.value = newFileList
}

const deleteObject = async () => {
  const input = {
    Bucket: s3BucketName,
    Key: props.file.Key
  }

  const command = new DeleteObjectCommand(input)

  try {
    await $s3Client.send(command)
    emit('delete', props.file.Key)
    removeFile()
  } catch (err) {
    message.error('Error deleting file')
  }
}

const showConfirm = () => {
  Modal.confirm({
    title: 'Are you sure to delete the file?',
    okButtonProps: {
      danger: true
    },
    okText: 'Delete',
    async onOk() {
      await deleteObject()
    },
  })
}
</script>

<template>
  <a-button @click="showConfirm" danger size="small" >
    <template #icon>
      <DeleteOutlined :style="{ fontSize: '13px' }" />
    </template>
  </a-button>
</template>
