angular.module('Art_Swap')
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ["$http","$scope","$routeParams",'Upload',"$timeout","sharedservices"];

function ProfileController($http,$scope,$routeParams,Upload,$timeout,sharedservices) {
	$scope.sharedservices = sharedservices;
  $scope.currentUser = {};
  $scope.createGallery = createGallery;
  $scope.newGallery = {status: true};
  var today = new Date();
  $scope.today = formatDate(today);  
  $scope.newWork = {added_on:$scope.today, swappable: true};
  $scope.createWorkInGallery = createWorkInGallery;
  $scope.getUserInfo = getUserInfo;
  $scope.createGroup = createGroup;
  $scope.newGroup ={created_on:$scope.today,status:true,active_users:[]};
  $scope.findMyGroups = findMyGroups;
  // $scope.createModalCarousel = createModalCarousel;
  $scope.getWorksInGallery = getWorksInGallery;

  function getUserInfo() {
    var id = $routeParams.id;
    $http.get('/api/user/'+id)
      .then(function(response) {
        $scope.currentUser = response.data.user;
        $scope.currentUser.galleryDocs = response.data.usergalleries;
      });
      sharedservices.canIUpdateProfile();
  }
  // getUserInfo();

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

  $scope.uploadWorkFiles = function(file, errFiles) {
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
    console.log('in the updateprofileimage, user._id is'+user._id);
    $http.put('/api/user/edit/'+user._id,user)
      .then(function(response) {
        console.log('in the then after putting the new image');
        console.dir(response);
      });
  }

  function createGallery() {
    $http.post('/api/gallery/new',$scope.newGallery)
      .then(function(response) {
        console.log('in the then after post, response is: ');
        console.dir(response);
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

  function createGroup() {
    var id = $routeParams.id;
    $scope.newGroup.created_by = id;
    $scope.newGroup.active_users.push(id);
    console.dir($scope.newGroup);
    $http.post('/api/group/new/'+id,$scope.newGroup)
      .then(function(response) {
        window.location.assign(response.data.url);
      });
  }

  function findMyGroups() {
    var id = $routeParams.id;
    console.log('in the findmygroups');
    $http.get('/api/user/groups/'+id)
    .then(function(response) {
      $scope.myGroups = response.data;
      console.log(response.data);
    });
  }

  function getWorksInGallery(gallery_id) {
    $http.get('/api/gallery/'+gallery_id)
      .then(function(response) {
        $scope.carouselData = response.data;
        console.log('ingetworksgallery');
        console.log(response.data);
        createModalCarousel();
      });
  }

  function createModalCarousel() {
    var currIndex = 0;
    $scope.active = 0;
    $scope.slides = [];
    for (var i=0; i<$scope.carouselData.length; i++) {
      $scope.addSlide(i);
    }
    $scope.addSlide = function(index) {
      $scope.slides.push($scope.carouselData[i]);
    };
  }

}