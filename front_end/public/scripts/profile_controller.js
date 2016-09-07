angular.module('Art_Swap')
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ["$http","$scope","$routeParams",'Upload',"$timeout","sharedservices","$window"];

function ProfileController($http,$scope,$routeParams,Upload,$timeout,sharedservices,$window) {
	$scope.sharedservices = sharedservices;
  $scope.currentUser = {};
  $scope.createGallery = createGallery;
  $scope.newGallery = {status: true};
  var today = new Date();
  $scope.today = formatDate(today);  
  $scope.newWork = {added_on:$scope.today, swappable: true, liked_by: []};
  $scope.createWorkInGallery = createWorkInGallery;
  $scope.getUserInfo = getUserInfo;
  $scope.getWorkInfo = getWorkInfo;
  // $scope.createGroup = createGroup;
  // $scope.newGroup ={created_on:$scope.today,status:true,active_users:[]};
  // $scope.findMyGroups = findMyGroups;
  $scope.carouselInterval = 6000;
  $scope.likeThisWork = likeThisWork;
  $scope.findMySwaps = findMySwaps;

  function getUserInfo() {
    var id = $routeParams.id;
    if(id) { //only run the get if actually on a users page - home page doesn't have an id etc..
      $http.get('/api/user/'+id)
        .then(function(response) {
          $scope.currentUser = response.data.user;
          $scope.currentUser.galleryDocs = response.data.usergalleries;
        });
        sharedservices.canIUpdateProfile();
    }
  }
  // getUserInfo();

  $scope.uploadFiles = function(file, errFiles) {
    var reader = new FileReader();
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

  $scope.uploadWorkFiles = function(file, errFiles) {
    var reader = new FileReader();
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
                      $scope.newWork.img_url = response.data.data.link;
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
    $http.put('/api/user/edit/'+user._id,user)
      .then(function(response) {
      });
  }

  function createGallery() {
    $http.post('/api/gallery/new',$scope.newGallery)
      .then(function(response) {
        window.location.assign(response.data.url);
      });
  }

  function createWorkInGallery() {
    var id = $routeParams.id;
    $http.post('/api/work/new/'+id, $scope.newWork) 
      .then(function(response) {
        window.location.assign(response.data.url);
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

  function getWorkInfo() {
    var id = $routeParams.id;
    $http.get('/api/work/'+id)
      .then(function(response) {
        $scope.currentWork = response.data.work;
      });
  }

  function likeThisWork() {
    console.log('in likethiswork');
    var work_id = $routeParams.id;
    console.log('work_id is: '+work_id);
    var user_id = {user_id: sharedservices.getWhoIsLoggedIn()};
    console.log('user_id: '+user_id);
    $http.post('/api/likethiswork/'+work_id, user_id)
      .then(function(response) {
        console.log(response);
      });
  }

  function findMySwaps() {
    $http.get('/api/myswaps/'+sharedservices.getWhoIsLoggedIn())
      .then(function(response) {
        $scope.mySwaps = response.data;
        console.dir($scope.mySwaps);
      });
  }

//groups has been sidelined until a future date. keeping code in case needed later.
  // function createGroup() {
  //   var id = $routeParams.id;
  //   $scope.newGroup.created_by = id;
  //   $scope.newGroup.active_users.push(id);
  //   console.dir($scope.newGroup);
  //   $http.post('/api/group/new/'+id,$scope.newGroup)
  //     .then(function(response) {
  //       window.location.assign(response.data.url);
  //     });
  // }

  // function findMyGroups() {
  //   var id = $routeParams.id;
  //   console.log('in the findmygroups');
  //   $http.get('/api/user/groups/'+id)
  //   .then(function(response) {
  //     $scope.myGroups = response.data;
  //     console.log(response.data);
  //   });
  // }
}