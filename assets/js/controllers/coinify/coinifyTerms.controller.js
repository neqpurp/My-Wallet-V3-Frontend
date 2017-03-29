angular
  .module('walletApp')
  .controller('CoinifyTermsController', CoinifyTermsController);

function CoinifyTermsController ($scope, buySell, $stateParams, Alerts) {
  $scope.isSell = $scope.$parent.isSell;
  $scope.fields = {};
  $scope.$parent.acceptTermsForm = $scope.acceptTermsForm;
  $scope.sellEmailVerified = true;

  $scope.$parent.verifyEmail = () => {
    $q(Wallet.verifyEmail.bind(null, $scope.$parent.fields.emailVerification)).catch((err) => {
      Alerts.displayError(err);
    });
  };

  $scope.$parent.acceptTerms = () => {
    $scope.status.waiting = true;
    $scope.$parent.exchange = buySell.getExchange();

    return $scope.exchange.signup($stateParams.countryCode, $scope.$parent.transaction.currency)
      .then(() => $scope.exchange.fetchProfile())
      .then(() => $scope.$parent.nextStep())
      // then go to next step
      .catch(e => {
        const msg = `There was a problem creating your Coinify account.`;
        Alerts.displayError(msg);
        $scope.status = {};
      });
  };

  $scope.$watch('fields', () => {
    $scope.$parent.fields = $scope.fields;
  });
}