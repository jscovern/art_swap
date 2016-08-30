angular.module('Art_Swap')
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ["$http","$scope","$routeParams",'Upload',"$timeout"];

function ProfileController($http,$scope,$routeParams,Upload,$timeout) {
	$scope.currentUser = {};

  function getUserInfo() {
    var id = $routeParams.id;
    console.log(id);
    $http.get('/api/user/'+id)
      .then(function(response) {
        $scope.currentUser = response.data.user;
      });
  }
  getUserInfo();

      $scope.uploadFiles = function(file, errFiles) {
        var reader = new FileReader();
        console.log('file is: ');
        console.dir(file);
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    // file.result = response.data;
                    var fd= new FormData();
                    fd.append('image',file);
                    $http.post('https://api.imgur.com/3/image',fd,{transformRequest: angular.identity, headers: {'Content-Type':undefined,'Authorization': 'Client-ID b848b6ac15252cc'}})
                      .then(function(response) {
                        $scope.currentUser.img_url = response.data.data.link;
                        updateProfileImage($scope.currentUser);
                      });
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    };

    function updateProfileImage(user) {
      console.log('in the updateprofileimage, user._id is'+user._id);
      $http.put('/api/user/edit/'+user._id,user)
        .then(function(response) {
          console.log('in the then after putting the new image');
          console.dir(response);
        });
    }

}