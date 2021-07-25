const https = require('follow-redirects').https
const fs = require('fs')
const {gzip, ungzip} = require('node-gzip')

const {PCExpressAPIRequestBuilder, SampleValues} = require('./PCExpressAPIRequestBuilder.js')
//var rb = new PCExpressAPIRequestBuilder(SampleValues.xapikey, SampleValues.cartId)

var items = []

class SuperStore {
    constructor(storeId = SampleValues.halifaxStoreId, cartId = SampleValues.cartId){
        this.storeId = storeId
        this.cartId = cartId
        this.rb = new PCExpressAPIRequestBuilder(SampleValues.xapikey, this.cartId)
    }
    
    search(query){
        var postData = this.rb.searchBody(query, this.storeId, this.cartId)
        var searchHeader = this.rb.searchHeader(postData.length)
        var items = []

        var req = https.request(searchHeader, function (res) {
            var chunks = [];
          
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks)
                
                ungzip(body).then((decompressed) => {
                    var items = []
                    var content = JSON.parse(decompressed.toString())
                    for (let result of content.results){
                        items.push({
                            name: result.name,
                            brand: result.brand,
                            code: result.code
                        })
                    }
                    // return
                })
            });
          
            res.on("error", function (error) {
                console.error(error);
            });
        });
          
        req.write(postData);
        req.end();

        return items
    }

    getItem(itemId){
        var options = this.rb.singleItemHeader(itemId, this.storeId)

        var req = https.request(options, function (res) {
            var chunks = [];
          
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
                var content = JSON.parse(Buffer.concat(chunks).toString());
                //return
            });
          
            res.on("error", function (error) {
                console.error(error);
            });
        });
          
        req.end();
    }
}

exports.SuperStore = SuperStore
