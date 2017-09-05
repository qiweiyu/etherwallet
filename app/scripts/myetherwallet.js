'use strict';
var Wallet = function(priv, pub, path, hwType, hwTransport) {
    if (typeof priv != "undefined") {
	var rng = function(){return priv.length == 32 ? priv : Buffer(priv, 'hex')}
	this.privKey = bitcoinUtil.ECPair.makeRandom({rng:rng})
    }
    this.pubKey = pub;
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = "default";
}
Wallet.generate = function() {
    return new Wallet(ethUtil.crypto.randomBytes(32))
}
Wallet.prototype.setTokens = function() {
    this.tokenObjs = [];
    var tokens = Token.popTokens;
    for (var i = 0; i < tokens.length; i++) {
        this.tokenObjs.push(new Token(tokens[i].address, this.getAddressString(), tokens[i].symbol, tokens[i].decimal, tokens[i].type));
        this.tokenObjs[this.tokenObjs.length - 1].setBalance();
    }
    var storedTokens = globalFuncs.localStorage.getItem("localTokens", null) != null ? JSON.parse(globalFuncs.localStorage.getItem("localTokens")) : [];
    for (var i = 0; i < storedTokens.length; i++) {
        this.tokenObjs.push(new Token(storedTokens[i].contractAddress, this.getAddressString(), globalFuncs.stripTags(storedTokens[i].symbol), storedTokens[i].decimal, storedTokens[i].type));
        this.tokenObjs[this.tokenObjs.length - 1].setBalance();
    }
}
Wallet.prototype.setBalance = function(callback) {
    var parentObj = this;
    this.balance = this.usdBalance = this.eurBalance = this.btcBalance = this.chfBalance = this.repBalance =  this.gbpBalance = 'loading';
    ajaxReq.getBalance(parentObj.getAddressString(), function(data) {
        if (data.error) parentObj.balance = data.msg;
        else {
            parentObj.balance = etherUnits.toEther(data.data.balance, 'wei');
            ajaxReq.getETHvalue(function(data) {
                parentObj.usdPrice   = etherUnits.toFiat('1', 'ether', data.usd);
                parentObj.gbpPrice   = etherUnits.toFiat('1', 'ether', data.gbp);
                parentObj.eurPrice   = etherUnits.toFiat('1', 'ether', data.eur);
                parentObj.btcPrice   = etherUnits.toFiat('1', 'ether', data.btc);
                parentObj.chfPrice   = etherUnits.toFiat('1', 'ether', data.chf);
                parentObj.repPrice   = etherUnits.toFiat('1', 'ether', data.rep);

                parentObj.usdBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.usd);
                parentObj.gbpBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.gbp);
                parentObj.eurBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.eur);
                parentObj.btcBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.btc);
                parentObj.chfBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.chf);
                parentObj.repBalance = etherUnits.toFiat(parentObj.balance, 'ether', data.rep);
                if(callback) callback();
            });
        }
    });
}
Wallet.prototype.getBalance = function() {
    //todo
    return '0QTUM';
    return this.balance;
}
Wallet.prototype.getPath = function() {
    return this.path;
}
Wallet.prototype.getHWType = function() {
    return this.hwType;
}
Wallet.prototype.getHWTransport = function() {
    return this.hwTransport;
}
Wallet.prototype.getPrivateKey = function() {
    return this.privKey
}
Wallet.prototype.getPrivateKeyString = function() {
    if (typeof this.privKey != "undefined") {
        return this.getPrivateKey().toWIF()
    } else {
        return "";
    }
}
Wallet.prototype.getPublicKey = function() {
    if (typeof this.pubKey == "undefined") {
	return this.privKey.getPublicKeyBuffer()
    } else {
        return this.pubKey;
    }
}
Wallet.prototype.getPublicKeyString = function() {
    if (typeof this.pubKey == "undefined") {
        return '0x' + this.getPublicKey().toString('hex')
    } else {
        return "0x" + this.pubKey.toString('hex')
    }
}
Wallet.prototype.getAddress = function() {
    if (typeof this.pubKey == "undefined") {
	return this.privKey.getAddress()
    } else {
        return ethUtil.publicToAddress(this.pubKey, true)
    }
}
Wallet.prototype.getAddressString = function() {
    return this.getAddress()
}
Wallet.prototype.getQrAddressString = function() {
    return JSON.stringify({amount:'',publicAddress:this.getAddressString()})
}
Wallet.fromPrivateKey = function(priv) {
    var wallet = new Wallet()
    wallet.privKey = bitcoinUtil.ECPair.fromWIF(priv)
    return wallet
}
Wallet.prototype.toJSON = function() {
    return {
        address: this.getAddressString(),
        privKey: this.getPrivateKeyString(),
        pubKey: this.getPublicKeyString(),
        publisher: "MyEtherWallet",
        encrypted: false,
        version: 2
    }
}
Wallet.decipherBuffer = function(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
}
Wallet.decodeCryptojsSalt = function(input) {
    var ciphertext = new Buffer(input, 'base64')
    if (ciphertext.slice(0, 8).toString() === 'Salted__') {
        return {
            salt: ciphertext.slice(8, 16),
            ciphertext: ciphertext.slice(16)
        }
    } else {
        return {
            ciphertext: ciphertext
        }
    }
}
Wallet.evp_kdf = function(data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

    function iter(block) {
        var hash = ethUtil.crypto.createHash(opts.digest || 'md5')
        hash.update(block)
        hash.update(data)
        hash.update(salt)
        block = hash.digest()
        for (var i = 1; i < (opts.count || 1); i++) {
            hash = ethUtil.crypto.createHash(opts.digest || 'md5')
            hash.update(block)
            block = hash.digest()
        }
        return block
    }
    var keysize = opts.keysize || 16
    var ivsize = opts.ivsize || 16
    var ret = []
    var i = 0
    while (Buffer.concat(ret).length < (keysize + ivsize)) {
        ret[i] = iter((i === 0) ? new Buffer(0) : ret[i - 1])
        i++
    }
    var tmp = Buffer.concat(ret)
    return {
        key: tmp.slice(0, keysize),
        iv: tmp.slice(keysize, keysize + ivsize)
    }
}
Wallet.getWalletFromPrivKeyFile = function(strjson, password) {
    var jsonArr = JSON.parse(strjson);
    if (jsonArr.encseed != null) return Wallet.fromEthSale(strjson, password);
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return Wallet.fromV3(strjson, password, true);
    else if (jsonArr.hash != null) return Wallet.fromMyEtherWallet(strjson, password);
    else if (jsonArr.publisher == "MyEtherWallet") return Wallet.fromMyEtherWalletV2(strjson);
    else
        throw globalFuncs.errorMsgs[2];
}
module.exports = Wallet;
