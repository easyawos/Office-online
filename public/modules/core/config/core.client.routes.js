'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).

		state('userhome', {
			url: '/userhome',
			templateUrl: 'modules/core/views/userhome.client.view.html'
		}).

		state('adminhome', {
			url:'/adminhome',
			templateUrl:'modules/core/views/adminhome.client.view.html'
		});
	}
]);