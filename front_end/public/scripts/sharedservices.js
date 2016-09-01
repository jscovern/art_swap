angular.module('Art_Swap')
	.service('sharedservices', function($http) {
		this.$inject=["$http"];
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
		return this;
	});
