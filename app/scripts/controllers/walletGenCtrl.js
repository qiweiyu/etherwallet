'use strict';
var walletGenCtrl = function($scope) {
    $scope.wallet = null;
    $scope.showWallet = false;
    $scope.isDone = true;
    $scope.showPaperWallet = false;
    $scope.showGetAddress = false;
    $scope.genNewWallet = function() {
        if ($scope.isDone) {
            $scope.wallet = null;
            $scope.isDone = false;
            $scope.wallet = Wallet.generate();
            $scope.showWallet = true;
            if (parent != null)
                parent.postMessage(JSON.stringify({ address: $scope.wallet.getAddressString(), checksumAddress: $scope.wallet.getChecksumAddressString() }), "*");
            $scope.isDone = true;
        }
    }
    $scope.printQRCode = function() {
        globalFuncs.printPaperWallets(JSON.stringify([{
            address: $scope.wallet.getChecksumAddressString(),
            private: $scope.wallet.getPrivateKeyString()
        }]));
    }
    $scope.getAddress = function(){
        $scope.showWallet = false;
        $scope.showGetAddress = true;
    }
};
module.exports = walletGenCtrl;
