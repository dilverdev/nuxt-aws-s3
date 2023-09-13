<script setup>
import {ListObjectsV2Command} from '@aws-sdk/client-s3'
import CardFile from "~/components/CardFile.vue";

const runtimeConfig = useRuntimeConfig()
const {$s3Client} = useNuxtApp()

const {s3BucketName, s3Region} = runtimeConfig.public.aws
const listObjects = useState('listObjects', () => [])

const params = ref({
  Bucket: s3BucketName,
  EncodingType: "url",
  MaxKeys: 24,
  Prefix: "",
})
const loadingPage = ref(false)
const pageCounter = ref(0)
const page = ref(0)

const createObjectFile = (item) => ({
  Key: item.Key,
  LastModified: item.LastModified,
  Size: item.Size,
  Url: `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${item.Key}`
})

const fetchObjects = async () => {
  loadingPage.value = true

  const command = new ListObjectsV2Command(params.value)

  try {
    const response = await $s3Client.send(command)

    if(response.Contents && response.Contents.length) {
      if (!response.IsTruncated) {
        const files = response.Contents.map((item) => createObjectFile(item))
        listObjects.value.push(...files)
        loadingPage.value = false
        return
      }

      if (pageCounter.value !== page.value) {
        pageCounter.value++
        params.value.ContinuationToken = response.NextContinuationToken
        await fetchObjects()
        loadingPage.value = false
        return
      }

      const files = response.Contents.map((item) => createObjectFile(item))
      listObjects.value.push(...files)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingPage.value = false
  }
}

const nextPage = () => {
  if (loadingPage.value) return

  page.value++
  fetchObjects()
}

const onSearch = () => {
  listObjects.value = []
  page.value = 0
  pageCounter.value = 0
  params.value.ContinuationToken = null
  fetchObjects()
}

onMounted(async () => {
  await fetchObjects()
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <a-button disabled>
        <FilterOutlined />Filter
      </a-button>
    </div>

    <div>
      <a-input-search id="search" placeholder="Search" v-model:value="params.Prefix" @search="onSearch" />
    </div>
  </div>

  <ul class="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <li v-for="file in listObjects" :key="file.Key">
      <CardFile :file="file" />
    </li>
  </ul>

  <div v-if="loadingPage" class="text-center">
    <a-spin/>
  </div>

  <Observer @intersect="nextPage"/>
</template>

<style>
.box-preview {
  height: 12rem;
  background: repeating-conic-gradient(rgb(246, 246, 249) 0%, rgb(246, 246, 249) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
}

.card-preview .ant-card-body {
  height: 100%;
}
</style>
