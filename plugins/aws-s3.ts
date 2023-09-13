import {S3Client} from '@aws-sdk/client-s3'

export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig()
    const {iamUserSecretKey, iamUserAccessId, s3Region} = runtimeConfig.public.aws

    return {
        provide: {
            s3Client: new S3Client({
                region: s3Region,
                credentials: {
                    secretAccessKey: iamUserSecretKey,
                    accessKeyId: iamUserAccessId,
                },
            })
        }
    }
})
