// $(function () {
//     $('.done').on('click', function (event) {
//         event.stopPropagation();

//         $(this).parent('.house').fadeOut();
//     });
// });

angular.module('House', [])
    .controller('masterCtrl', ['$q', '$http', '$scope', function ($q, $http, $scope) {
        $http.get('http://localhost:4444/houseList').then(function (resp) {
            $scope.house_list = resp.data.sort(function (a, b) {
                if (a.price > b.price) { return 1; }
                if (a.price < b.price) { return -1; }
                return 0;
            });
        });
    }]);