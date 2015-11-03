'use strict';

module.exports = {
	app: {
		title: 'checkit',
		description: 'Web application tool for software inspections, giving the user the facilities to search, create and share checklists for a product or process. ',
		keywords: 'MongoDb, Express, AngularJS, Node.js, Inspections, checklist'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-ui-select/dist/select.css',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.css',
				'public/lib/allmighty-autocomplete/style/autocomplete.css',
				'public/resources/css/font-awesome/css/font-awesome.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.mini.js',
				'public/lib/es5-shim/es5-shim.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-ui-select/dist/select.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-elastic/elastic.js',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.js',
				'public/lib/checklist/chklst-edition.js',
				'public/lib/ng-file-upload/angular-file-upload.min.js',
				'public/lib/ng-file-upload/angular-file-upload-shim.min.js',
				'public/lib/ngFileReader/vendor/swfobject.js',
				'public/lib/ngFileReader/vendor/jquery.FileReader.js',
				'public/lib/ngFileReader/src/ngFileReader.js',
				'public/socket.io/socket.io.js',
				'public/lib/angular-socket-io/socket.min.js',
				'public/lib/allmighty-autocomplete/script/autocomplete.js',
				'public/lib/allmighty-autocomplete/script/app.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/angular-scroll-glue/src/scrollglue.js',
				'public/lib/angularjs-socialshare/dist/angular-socialshare.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
