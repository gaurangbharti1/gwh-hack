var app = angular.module("gwh-hack", ["ngRoute"]);

// Route
app.config(function($routeProvider) { // Making the Router Provider
    $routeProvider
        .when("/", {
            templateUrl: "../../pages/home.html",
            controller: "homeController"
        });
});

app.filter('trusted', ['$sce', function ($sce) {
   return $sce.trustAsResourceUrl;
}]);

app.controller('baseController', function($scope, $location, $route) {

    this.initialize = function() {
        // userService.getDetails();
    }
});

app.controller('homeController', function($scope, $location, $route, mainService) {
    //$scope.token = userService.getToken();



    $(document).ready(function() {
        $('select').formSelect();
        $('.dropdown-trigger').dropdown();
        $('.modal').modal();
    });

    $scope.summarizeVideo = function() {
        var url = $scope.video_url;
        $scope.summaryloading = true;
        $scope.final_url = `https://www.youtube.com/embed/${url.split('?')[1].split('=')[1]}`
        
        
        mainService.newVideo().then(function(data) {
            data = data.data;
            $scope.summaryloading = false;
            console.log(data.summary.split('\n'));
            $scope.summary = data.summary.split('\n').reverse();
            $scope.transcription = data.transcript.split('\n');
            M.toast({ html: '<p class="flow-text green-text">Summarized!!</p>', displayLength: 4000 });
        }).catch(function(error) {
            M.toast({ html: '<p class="flow-text red-text">' + error.message + '</p>', displayLength: 2000 });
        });
    }

    // userService.getDetails($scope.token)
    //     .then(function(data) {
    //         $scope.userData = data;
    //         console.log(data.folders);
    //         console.log($scope.userData);
    //         var folders = filterSubFolders(data.folders);

    //         $(function() {
    //             $("#treeview").ejTreeView({
    //                 allowDragAndDrop: true,
    //                 allowDragAndDropAccessControl: true,
    //                 allowDropSibling: true, // allows to drop sibling
    //                 allowDropChild: true, // allows to drop as child
    //                 fields: { dataSource: folders, id: "id", parentId: "parent", text: "name" },
    //                 template: "#treeTemplate"
    //             });
    //         });
    //     }).catch(function(error) {
    //         M.toast({ html: '<p class="flow-text red-text">' + error.message + '</p>', displayLength: 2000 });
    //     });

    /* $scope.$on('$routeChangeStart', function($event, next, current) {
         // ... you could trigger something here ...
         //console.log("Triggered")
         $scope.token = userService.getToken();
     }); */
     
    this.initialize = function() {

    }
});
