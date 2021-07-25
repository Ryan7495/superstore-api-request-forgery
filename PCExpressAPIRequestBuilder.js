const https = require('follow-redirects').https
const fs = require('fs')
const {gzip, ungzip} = require('node-gzip')


const SampleValues = {
    xapikey: '1im1hL52q9xvta16GlSdYDsTsG0dmyhF', 
    cartId: '9a7a95be-0c7b-4703-9332-52d2a5729e93',
    halifaxStoreId: '0369',
    bananasItemId: '20175355001_KG'
}

class PCExpressAPIRequestBuilder {
    constructor(xapikey, cartId){
        this.xapikey = xapikey
        this.cartId = cartId
    }

    singleItemHeader(itemId, storeId){
        var date = new Date()
        var month = date.getMonth() + 1

        if (month < 10){
            month = `0${month}`
        }

        var dateString = `${date.getDate()}${month}${date.getFullYear()}`

        return {
            'method': 'GET',
            'hostname': 'api.pcexpress.ca',
            'path': `/v3/products/${itemId}?lang=en&date=${dateString}&pickupType=STORE&storeId=${storeId}&banner=rass&features=loyaltyServiceIntegration,inventoryServiceIntegration`,
            'headers': {
                'Host': 'api.pcexpress.ca',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Origin': 'https://www.atlanticsuperstore.ca',
                'Referer': 'https://www.atlanticsuperstore.ca/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15',
                'Accept-Language': 'en',
                'Site-Banner': 'rass',
                'x-apikey': this.xapikey
            },
            'maxRedirects': 20
        }
    }

    searchHeader(contentLength){
        return {
            'method': 'POST',
            'hostname': 'api.pcexpress.ca',
            'path': '/v3/products/search',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en',
                'Host': 'api.pcexpress.ca',
                'Origin': 'https://www.atlanticsuperstore.ca',
                'Content-Length': contentLength.toString(),
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15',
                'Referer': 'https://www.atlanticsuperstore.ca/',
                'Site-Banner': 'rass',
                'x-apikey': this.xapikey
            },
            'maxRedirects': 20
        }
    }

    searchBody(query, storeId, cartId){
        var date = new Date()
        var month = date.getMonth() + 1

        if (month < 10){
            month = `0${month}`
        }

        var dateString = `${date.getDate()}${month}${date.getFullYear()}`

        return `{"pagination":{"from":0,"size":48},"banner":"rass","cartId":"${cartId}","lang":"en","date":"${dateString}","storeId":"${storeId}","pcId":null,"pickupType":"STORE","enableSeldonIntegration":true,"features":["loyaltyServiceIntegration","sunnyValeServiceIntegration"],"inventoryInfoRequired":true,"sort":{"topSeller":"desc"},"term":"${query}"}`
    }
}

exports.PCExpressAPIRequestBuilder = PCExpressAPIRequestBuilder
exports.SampleValues = SampleValues