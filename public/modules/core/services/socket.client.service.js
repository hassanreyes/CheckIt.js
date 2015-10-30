'use strict';

angular.module('checkit').factory('socket', function ($rootScope, $location, socketFactory) {
  
    //var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    var url = $location.protocol() + '://' + $location.host() + ':8000';

    var socket = io.connect(url + '/workingOn', {
      transports: [
        'xhr-polling',
        'flashsocket', 
        'htmlfile', 
        'websocket',
        'jsonp-polling', 
        'polling'
      ]
    });
  
    var opts = { ioSocket : socket };
  
    return socketFactory(opts);
  
}).value('version', '0.1');
