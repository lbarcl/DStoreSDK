const dstore = require('./index.js');
const fs = require('fs');

async function main() {
    const DStore = new dstore();
    
    //* New User
    console.log('New User')
    const user = await DStore.newUser()
    console.log(user)
    DStore.userId = user.data.userId

    //* New Bucket
    console.log('New Bucket')
    const bucket = await DStore.newBucket()
    console.log(bucket)
    DStore.bucketId = bucket.data.bucketId
    DStore.bucketKey = bucket.data.bucketKey

    //* File Upload
    console.log('File Upload')
    const fileByte = fs.readFileSync('./test.png')
    const file = await DStore.uploadFile(fileByte, 'test.png')
    console.log(file)

    //* File Meta
    console.log('File Meta')
    const fileMeta = await DStore.fileMeta(file.data.fileId)
    console.log(fileMeta)

    //* Files
    console.log('Bucket Files')
    const files = await DStore.bucketFiles()
    console.log(files)

    //* Download File
    console.log('Download File')
    const fileByteDown = await DStore.downloadFile(file.data.fileId)
    fs.writeFileSync('./downloads/' + file.data.fileName, fileByteDown)
    
    //* Delete File
    console.log('Delete File')
    await DStore.deleteFile(file.data.fileId)
    console.log(204)

    //* Delete Bucket
    console.log('Delete Bucket')
    await DStore.deleteBucket()
    console.log(204)
}

main()