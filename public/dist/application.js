'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'Online Office';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload'
      ];
    // var applicationModuleVendorDependencies = ['btford.socket-io','ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('answers');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('blogs');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('comments');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
//Setting up route
angular.module('answers').config([
  '$stateProvider',
  function ($stateProvider) {
    // Answers state routing
    $stateProvider.state('listAnswers', {
      url: '/answers',
      templateUrl: 'modules/answers/views/list-answers.client.view.html'
    }).state('createAnswer', {
      url: '/answers/create',
      templateUrl: 'modules/answers/views/create-answer.client.view.html'
    }).state('viewAnswer', {
      url: '/answers/:answerId',
      templateUrl: 'modules/answers/views/view-answer.client.view.html'
    }).state('editAnswer', {
      url: '/answers/:answerId/edit',
      templateUrl: 'modules/answers/views/edit-answer.client.view.html'
    });
  }
]);'use strict';
// Answers controller
angular.module('answers').controller('AnswersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Answers',
  function ($scope, $stateParams, $location, Authentication, Answers) {
    $scope.authentication = Authentication;
    // Create new Answer
    $scope.create = function () {
      // Create new Answer object
      var answer = new Answers({ answer: this.answer });
      // Redirect after save
      answer.$save(function (response) {
        $location.path('answers/' + response._id);  // Clear form fields
                                                    // $scope.answer = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Answer
    $scope.remove = function (answer) {
      if (answer) {
        answer.$remove();
        for (var i in $scope.answers) {
          if ($scope.answers[i] === answer) {
            $scope.answers.splice(i, 1);
          }
        }
      } else {
        $scope.answer.$remove(function () {
          $location.path('answers');
        });
      }
    };
    // Update existing Answer
    $scope.update = function () {
      var answer = $scope.answer;
      answer.$update(function () {
        $location.path('answers/' + answer._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Answers
    $scope.find = function () {
      $scope.answers = Answers.query();
    };
    // Find existing Answer
    $scope.findOne = function () {
      $scope.answer = Answers.get({ answerId: $stateParams.answerId });
    };
  }
]);'use strict';
//Answers service used to communicate Answers REST endpoints
angular.module('answers').factory('Answers', [
  '$resource',
  function ($resource) {
    return $resource('projects/:projectId/answers/:answerId', {
      projectId: '@project',
      answerId: '@_id'
    }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('blogs').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Discussions', 'blogs', 'dropdown', '/blogs(/create)?');
    Menus.addSubMenuItem('topbar', 'blogs', 'List discussions', 'blogs');
    Menus.addSubMenuItem('topbar', 'blogs', 'New discussion', 'blogs/create');
  }
]);'use strict';
// Setting up route
angular.module('blogs').config([
  '$stateProvider',
  function ($stateProvider) {
    // Blogs state routing
    $stateProvider.state('listBlogs', {
      url: '/blogs',
      templateUrl: 'modules/blogs/views/list-blogs.client.view.html'
    }).state('createBlog', {
      url: '/blogs/create',
      templateUrl: 'modules/blogs/views/create-blog.client.view.html'
    }).state('viewBlog', {
      url: '/blogs/:blogId',
      templateUrl: 'modules/blogs/views/view-blog.client.view.html'
    }).state('editBlog', {
      url: '/blogs/:blogId/edit',
      templateUrl: 'modules/blogs/views/edit-blog.client.view.html'
    });
  }
]);'use strict';
angular.module('blogs').controller('BlogsController', [
  '$scope',
  '$http',
  '$stateParams',
  '$location',
  'Authentication',
  'Api',
  function ($scope, $http, $stateParams, $location, Authentication, Api) {
    $scope.authentication = Authentication;
    $scope.addComments = function () {
      $scope.commentForm = true;
    };
    $scope.create = function () {
      var blog = new Api.Blogs({
          title: this.title,
          content: this.content
        });
      blog.$save(function (response) {
        $location.path('blogs/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // create comment
    $scope.createComment = function () {
      $scope.commentForm = false;
      // Create new Comment object
      var comment = new Api.Comments({
          comment: this.comment,
          blog: $stateParams.blogId
        });
      // Redirect after save
      comment.$save(function (response) {
        var blogId = $stateParams.blogId;
        $location.path('blogs/' + blogId);
        // Clear form fields
        $scope.comment = '';
        $scope.findOne();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (blog) {
      if (blog) {
        blog.$remove();
        for (var i in $scope.blogs) {
          if ($scope.blogs[i] === blog) {
            $scope.blogs.splice(i, 1);
          }
        }
      } else {
        $scope.blog.$remove(function () {
          $location.path('blogs');
        });
      }
    };
    $scope.update = function () {
      var blog = $scope.blog;
      blog.$update(function () {
        $location.path('blogs/' + blog._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.blogs = Api.Blogs.query();
    };
    $scope.findRecent = function () {
      $scope.blogs = Api.Blogs.query({ count: 5 });
    };
    $scope.findOne = function () {
      $scope.commentForm = false;
      $scope.blog = Api.Blogs.get({ blogId: $stateParams.blogId });
      $scope.blogComments = Api.Comments.query({ blogId: $stateParams.blogId });
    };
  }
]);'use strict';
angular.module('blogs').factory('Api', [
  '$resource',
  function ($resource) {
    return {
      Blogs: $resource('blogs/:blogId', { blogId: '@_id' }, { update: { method: 'PUT' } }),
      Comments: $resource('/blogs/:blogId/comments', { blogId: '@blog' }, { update: { method: 'PUT' } })
    };
  }
]);  //Articles service used for communicating with the articles REST endpoints
     // angular.module('blogs').factory('Blogs', ['$resource',
     // 	function($resource) {
     // 		return $resource('blogs/:blogId', {
     // 			blogId: '@_id'
     // 		}, {
     // 			update: {
     // 				method: 'PUT'
     // 			}
     // 		});
     // 	}
     // ]);
// 'use strict';
// // Configuring the Articles module
// angular.module('comments').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Comments', 'comments', 'dropdown', '/comments(/create)?');
// 		Menus.addSubMenuItem('topbar', 'comments', 'List Comments', 'comments');
// 		Menus.addSubMenuItem('topbar', 'comments', 'New Comment', 'comments/create');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('comments').config([
  '$stateProvider',
  function ($stateProvider) {
    // Comments state routing
    $stateProvider.state('listComments', {
      url: '/comments',
      templateUrl: 'modules/comments/views/list-comments.client.view.html'
    }).state('createComment', {
      url: '/comments/create',
      templateUrl: 'modules/comments/views/create-comment.client.view.html'
    }).state('viewComment', {
      url: '/comments/:commentId',
      templateUrl: 'modules/comments/views/view-comment.client.view.html'
    }).state('editComment', {
      url: '/comments/:commentId/edit',
      templateUrl: 'modules/comments/views/edit-comment.client.view.html'
    });
  }
]);'use strict';
// Comments controller
angular.module('comments').controller('CommentsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Comments',
  function ($scope, $stateParams, $location, Authentication, Comments) {
    $scope.authentication = Authentication;
    // Create new Comment
    $scope.create = function () {
      // Create new Comment object
      var comment = new Comments({ comment: this.comment });
      // Redirect after save
      comment.$save(function (response) {
        $location.path('comments/' + response._id);
        // Clear form fields
        $scope.comment = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Comment
    $scope.remove = function (comment) {
      if (comment) {
        comment.$remove();
        for (var i in $scope.comments) {
          if ($scope.comments[i] === comment) {
            $scope.comments.splice(i, 1);
          }
        }
      } else {
        $scope.comment.$remove(function () {
          $location.path('comments');
        });
      }
    };
    // Update existing Comment
    $scope.update = function () {
      var comment = $scope.comment;
      comment.$update(function () {
        $location.path('comments/' + comment._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Comments
    $scope.find = function () {
      $scope.comments = Comments.query();
    };
    // Find existing Comment
    $scope.findOne = function () {
      $scope.comment = Comments.get({ commentId: $stateParams.commentId });
    };
  }
]);'use strict';
//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', [
  '$resource',
  function ($resource) {
    return $resource('blogs/:blogId/comments/:commentId', {
      commentId: '@_id',
      blogId: '@blog'
    }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('userhome', {
      url: '/userhome',
      templateUrl: 'modules/core/views/userhome.client.view.html'
    }).state('adminhome', {
      url: '/adminhome',
      templateUrl: 'modules/core/views/adminhome.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';  //socket factory that provides the socket service
               // angular.module('core').factory('Socket', ['socketFactory',
               //     function(socketFactory) {
               //         return socketFactory({
               //             prefix: '',
               //             ioSocket: io.connect('http://localhost:3000')
               //         });
               //     }
               // ]);
'use strict';
// Configuring the Articles module
angular.module('projects').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
    Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
    Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
  }
]);'use strict';
// Setting up route
angular.module('projects').config([
  '$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/views/list-projects.client.view.html'
    }).state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/views/create-project.client.view.html'
    }).state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/views/view-project.client.view.html'
    }).state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/views/edit-project.client.view.html'
    });
  }
]);'use strict';
angular.module('projects').controller('ProjectsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$upload',
  '$timeout',
  'Authentication',
  'Projects',
  'Answers',
  function ($scope, $stateParams, $location, $upload, $timeout, Authentication, Projects, Answers) {
    $scope.authentication = Authentication;
    // onFileSelect directive
    $scope.onFileSelect = function ($files) {
      $scope.uploadedFile = [];
      $scope.answerUrl = [];
      $scope.selectedFiles = $files;
      for (var i = 0; i < $files.length; i++) {
        var $file = $files[i];
        $scope.start(i);
      }
    };
    $scope.start = function (indexOftheFile) {
      alert('Uploading file, please wait');
      var formData = {
          key: $scope.selectedFiles[indexOftheFile].name,
          AWSAccessKeyId: 'AKIAJQYBMDUWZVLR6ZGA',
          acl: 'private',
          policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtvbWljYnVja2V0In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
          signature: 'CNs+4S/Ms5sCgbITIksXcyHBgas=',
          filename: $scope.selectedFiles[indexOftheFile].name,
          'Content-Type': $scope.selectedFiles[indexOftheFile].type
        };
      $scope.uploadedFile[indexOftheFile] = $upload.upload({
        url: 'https://komicbucket.s3-us-west-2.amazonaws.com/',
        method: 'POST',
        headers: { 'Content-Type': $scope.selectedFiles[indexOftheFile].type },
        data: formData,
        file: $scope.selectedFiles[indexOftheFile]
      });
      $scope.uploadedFile[indexOftheFile].then(function (response) {
        $timeout(function () {
          var ansUrl = 'https://komicbucket.s3-us-west-2.amazonaws.com/' + $scope.selectedFiles[indexOftheFile].name;
          $scope.answerUrl.push(ansUrl);
          $scope.createAnswer($scope.answerUrl);
        });
      }, function (response) {
      }, function (evt) {
      });
      $scope.uploadedFile[indexOftheFile].xhr(function (xhr) {
      });
    };
    // create answer
    $scope.createAnswer = function (ANS) {
      // Create new Answer object
      var answer = new Answers({ answer: ANS });
      // Redirect after save
      answer.$save({ projectId: $stateParams.projectId }, function (response) {
        var projectId = $stateParams.projectId;
        $location.path('projects/' + projectId);
        // Clear form fields
        $scope.findOne();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.create = function () {
      var project = new Projects({
          title: this.title,
          content: this.content
        });
      project.answer = $scope.files;
      project.$save(function (response) {
        $location.path('projects/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (project) {
      if (project) {
        project.$remove();
        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          $location.path('projects');
        });
      }
    };
    $scope.update = function () {
      var project = $scope.project;
      project.$update(function () {
        $location.path('projects/' + project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.projects = Projects.query();
    };
    $scope.findOne = function () {
      $scope.project = Projects.get({ projectId: $stateParams.projectId });
      $scope.projectAnswers = Answers.query({ projectId: $stateParams.projectId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('projects').factory('Projects', [
  '$resource',
  function ($resource) {
    return $resource('projects/:projectId', { projectId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('Answers', [
  '$resource',
  function ($resource) {
    return $resource('projects/:projectId/answers', { projectId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('users').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Users', 'users', 'dropdown');
    Menus.addSubMenuItem('topbar', 'users', 'List Users', 'users');
    Menus.addSubMenuItem('topbar', 'users', 'New User', 'signup');
  }
]);
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('NewUser', {
      url: '/users/create',
      templateUrl: 'modules/users/views/create-users.client.view.html'
    }).state('listUsers', {
      url: '/users',
      templateUrl: 'modules/users/views/list-users.client.view.html'
    }).state('viewUser', {
      url: '/users/:userId',
      templateUrl: 'modules/users/views/view-user.client.view.html'
    }).state('editUser', {
      url: '/users/:userId/edit',
      templateUrl: 'modules/users/views/edit-user.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        $scope.credentials = '';
        alert('User Successfully Created');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful assign the response to the global user model
        $scope.authentication.user = response;
        if ($scope.authentication.user.roles[0] === 'user') {
          $location.path('/userhome');
        } else {
          // And redirect to the index page
          $location.path('/adminhome');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('UsersController', [
  '$scope',
  '$http',
  '$stateParams',
  '$location',
  'Authentication',
  'Users',
  function ($scope, $http, $stateParams, $location, Authentication, Users) {
    $scope.authentication = Authentication;
    $scope.find = function () {
      $scope.users = Users.query();
    };
    $scope.findOne = function () {
      $scope.user = Users.get({ userId: $stateParams.userId }, function () {
        $scope.user.isAdmin = $scope.user.roles.indexOf('admin') === 0;
      });
    };
    $scope.remove = function (user) {
      if (user) {
        user.$remove();
        for (var i in $scope.users) {
          if ($scope.users[i] === user) {
            $scope.users.splice(i, 1);
          }
        }
      } else {
        $scope.user.$remove(function () {
          $location.path('users');
        });
      }
    };
    $scope.update = function () {
      var user = $scope.user;
      user.$update(function () {
        $location.path('users/' + user._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users/:userId', { userId: '@_id' }, { update: { method: 'PUT' } });
  }
]);