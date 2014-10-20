'use strict';

// Configuring the Articles module
angular.module('blogs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Discussions', 'blogs', 'dropdown', '/blogs(/create)?');
		Menus.addSubMenuItem('topbar', 'blogs', 'List discussions', 'blogs');
		Menus.addSubMenuItem('topbar', 'blogs', 'New discussion', 'blogs/create');
	}
]);