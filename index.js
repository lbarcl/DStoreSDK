const fetch = require('node-fetch');
const formBody = require('form-data');

class dstore {
    #baseUrl  = 'https://dstore-eu.herokuapp.com'
    
    constructor(userId, bucketId, bucketKey) {
        this.userId    = userId || null;
        this.bucketId  = bucketId || null;
        this.bucketKey = bucketKey || null;
    }

    async newUser() {
        let response = await fetch(`${this.#baseUrl}/users/new`, {
            method: 'POST',
        })

        response = await response.json();
        return response
    }

    async newBucket() {
        if (!this.userId) throw new Error('No User Id sended')

        let response = await fetch(`${this.#baseUrl}/users/${this.userId}/bucket/new`, {
            method: 'POST',
        })

        response = await response.json();
        return response
    }

    async bucketFiles() {
        if (!this.bucketId) throw new Error('No bucket Id sended')

        let response = await fetch(`${this.#baseUrl}/buckets/${this.bucketId}/files`, {
            method: 'GET',
            headers: {
                authorization: this.bucketKey
            }
        })

        response = await response.json();
        return response
    }

    async deleteBucket() {
        if (!this.userId) throw new Error('No User Id sended')
        else if (!this.bucketId) throw new Error('No bucket Id sended')
        else if (!this.bucketKey) throw new Error('No bucket key sended')

        let response = await fetch(`${this.#baseUrl}/users/${this.userId}/bucket/${this.bucketId}`, {
            method: 'DELETE',
            headers: {
                authorization: this.bucketKey
            }
        })

        if (response.status != 204) {
            response = await response.json();
            return response
        }

        return 204
    }

    async uploadFile(data, filename, contentType) {
        if (!filename) throw new Error('No filename sended')
        else if (!contentType) contentType = 'application/octet-stream'
        
        const body = new formBody()
        body.append("file", data, { filename, contentType })

        if (!this.bucketId) throw new Error('No bucket Id sended')
        else if (!this.bucketKey) throw new Error('No bucket key sended')

        let response = await fetch(`${this.#baseUrl}/buckets/${this.bucketId}/files/new`, {
            method: 'POST',
            headers: { authorization: this.bucketKey },
            body
        })

        response = await response.json();
        return response
    } 

    async downloadFile(fileId) {
        if (!this.bucketId) throw new Error('No bucket Id sended')

        let response = await fetch(`${this.#baseUrl}/buckets/${this.bucketId}/files/${fileId}`, { method: 'GET' })
        if (!response.ok) {
            throw response.error()
        }
        response = await response.buffer();
        return response
    }

    async fileMeta(fileId) {
        if (!this.bucketId) throw new Error('No bucket Id sended')

        let response = await fetch(`${this.#baseUrl}/buckets/${this.bucketId}/files/${fileId}/meta`, { method: 'GET' })
        if (!response.ok) {
            throw response.error
        }
        response = await response.json();
        return response
    }

    async deleteFile(fileId) {
        if (!this.bucketId) throw new Error('No bucket Id sended')
        else if (!this.bucketKey) throw new Error('No bucket key sended')

        let response = await fetch(`${this.#baseUrl}/buckets/${this.bucketId}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                authorization: this.bucketKey
            }
        })

        if (response.status != 204) {
            response = await response.json();
            return response
        }

        return 204
    }
}

module.exports = dstore