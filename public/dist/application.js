'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'donationstart';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
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
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('donations');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
			//templateUrl: 'modules/core/views/home.client.view.html'
			templateUrl: 'modules/donations/views/create-donation.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
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
		this.validateMenuExistance = function(menuId) {
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
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
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
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
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
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
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
	}
]);

'use strict';

// Setting up route
angular.module('donations').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listDonations', {
        url: '/donations',
        templateUrl: 'modules/donations/views/list-donations.client.view.html'
    });
    // state('createDonation', {
    //     url: '/donation/create',
    //     templateUrl: 'modules/donations/views/create-donation.client.view.html'
    // });
}
]);

'use strict';

angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location','Donations','Authentication','$window',
  function($scope, $stateParams, $location,Donations,Authentication,$window) {
    $scope.authentication = Authentication;

    $window.JR.apikey('jr-b5e6b58e33efd19cd84728b19d837c62');

    Donations.query(function(data){
        if (data[0]) {
            $scope.curSym = data[0]._id;
            $scope.balance = data[0].balance;
        } else {
            $scope.curSym = 'USD';
            $scope.balance = 0;
        }

    });

    if ($scope.authentication.user && $scope.authentication.user.provider === 'facebook') {
        $scope.fullName = $scope.authentication.user.displayName;
        $scope.email = $scope.authentication.user.email;
    }
    if ($scope.authentication.user && $scope.authentication.user.provider === 'twitter') {
        $scope.fullName = $scope.authentication.user.displayName;
        $scope.email = $scope.authentication.user.email;
    }
    $scope.create = function() {
        var donation = new Donations({
            fullName: this.fullName,
            email: this.email,
            organisation: this.organisation,
            amount: this.amount,
            currency: this.selectedCurrency.code
        });

        if (donation.currency !== 'USD') {
            $window.JR.from(donation.currency).to('USD').amount(donation.amount).convert(function(result) {
                donation.currency = result.to;
                donation.amount = result.amount;
                $scope.createRecord(donation);
            });
            return;
        }
        $scope.createRecord(donation);
    };

    $scope.createRecord = function(donation) {
        donation.$save(function(response) {
            $window.location.reload();
            $scope.fullName = '';
            $scope.email = '';
            $scope.organisation = '';
            $scope.amount = '';
            //$scope.currency = '';
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.find = function() {
        $scope.donations = Donations.query();
        //$scope.donations = 'this is test one.';
    };

    $scope.currencies = [
        {   code: 'AFN',
            text: 'Afghani',
        },
        {   code: 'EUR',
            text: 'Euro',
        },
        {   code: 'ALL',
            text: 'Lek',
        },
        {   code: 'DZD',
            text: 'Algerian Dinar',
        },
        {   code: 'USD',
            text: 'US Dollar',
        },
        {   code: 'AOA',
            text: 'Kwanza',
        },
        {   code: 'XCD',
            text: 'East Caribbean Dollar',
        },
        {   code: 'ARS',
            text: 'Argentine Peso',
        },
        {   code: 'AMD',
            text: 'Armenian Dram',
        },
        {   code: 'AWG',
            text: 'Aruban Florin',
        },
        {   code: 'AUD',
            text: 'Australian Dollar',
        },
        {   code: 'AZN',
            text: 'Azerbaijanian Manat',
        },
        {   code: 'BSD',
            text: 'Bahamian Dollar',
        },
        {   code: 'BHD',
            text: 'Bahraini Dinar',
        },
        {   code: 'BDT',
            text: 'Taka',
        },
        {   code: 'BBD',
            text: 'Barbados Dollar',
        },
        {   code: 'BYR',
            text: 'Belarussian Ruble',
        },
        {   code: 'BZD',
            text: 'Belize Dollar',
        },
        {   code: 'XOF',
            text: 'CF Franc BCEAO',
        },
        {   code: 'BMD',
            text: 'Bermudian Dollar',
        },
        {   code: 'BTN',
            text: 'Ngultrum',
        },
        {   code: 'INR',
            text: 'Indian Rupee',
        },
        {   code: 'BOB',
            text: 'Boliviano',
        },
        {   code: 'BOV',
            text: 'Mvdol',
        },
        {   code: 'BAM',
            text: 'Convertible Mark',
        },
        {   code: 'BWP',
            text: 'Pula',
        },
        {   code: 'NOK',
            text: 'Norwegian Krone',
        },
        {   code: 'BRL',
            text: 'Brazilian Real',
        },
        {   code: 'BND',
            text: 'Brunei Dollar',
        },
        {   code: 'BGN',
            text: 'Bulgarian Lev',
        },
        {   code: 'BIF',
            text: 'Burundi Franc',
        },
        {   code: 'KHR',
            text: 'Riel',
        },
        {   code: 'XAF',
            text: 'CF Franc BEAC',
        },
        {   code: 'CAD',
            text: 'Canadian Dollar',
        },
        {   code: 'CVE',
            text: 'Cabo Verde Escudo',
        },
        {   code: 'KYD',
            text: 'Cayman Islands Dollar',
        },
        {   code: 'CLF',
            text: 'Unidad de Fomento',
        },
        {   code: 'CLP',
            text: 'Chilean Peso',
        },
        {   code: 'CNY',
            text: 'Yuan Renminbi',
        },
        {   code: 'COP',
            text: 'Colombian Peso',
        },
        {   code: 'COU',
            text: 'Unidad de Valor Real',
        },
        {   code: 'KMF',
            text: 'Comoro Franc',
        },
        {   code: 'CDF',
            text: 'Congolese Franc',
        },
        {   code: 'NZD',
            text: 'New Zealand Dollar',
        },
        {   code: 'CRC',
            text: 'Cost Rican Colon',
        },
        {   code: 'HRK',
            text: 'Croatian Kuna',
        },
        {   code: 'CUC',
            text: 'Peso Convertible',
        },
        {   code: 'CUP',
            text: 'Cuban Peso',
        },
        {   code: 'ANG',
            text: 'Netherlands Antillean Guilder',
        },
        {   code: 'CZK',
            text: 'Czech Koruna',
        },
        {   code: 'DKK',
            text: 'Danish Krone',
        },
        {   code: 'DJF',
            text: 'Djibouti Franc',
        },
        {   code: 'DOP',
            text: 'Dominican Peso',
        },
        {   code: 'EGP',
            text: 'Egyptian Pound',
        },
        {   code: 'SVC',
            text: 'El Salvador Colon',
        },
        {   code: 'ERN',
            text: 'Nakfa',
        },
        {   code: 'ETB',
            text: 'Ethiopian Birr',
        },
        {   code: 'FKP',
            text: 'Falkland Islands Pound',
        },
        {   code: 'FJD',
            text: 'Fiji Dollar',
        },
        {   code: 'XPF',
            text: 'CFP Franc',
        },
        {   code: 'GMD',
            text: 'Dalasi',
        },
        {   code: 'GEL',
            text: 'Lari',
        },
        {   code: 'GHS',
            text: 'Ghan Cedi',
        },
        {   code: 'GIP',
            text: 'Gibraltar Pound',
        },
        {   code: 'GTQ',
            text: 'Quetzal',
        },
        {   code: 'GBP',
            text: 'Pound Sterling',
        },
        {   code: 'GNF',
            text: 'Guine Franc',
        },
        {   code: 'GYD',
            text: 'Guyan Dollar',
        },
        {   code: 'HTG',
            text: 'Gourde',
        },
        {   code: 'HNL',
            text: 'Lempira',
        },
        {   code: 'HKD',
            text: 'Hong Kong Dollar',
        },
        {   code: 'HUF',
            text: 'Forint',
        },
        {   code: 'ISK',
            text: 'Iceland Krona',
        },
        {   code: 'IDR',
            text: 'Rupiah',
        },
        {   code: 'XDR',
            text: 'SDR (Special Drawing Right)',
        },
        {   code: 'IRR',
            text: 'Iranian Rial',
        },
        {   code: 'IQD',
            text: 'Iraqi Dinar',
        },
        {   code: 'ILS',
            text: 'New Israeli Sheqel',
        },
        {   code: 'JMD',
            text: 'Jamaican Dollar',
        },
        {   code: 'JPY',
            text: 'Yen',
        },
        {   code: 'JOD',
            text: 'Jordanian Dinar',
        },
        {   code: 'KZT',
            text: 'Tenge',
        },
        {   code: 'KES',
            text: 'Kenyan Shilling',
        },
        {   code: 'KPW',
            text: 'North Korean Won',
        },
        {   code: 'KRW',
            text: 'Won',
        },
        {   code: 'KWD',
            text: 'Kuwaiti Dinar',
        },
        {   code: 'KGS',
            text: 'Som',
        },
        {   code: 'LAK',
            text: 'Kip',
        },
        {   code: 'LBP',
            text: 'Lebanese Pound',
        },
        {   code: 'LSL',
            text: 'Loti',
        },
        {   code: 'ZAR',
            text: 'Rand',
        },
        {   code: 'LRD',
            text: 'Liberian Dollar',
        },
        {   code: 'LYD',
            text: 'Libyan Dinar',
        },
        {   code: 'CHF',
            text: 'Swiss Franc',
        },
        {   code: 'LTL',
            text: 'Lithuanian Litas',
        },
        {   code: 'MOP',
            text: 'Pataca',
        },
        {   code: 'MKD',
            text: 'Denar',
        },
        {   code: 'MGA',
            text: 'Malagasy riary',
        },
        {   code: 'MWK',
            text: 'Kwacha',
        },
        {   code: 'MYR',
            text: 'Malaysian Ringgit',
        },
        {   code: 'MVR',
            text: 'Rufiyaa',
        },
        {   code: 'MRO',
            text: 'Ouguiya',
        },
        {   code: 'MUR',
            text: 'Mauritius Rupee',
        },
        {   code: 'XUA',
            text: 'ADB Unit of ccount',
        },
        {   code: 'MXN',
            text: 'Mexican Peso',
        },
        {   code: 'MXV',
            text: 'Mexican Unidad de Inversion (UDI)',
        },
        {   code: 'MDL',
            text: 'Moldovan Leu',
        },
        {   code: 'MNT',
            text: 'Tugrik',
        },
        {   code: 'MAD',
            text: 'Moroccan Dirham',
        },
        {   code: 'MZN',
            text: 'Mozambique Metical',
        },
        {   code: 'MMK',
            text: 'Kyat',
        },
        {   code: 'NAD',
            text: 'Namibi Dollar',
        },
        {   code: 'NPR',
            text: 'Nepalese Rupee',
        },
        {   code: 'NIO',
            text: 'Cordob Oro',
        },
        {   code: 'NGN',
            text: 'Naira',
        },
        {   code: 'OMR',
            text: 'Rial Omani',
        },
        {   code: 'PKR',
            text: 'Pakistan Rupee',
        },
        {   code: 'PAB',
            text: 'Balboa',
        },
        {   code: 'PGK',
            text: 'Kina',
        },
        {   code: 'PYG',
            text: 'Guarani',
        },
        {   code: 'PEN',
            text: 'Nuevo Sol',
        },
        {   code: 'PHP',
            text: 'Philippine Peso',
        },
        {   code: 'PLN',
            text: 'Zloty',
        },
        {   code: 'QAR',
            text: 'Qatari Rial',
        },
        {   code: 'RON',
            text: 'New Romanian Leu',
        },
        {   code: 'RUB',
            text: 'Russian Ruble',
        },
        {   code: 'RWF',
            text: 'Rwand Franc',
        },
        {   code: 'SHP',
            text: 'Saint Helen Pound',
        },
        {   code: 'WST',
            text: 'Tala',
        },
        {   code: 'STD',
            text: 'Dobra',
        },
        {   code: 'SAR',
            text: 'Saudi Riyal',
        },
        {   code: 'RSD',
            text: 'Serbian Dinar',
        },
        {   code: 'SCR',
            text: 'Seychelles Rupee',
        },
        {   code: 'SLL',
            text: 'Leone',
        },
        {   code: 'SGD',
            text: 'Singapore Dollar',
        },
        {   code: 'XSU',
            text: 'Sucre',
        },
        {   code: 'SBD',
            text: 'Solomon Islands Dollar',
        },
        {   code: 'SOS',
            text: 'Somali Shilling',
        },
        {   code: 'SSP',
            text: 'South Sudanese Pound',
        },
        {   code: 'LKR',
            text: 'Sri Lank Rupee',
        },
        {   code: 'SDG',
            text: 'Sudanese Pound',
        },
        {   code: 'SRD',
            text: 'Surinam Dollar',
        },
        {   code: 'SZL',
            text: 'Lilangeni',
        },
        {   code: 'SEK',
            text: 'Swedish Krona',
        },
        {   code: 'CHE',
            text: 'WIR Euro',
        },
        {   code: 'CHW',
            text: 'WIR Franc',
        },
        {   code: 'SYP',
            text: 'Syrian Pound',
        },
        {   code: 'TWD',
            text: 'New Taiwan Dollar',
        },
        {   code: 'TJS',
            text: 'Somoni',
        },
        {   code: 'TZS',
            text: 'Tanzanian Shilling',
        },
        {   code: 'THB',
            text: 'Baht',
        },
        {   code: 'TOP',
            text: 'Pa’anga',
        },
        {   code: 'TTD',
            text: 'Trinidad nd Tobago Dollar',
        },
        {   code: 'TND',
            text: 'Tunisian Dinar',
        },
        {   code: 'TRY',
            text: 'Turkish Lira',
        },
        {   code: 'TMT',
            text: 'Turkmenistan New Manat',
        },
        {   code: 'UGX',
            text: 'Ugand Shilling',
        },
        {   code: 'UAH',
            text: 'Hryvnia',
        },
        {   code: 'AED',
            text: 'UAE Dirham',
        },
        {   code: 'USN',
            text: 'US Dollar (Next day)',
        },
        {   code: 'UYI',
            text: 'Uruguay Peso en Unidades Indexadas (URUIURUI)',
        },
        {   code: 'UYU',
            text: 'Peso Uruguayo',
        },
        {   code: 'UZS',
            text: 'Uzbekistan Sum',
        },
        {   code: 'VUV',
            text: 'Vatu',
        },
        {   code: 'VEF',
            text: 'Bolivar',
        },
        {   code: 'VND',
            text: 'Dong',
        },
        {   code: 'YER',
            text: 'Yemeni Rial',
        },
        {   code: 'ZMW',
            text: 'Zambian Kwacha',
        },
        {   code: 'ZWL',
            text: 'Zimbabwe Dollar',
        }
    ];
    $scope.selectedCurrency = $scope.currencies[4];
}
]);

'use strict';

//Donations service used for communicating with the donations REST endpoints
angular.module('donations').factory('Donations', ['$resource',
	function($resource) {
		return $resource('donations/:donationid', {
			donationid: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
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
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);