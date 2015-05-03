'use strict';

module.exports = {
	db: 'mongodb://localhost/donationstart-dev',
	app: {
		title: 'DonationStart - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '485128424848257',
		clientSecret: process.env.FACEBOOK_SECRET || 'a094ee0ab6977611159dce14d2cfcd3f',
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
