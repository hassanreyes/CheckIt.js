'use strict';

angular.module('checkit').factory('socket', function ($rootScope, $location, socketFactory) {
  
    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var socket = io.connect(url + '/workingOn');

    var opts = { ioSocket : socket };
  
    return socketFactory(opts);
  
}).value('version', '0.1');
