app.service('myService', function(){
	this.sayHello  = function(){
		var msg = "hello";
		console.log(msg);
		return msg;
	};
});