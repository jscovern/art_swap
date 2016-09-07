angular.module('Art_Swap')
	.service('sharedservices', function($http,$routeParams,$location,$window) {
		this.$inject=["$http","$routeParams","$location","$window"];
		var whoIsLoggedIn = "";
		var self=this;
			
		this.setWhoIsLoggedIn=function(user_id) {
			whoIsLoggedIn = user_id;
		};
		
		this.getWhoIsLoggedIn=function() {
			return whoIsLoggedIn;
		};
		
		this.loggedIn=function() {
			return whoIsLoggedIn !=="";
		};
		
		this.logout=function() {
			$http.get('/logout')
				.then(function(response) {
					self.setWhoIsLoggedIn("");
			        localStorage.setItem('user_id',"");
			        localStorage.setItem('loggedIn',false);
					window.location.assign(response.data.url);
				});
		};

		this.canIUpdateProfile=function() {
			var user_id = $routeParams.id;
			return user_id == whoIsLoggedIn;
		};

		this.canIUpdateGroup = function() {
			var user_id = $routeParams.id;
		};

		this.currentPath = function() {
			return $location.path();
		};

		this.goBack = function() {
		    $window.history.back();
		};

		return this;
	});
