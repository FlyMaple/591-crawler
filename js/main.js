// $(function () {
//     $('.done').on('click', function (event) {
//         event.stopPropagation();

//         $(this).parent('.house').fadeOut();
//     });
// });

angular.module('House', [])
    .controller('masterCtrl', ['$q', '$http', '$scope', function ($q, $http, $scope) {
        $http.get('http://localhost:4444/houseList').then(function (resp) {
            $scope.house_list = resp.data.filter(function (house) {
                return house.status !== 'not_show';
            }).sort(function (a, b) {
                if (a.price > b.price) { return 1; }
                if (a.price < b.price) { return -1; }
                return 0;
            });
        });

        $scope.not_show = function (house) {
            $http.patch(`http://localhost:4444/house/${house.houseid}`, {
                data: {
                    status: 'not_show'
                }
            }).then(function () {
                house.status = 'not_show';
            }, function (resp) {
                alert(resp.message);
            });
        };

        $scope.done = function (house) {
            $http.patch(`http://localhost:4444/house/${house.houseid}`, {
                data: {
                    status: 'done'
                }
            }).then(function () {
                house.status = 'done';
            }, function (resp) {
                alert(resp.message);
            });
        };

        var order = 'asc'
        $scope.sort = function (property) {
            $scope.house_list.sort(function (a, b) {
                if (a[property] > b[property]) { return (order === 'asc') ? -1 : 1; }
                if (a[property] < b[property]) { return (order === 'asc') ? 1 : -1; }
                return 0;
            });

            order = (order === 'asc') ? 'desc' : 'asc';
        };
    }]);