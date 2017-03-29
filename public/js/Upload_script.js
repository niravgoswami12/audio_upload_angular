var app = angular.module("uploadApp", []);

app.constant('api', {
    host: window.location.origin
});
app.factory("rootVar", function () {


    var _filebuf;
    return {
        filebuf: _filebuf
    };
});
app.directive('fileModel', ['$parse', 'rootVar', function ($parse, rootVar) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                var binaryString;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                        var file = element[0].files[0];
                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (readerEvt) {
                                binaryString = readerEvt.target.result;
                                rootVar.filebuf = btoa(binaryString);
                            };
                            reader.readAsBinaryString(file);
                        }


                    });
                });
            }
        };
    }]);
app.controller('UploadCtrl', function ($scope, $http, api, rootVar) {
    $scope.submit = function () {
        $scope.displayLoader(true);
        var file = document.getElementById('audiofile').value.replace(/\s/g, "_"),
                buf = rootVar.filebuf;
        if (file && buf) {
            $.post(api.host + '/uploadAudio', {filename: file, audiobuf: buf}).success(function (data, status) {
                $scope.displayLoader(false);
                if(data == 'exist' ){
                    document.getElementById('audiofile').value = null;
                    alert('File Already Exists!')
                }else if(data == 'OK'){
                    document.getElementById('audiofile').value = null;
                    alert('Successfully Uploaded!')
                }
            });
        } else {
            $scope.displayLoader(false);
            document.getElementById('audiofile').value = null;
            alert('please select file')
        }
    };
    $scope.displayLoader = function(flag){
        if(flag){
            $(".progress-indicator").show();
        }else{
            $(".progress-indicator").hide();
        }
    };
});