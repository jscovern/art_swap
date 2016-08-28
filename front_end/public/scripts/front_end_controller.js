angular.module('Art_Swap', ['ngRoute','ui.bootstrap']);
angular.module('Art_Swap')
  .controller('UserController', UserController)
  .config(function($routeProvider,$locationProvider){
    $routeProvider
    .when('/login', {
      templateUrl: "/templates/login.html",
      controller: "UserController"
    })
    .when('/register', {
    	templateUrl: "/templates/register.html",
    	controller: "UserController"
    }) ;
  });
  // .factory('NewChartScope', NewChartScope);

UserController.$inject = ["$http","$scope"];

function UserController($http,$scope) {
	$scope.login = login;
	$scope.createNewUser = createNewUser;
  var today = new Date();
  $scope.today = formatDate(today);
  $scope.newUser = {admin_user: false, join_date: $scope.today};
  $scope.loginUser = {};

	function createNewUser() {
    console.log('in createNewUser front_end');
    $http.post('/register',$scope.newUser)
      .then(function(response) {
        $scope.loginUser.email = $scope.newUser.email;
        $scope.loginUser.password = $scope.newUser.password;
        login();
      });
	}

  function formatDate(myDate) {
    var mm = formatSingleDigit(myDate.getMonth() + 1);
    var dd = formatSingleDigit(myDate.getDate());
    function formatSingleDigit(num) {
      if(num<10) {
        return "0"+num;
      } else {
        return num;
      }
    }
    var formatted = [myDate.getFullYear(),"-", mm,"-", dd].join('');
    console.log(formatted);
    return formatted;
  }

  function login() {
    console.dir($scope.loginUser);
    $http.post('/login',$scope.loginUser)
      .then(function(response) {
        console.log("response inside the login function: "+response);
        response.redirect('/home');
      });
  }
}