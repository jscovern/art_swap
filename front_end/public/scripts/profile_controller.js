angular.module('Art_Swap')
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ["$http","$scope","$routeParams"];

function ProfileController($http,$scope,$routeParams) {
	$scope.currentUser = {};
  $scope.profilePicChange = profilePicChange;

  function getUserInfo() {
    var id = $routeParams.id;
    console.log(id);
    $http.get('/api/user/'+id)
      .then(function(response) {
        $scope.currentUser = response.data.user;
      });
  }
  getUserInfo();

  function profilePicChange() {
    
  }

}