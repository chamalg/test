	window.onload = callWs; 

	var uid = "";
	var fingerprint = "";
	var elemsList;

	function callWs(){

		var apiURL = "https://preprod.gtnexus.com/rest/310/$SellerB2?oql=1=1&limit=1";
		var dataKey = "88b069ce5b9985b5c28c7563d72a7da3b19fc793";
		var authentication = "Basic Y2didXllcjAyOnRyYWRlY2FyZA==";

		var ConnectionManager = APPXPRESS.core.connection_manager.controller.createConnectionManager(apiURL);
		var client = ConnectionManager
		var httpMethod = 'GET';
		var endpoint = '310/$SellerB2/';
		var params = null;
		
		var headers = {
			'Content-Type': 'application/json',
			'dataKey': dataKey,
			'Authorization': authentication

		};


		var onDataFn = function(data) {
			console.log('data', data);
			console.log('data', JSON.parse(data.response));
			var user=JSON.parse(data.response); 
			var resBody = user.result;
			var resArrSize = resBody.length;

			elemsList = [];

			resBody.forEach(function(element){
				elemsList.push(element.uname);


				var htm = '<div class="well" onClick=doAlert()>';

				htm += '							<table>';
				htm += '									<tr>';
				htm += '										<td><div class="container1">';
				htm += '											<h3>'+element.items[0].name+'</h3>';
				htm += '										</div>';
				htm += '										<img class="img-responsive" src="'+element.items[0].image+'"></td>';
				htm += '										<td>';
				htm += '											<div class="container2">';
				htm += '												<h3> Remaining qty: '+element.items[0].qty+'</h3>';
				htm += '												<h3> Price: '+element.items[0].price+'</h3>';
				htm += '											</div>';
				htm += '										</td>';
				htm += '									</tr>';
				htm += '								</table>';
				htm += '							</div>';

				var docItemPos = document.getElementById("containerIn");

				docItemPos.insertAdjacentHTML('beforebegin', htm);
			});



			document.getElementById("name1").innerHTML  = element.uname;
			document.getElementById("price1").innerHTML = element.address;


			

			elemsList.forEach(function(elems){
				console.log("Test", elems);
			});

		}

		var onErrorFn = function(data) {
			console.log('edata', data);

		} 


		if(uid!=""){
			endpoint += uid;
		}

		client.createRequest('GET', endpoint, params, headers, null, onDataFn,
			onErrorFn);

	}

	function doAlert(){
		alert("DAdaaa");
	}

