'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        'modules/core/client/css/mdPickers.css',
        'public/lib/perfect-scrollbar/css/perfect-scrollbar.min.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'modules/core/client/css/material-datepicker.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/lodash/lodash.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/fullcalendar/dist/gcal.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/js/mdPickers.js',
        'public/lib/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js',
        'public/lib/angular-perfect-scrollbar/src/angular-perfect-scrollbar.min.js',
        'public/lib/sweetalert/dist/sweetalert.min.js',
        'public/js/material-datepicker.min.js',
        'public/lib/ngstorage/ngStorage.min.js',
        'public/lib/md-collection-pagination/dist/md-collection-pagination.min.js',
        'public/lib/json-export-excel/dest/json-export-excel.min.js',
        'public/lib/file-saver/FileSaver.min.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
