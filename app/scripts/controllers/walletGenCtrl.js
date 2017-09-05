'use strict';
var walletGenCtrl = function($scope) {
    $scope.wallet = null;
    $scope.genNewWallet = function() {
        if ($scope.isDone) {
            $scope.wallet = Wallet.generate();
            if (parent != null)
                parent.postMessage(JSON.stringify({ address: $scope.wallet.getAddress() }), "*");
        }
    }
    $scope.printQRCode = function() {
        globalFuncs.printPaperWallets(JSON.stringify([{
            address: $scope.wallet.getAddress(),
            private: $scope.wallet.getPrivateKeyString()
        }]));
    }
};
module.exports = walletGenCtrl;
