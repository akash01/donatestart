'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + ('heroku_app36431319:9q3hrv8hg6vpmc3f64e8b4lc9u@ds037571.mongolab.com:37571' || 'localhost') + '/heroku_app36431319',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/angularjs-toaster/toaster.min.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/ng-countUp.js/ngCountUp.min.js',
				'public/lib/countUp.js/countUp.min.js',
				'public/lib/angularjs-toaster/toaster.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '928622827190044',
		clientSecret: process.env.FACEBOOK_SECRET || 'ff6cbc9f56faa97e9ad0683c4dd5ec8b',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'PrmULMUKPyLaJIdQMoj2l771S',
		clientSecret: process.env.TWITTER_SECRET || 'FwJPRTYyUOYyLzfHsm3yBHcyTrCiI9QvCxuQMKyklNyxafungy',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '385209255013-nd7na617iuf4csfmc80ece4r69befti9.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'PNICcQYklJG5KCzWFhKVucU5',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
