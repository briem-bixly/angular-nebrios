(function(window, angular, undefined) {
    'use strict';
    angular.module('nebriosAngular', []).
    provider('nebriosAngular', function() {
        var _instanceName = null,
        me = this;
        this.setInstanceName = function(instance_name) {
            _instanceName = instance_name;
        };
        this._createNebriInstance = function() {
            if (_instanceName == null){
                throw new Error('Please provide your instance name via setInstanceName');
            }
        };
        this.$get = ['nebriosService', function(nebriosService) {
            me._createNebriInstance();
            return {
                api_request: function(api_module, view_name, method, payload){
                    var allowed_methods = ['get', 'post', 'put', 'delete', 'head', 'options'];
                    if (allowed_methods.indexOf(method) == -1){
                        throw new Error('Method ' + method + ' not supported.');
                    }
                    var url = 'https://' + _instanceName + '.nebrios.com/api/v1/'+api_module+'/'+view_name;
                    return nebriosService.request(url, method, payload);
            	}
            };
        }];
    }).factory('nebriosService', [
        '$http', function($http) {
            return {
                request: function(url, method, payload){
                    if (method == 'post' || method == 'put'){
                        return $http({
                            method: method,
                            url: url,
                            data: payload
                        });
                    } else if (method == 'get'){
                        return $http({
                            method: method,
                            url: url,
                            params: payload
                        });
                    } else {
                        return $http({
                            method: method,
                            url: url
                        });
                    }
                }
            }
        }
    ]);
})(window, window.angular);