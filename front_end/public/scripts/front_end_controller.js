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
    })
    .when('/profile/:id', {
      templateUrl: "/templates/profile_show.html",
      controller: "UserController"
    });
  });

UserController.$inject = ["$http","$scope"];

function UserController($http,$scope) {
	$scope.login = login;
	$scope.createNewUser = createNewUser;
  $scope.logout = logout;
  var today = new Date();
  $scope.today = formatDate(today);
  $scope.newUser = {admin_user: false, join_date: $scope.today};
  $scope.loginUser = {};

	function createNewUser() {
    console.log('in createNewUser front_end');
    $http.post('/register',$scope.newUser)
      .then(function(response) {
        if(!response.data.error) {
          $scope.loginUser.email = $scope.newUser.email;
          $scope.loginUser.password = $scope.newUser.password;
          login();
        } else {
          $scope.errorMessage = response.data.message;
        }
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
    console.log('in the login function');
    $http.post('/login',$scope.loginUser)
      .then(function(response) {
        $scope.errorMessage = response.data.message;
        console.dir(response);
        console.dir(response.data.reqsession);
        window.location.assign(response.data.url);
      });
  }

  function logout() {
    console.log('in the logout function');
    $http.get('/logout')
      .then(function(response) {
        window.location.assign(response.data.url);
      });
  }
}