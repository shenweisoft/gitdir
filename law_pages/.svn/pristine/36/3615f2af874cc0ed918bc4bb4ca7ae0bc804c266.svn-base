'use strict';

angular.module('sbAdminApp').factory('CameraService', function($http, AdjustConfig) {
    return {
    	cameraMultUpload: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.cameraMultUploadurl,
                data: data,
                transformRequest: angular.identity,
                headers: {
                	 'Content-Type': undefined
                    }
            })
        },cameraMultUploadIntodb: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.uploadMultSignFileurl,
                data: data.files,
                transformRequest: angular.identity,
                headers: {
                	 'Content-Type': undefined
                    }
            })
        }
    };
});


