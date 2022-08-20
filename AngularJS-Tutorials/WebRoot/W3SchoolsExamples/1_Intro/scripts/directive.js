app.directive("w3DirectiveElementAndAttribute", function(){
	return{
		template: "<h3>Made by a directive - Element name and Attribute!</h3>"
	};
});

app.directive("w3DirectiveClass", function(){
	return{
		restrict : "C",
		template: "<h3>Made by a directive - Class!</h3>"
	};
});

app.directive("w3DirectiveComment", function(){
	return{
        restrict : "M",
        replace : true,
        template : "<h3>Made by a directive - Comment!</h3>"
	};
});