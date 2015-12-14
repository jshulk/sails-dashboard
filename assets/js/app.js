var app = angular.module("dashboard", ['chart.js']);
app.controller("main", ['$scope', '$http', function($scope, $http){
	$scope.loading = true;
	$scope.charts = [];

	$http.get("http://localhost:1337/event/find")
	.then(function(response){
		buildDoughnutChart(response.data, 'os', 'Visitor OS distribution');
		buildDoughnutChart(response.data, 'browser', 'Visitor Browser distribution');
		$scope.loading = false;
		//start listening for socket events
		io.socket.on('event', function(event){
			console.log(event);
		});
	})
	.catch(function(error){
		console.error(error);
	});

	function buildDoughnutChart (events, property, title) {
		var prop,
			temp = {},
			data = {
				title: title,
				type: 'doughnut',
				labels: [],
				data: []
			};

			events.forEach(function(event){
				//build up labels array
				if( data.labels.indexOf(event[property]) === -1 ) {
					data.labels.push(event[property]);
				}

				//build object to contain counts
				if( !temp[event[property]] ) {
					
					temp[event[property]] = {
						count: 0
					};
				}

				temp[event[property]].count += 1;
			});

			for( var prop in temp ) {
				data.data.push(temp[prop].count);
			}

			$scope.charts.push(data);
	}


}]);


