app.service('myService', function(){
	this.sayHello  = function(){
		var msg = "hello service";
		console.log(msg);
		return msg;
	};
});

app.factory('MyFactory', function(){
	return {
		sayHello: function(){
			var msg = "hello factory";
			console.log(msg);
			return msg;
		}
	};
});