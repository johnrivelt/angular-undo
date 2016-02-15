angular.module('ctmApp')
.service('PolygonService', function () {
	this.polygonNum = 0;	

	function Polygon(name){
		this.name = name;
		this.type = 'polygon';		
		return this;
	};
	this.addPolygon = function(){	
		var obj = new Polygon('p' + ++this.polygonNum);
		return obj;
	};
	this.removePolygon = function(polygon){
		this.polygonNum--;						
	};

  });