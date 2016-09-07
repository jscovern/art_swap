angular.module('Art_Swap')
  .controller('UserController', UserController)
  .config(function($routeProvider,$locationProvider){
    $routeProvider
    .when('/', {
      templateUrl: "/templates/home.html"
    })
    .when('/login', {
      templateUrl: "/templates/home.html",
      // controller: "UserController"
    })
    .when('/register', {
    	templateUrl: "/templates/register.html",
    	controller: "UserController"
    })
    .when('/profile/:id', {
      templateUrl: "/templates/profile_show.html",
      controller: "UserController"
    })
    .when('/addGallery/:id', {
      templateUrl: "/templates/newgallery.html"
    })
    .when('/addWork/:id', {
      templateUrl: "/templates/new_work.html"
    })
    .when('/work/:id', {
      templateUrl: "/templates/work_show.html"
    })
    // .when('/mygroups/:id', {
    //   templateUrl: "/templates/my_groups.html"
    // })
    // .when('/groups/new/:id', {
    //   templateUrl: "/templates/new_group.html"
    // })
    // .when('/addToGroup/:id', {
    //   templateUrl: "/templates/adduserstogroup.html"
    // })
    .when('/usersToSwapWith', {
      templateUrl: "/templates/usersToSwapWith.html"
    });
  });
  // .directive('backgroundUrl', function(){
  //   console.log('in the directive');
  //   return function(scope, element, attrs) {
  //   console.log('attrs.backgroundUrl '+attrs.backgroundUrl);

  //     var url = attrs.backgroundUrl;
  //     element.css({
  //       'background' : 'url('+url+')'
  //     });
  //   };
  

UserController.$inject = ["$http","$scope","$routeParams","sharedservices"];

function UserController($http,$scope,$routeParams,sharedservices) {
  $scope.sharedservices = sharedservices;
  $scope.message = "";
  $scope.errorMessage = "";
  $scope.login = login;
	$scope.createNewUser = createNewUser;
  $scope.logout = logout;
  var today = new Date();
  $scope.today = formatDate(today);
  $scope.newUser = {admin_user: false, join_date: $scope.today, img_url: "", liked_works: []};
  $scope.loginUser = {};
  $scope.getAllUsers = getAllUsers;
  // $scope.addUserToGroup = addUserToGroup;

	function createNewUser() {
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
    return formatted;
  }

  function login() {
    $http.post('/login',$scope.loginUser)
      .then(function(response) {
        $scope.message = response.data.message;
        sharedservices.setWhoIsLoggedIn(response.data.user._id);
        localStorage.setItem('user_id',response.data.user._id);
        localStorage.setItem('loggedIn',true);
        window.location.assign(response.data.url);
      });
  }

  function logout() {
    $http.get('/logout')
      .then(function(response) {
        sharedservices.setWhoIsLoggedIn("");
        localStorage.setItem('user_id',"");
        localStorage.setItem('loggedIn',false);
        sharedservices.loggedIn = false;
        window.location.assign(response.data.url);
      });
  }

  function getAllUsers() {
    $http.get('/api/users')
      .then(function(response) {
        $scope.allUsers = response.data;
      });
  }
//groups have been sidelined until later development.
  // function addUserToGroup(user_id) {
  //   group_id = $routeParams.id;
  //   var postData = {group_id: group_id, user_id: user_id};
  //   $http.post('/api/usersingroup/new', postData)
  //     .then(function(response) {
  //     });
  // }

}