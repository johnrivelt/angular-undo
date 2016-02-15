angular.module('ctmApp')
.service('UndoService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
   
		//this.desktop = []; // displaying objects array
		this.undoBin = []; // undo Bin{what:object, how:'create // update // delete'}
		this.redoBin = []; // redo Bin{what:object, how:'create // update // delete'}

		this.desktop = [];
		this.undoBinLimit = 10;

		
		this.checkUndoBin = function(){
			if(this.undoBin.length >= this.undoBinLimit){
				this.undoBin.splice(0,1);
			}
		};
		this.addEvent = function(obj,type, propertyName,ov){
			this.checkUndoBin();	
			this.redoBin = []; //empty redoBin no need to redo			
			switch(type.toUpperCase()){
				case 'CREATE':
					this.desktop.push(obj);//view
					this.undoBin.push({what:obj, how:type});				
					break;
				case 'UPDATE':
					this.undoBin.push({
						what:obj, 
						how:'update', 
						property: propertyName, 
						ov:ov, 
						nv:obj[propertyName]
					});			
					break;
				case 'DELETE':
					var idx = this.desktop.indexOf(obj);
					this.desktop.splice(idx,1);//view			
					this.undoBin.push({what:obj, how:type});							
					break;
			}
		};


		this.undo = function (){
			if(this.undoBin.length <= 0) {
				console.log('can not undo');
				return;
			}
			var incident = this.undoBin.pop();
			
			switch(incident.how){
				case 'create': //create => softdelete
					this.redoBin.push(incident);
					var idx = this.desktop.indexOf(incident.what);
					this.desktop.splice(idx,1);//for deep manipulation				

					break;
				case 'update':
					this.redoBin.push(incident);
					var obj = incident.what;
					var prop = incident.property;
					obj[prop] = incident.ov;				
					
					break;
				case 'delete':
					this.redoBin.push(incident);				
					this.desktop.push(incident.what);
					break;
			}
		};


		//redoBin
		this.redo = function (){
			if(this.redoBin.length <=0) {
				console.log('can not redo');
				return;
			}

			var incident = this.redoBin.pop();
			//create => softdelete
			switch(incident.how){
				case 'create': // add to desktop and undoBin
					this.undoBin.push(incident);
					this.desktop.push(incident.what);
				break;
				case 'update':
					this.undoBin.push(incident);				
					var obj = incident.what;
					var prop = incident.property;
					obj[prop] = incident.nv;											
				break;
				case 'delete':
					this.undoBin.push(incident);
					var idx = this.desktop.indexOf(incident.what);
					this.desktop.splice(idx,1);//for deep manipulation								
				break;
			}	
		};	

  
  });