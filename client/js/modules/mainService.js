var app = angular.module("gwh-hack");
app.service('mainService', function($http) {
    var mainService = [];
    
    mainService.newVideo = function() {
        //let data = { url: url };
        //console.log(JSON.stringify(data));
        return $http({
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                //data: JSON.stringify(data),
                url: './getTranscript?name=minPhysics.wav'
            }).then(function(responses) {
                return responses.data;
            })
            .catch(function(response) {
                throw Error(response.data.error); 
            });
    };

    mainService.getToken = () => { return localStorage.getItem("token"); };
    
    return mainService;
});
