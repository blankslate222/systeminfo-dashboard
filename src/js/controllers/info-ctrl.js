/**
 * Created by admin on 1/27/2016.
 */
angular
    .module('RDash')
    .controller('InfoCtrl', ['$scope','$http', InfoCtrl]);

function InfoCtrl($scope, $http) {

    $scope.getHostInfo = function() {
        var hostinfoArr = []
        $http.get('http://localhost:8181/hostmachineinfo').success(function(data) {
            var datastring = JSON.stringify(data);
            var resp = JSON.parse(datastring)
            parseJsonData(resp, hostinfoArr)
            $scope.hostinfo = hostinfoArr;
        });
        function parseJsonData(jsonObj, jsonArr) {
            for(var key in jsonObj) {
                var val = jsonObj[key];
                if ( val ) {
                    if (typeof val == 'object') {
                        parseJsonData(val, jsonArr);
                    } else {
                        if (key == '_id') {
                            continue;
                        }
                        jsonArr.push({
                            infoname : key.toUpperCase(),
                            infovalue : val
                        });
                    }
                }
            }
        }
    }
    $scope.getProcessInfo = function() {
        $http.get("http://localhost:8181/processes").success(function(data) {
            var datastring = JSON.stringify(data);
            var resp = JSON.parse(datastring);
            $scope.num_of_processes = resp.length
            $scope.processinfo = resp;
        });
    }

    $scope.getProgramsInfo = function() {
        $http.get("http://localhost:8181/programs").success(function(data) {
            var msgArr = []
            var datastring = JSON.stringify(data);
            var resp = JSON.parse(datastring);
            $scope.num_of_programs = resp.length
            $scope.programinfo = resp;
            var num_issues = 0;
            for (var i = 0; i < resp.length; i++) {
                if (resp[i].needsupdate) {
                    num_issues = num_issues + 1;
                    msgArr.push(resp[i]);
                }
            }
            $scope.issuemessages = msgArr;
            $scope.issues = num_issues;
        });
    }

    $scope.alerts = [];
    $scope.extractHostInfo = function() {
        $scope.alerts.push({
           msg: 'Please wait while the information is extracted from the system'
        });
        $http.post("http://localhost:8181/systeminfo").success(function(data) {
            $scope.getHostInfo();
            $scope.getProgramsInfo();
            $scope.getProcessInfo();
            $scope.alerts.pop();
        });
    }
    $scope.extractHostInfo();
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}