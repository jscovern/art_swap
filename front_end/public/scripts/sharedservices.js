angular.module('Art_Swap')
	.service('sharedservices', function($http,$routeParams) {
		this.$inject=["$http","$routeParams"];
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
				console.log("user_id: "+user_id);
				console.log("whoIsLoggedIn: "+whoIsLoggedIn);
				return user_id == whoIsLoggedIn;
			};

			this.canIUpdateGroup = function() {
				var user_id = $routeParams.id;
			}
		return this;
	});
