'use strict';
var electrum = function() {}
electrum.SERVERURL = "http://47.88.61.227:52003/";
electrum.pendingPosts = [];
electrum.config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
};

electrum.getCurrentBlock = function(callback) {
    callback({ error: false, msg: '', data: new BigNumber(0).toString() });
}
electrum.getBalance = function(addr, callback) {
    this.post('blockchain.address.get_balance', {'address':addr}, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: { address: addr, balance: data.result.confirmed/100000000 } });
    });
}
electrum.getTransaction = function(txHash, callback) {
    this.post({
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: txHash
    }, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: data.result });
    });
}
electrum.getUnspentTransactions = function(addr, callback) {
    this.post('blockchain.address.listunspent', {'address':addr}, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: data.result });
    });
}
electrum.getTransactionData = function(addr, callback) {
    var response = { error: false, msg: '', data: { address: addr, balance: '', gasprice: '', nonce: '' } };
    var parentObj = this;
    parentObj.getBalance(addr, function(data) {
        if (data.error) {
            callback({ error: true, msg: data.msg, data: '' });
            return;
        }
        response.data.balance = data.data.balance;
        parentObj.post({
            module: 'proxy',
            action: 'eth_gasPrice'
        }, function(data) {
            if (data.error) {
                callback({ error: true, msg: data.error.message, data: '' });
                return;
            }
            response.data.gasprice = data.result;
            parentObj.post({
                module: 'proxy',
                address: addr,
                action: 'eth_getTransactionCount',
                tag: 'latest'
            }, function(data) {
                if (data.error) {
                    callback({ error: true, msg: data.error.message, data: '' });
                    return;
                }
                response.data.nonce = data.result;
                callback(response);
            });
        });
    });
}
electrum.sendRawTx = function(rawTx, callback) {
    this.post('blockchain.transaction.broadcast', {'raw_tx':rawTx}, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: data.result });
    });
}
electrum.getEstimatedGas = function(txobj, callback) {
    this.post({
        module: 'proxy',
        action: 'eth_estimateGas',
        to: txobj.to,
        value: txobj.value,
        data: txobj.data,
        from: txobj.from
    }, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: data.result });
    });
}
electrum.getEthCall = function(txobj, callback) {
    this.post({
        module: 'proxy',
        action: 'eth_call',
        to: txobj.to,
        data: txobj.data
    }, function(data) {
        if (data.error) callback({ error: true, msg: data.error.message, data: '' });
        else callback({ error: false, msg: '', data: data.result });
    });
}
electrum.queuePost = function() {
    var data = this.pendingPosts[0].data;
    var callback = this.pendingPosts[0].callback;
    var parentObj = this;
    ajaxReq.http.post(this.SERVERURL, data, this.config).then(function(data) {
        callback(data.data);
        parentObj.pendingPosts.splice(0, 1);
        if (parentObj.pendingPosts.length > 0) parentObj.queuePost();
    }, function(data) {
        callback({ error: true, msg: "connection error", data: "" });
    });
}
electrum.post = function(method, data, callback) {
    var jsonrpc = require('jsonrpc-lite');
    var requestObj = jsonrpc.request((new Date()).getTime(), method, data);
    this.pendingPosts.push({
        data: requestObj.serialize(),
        callback: function(_data) {
            callback(_data);
        }
    });
    if (this.pendingPosts.length == 1) this.queuePost();
}
module.exports = electrum;
