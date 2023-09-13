// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      aws: {
        iamUserSecretKey: process.env.NUXT_IAM_USER_SECRET_KEY,
        iamUserAccessId: process.env.NUXT_IAM_USER_ACCESS_ID,
        s3BucketName: process.env.NUXT_S3_BUCKET_NAME,
        s3Region: process.env.NUXT_S3_REGION,
      }
    }
  },
  devtools: { enabled: true },
  modules: [
    '@ant-design-vue/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
