'use strict';

angular.module('checkit').factory('socket', function ($rootScope, $location, socketFactory) {
  
    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var woSocket = io.connect(url + '/workingOn');
    var chSocket = io.connect(url + '/chat');

    var hub = {
        workingOn   : socketFactory({ ioSocket : woSocket }),
        chat        : socketFactory({ ioSocket : chSocket }),
    }

    return hub;

}).value('version', '0.1');
