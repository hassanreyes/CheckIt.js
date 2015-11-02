'use strict';

angular.module('checklists').service('WorkingOnService', ['Checklists', '$rootScope', 'Authentication', '$http', 'socket', 'lodash',

	function(Checklists, $rootScope, Authentication, $http, socket, lodash){
	    
	    var _ready = false;
	    //store the state in the client side of the working On checklist
	    var _updated = Date.now();
	    var _checklist = {};
	    var _observers = [];
	    var _error = null;

	    socket.on('workingOn:updated', function(data){
	    	//someone else has updated the working on checklist that we are also working on
    		sync(null, data);
	    });
	    
		var notifyObsrvers = function(){
		    _observers.forEach(function(cb){
		        cb(_checklist, _updated, _error);
		    });
		};
		
		var registerObserver = function(callback){
		    _observers.push(callback);
		};
		
		var unRegisterObserver = function(callback){
			var idx = _observers.indexOf(callback);
			if(idx >= 0){ 
				_observers.splice(idx, 1);
			}
		};

		/**
		 * Perform a clean up and validation o a well formed checklist
		 * @param checklist
		 */
		var validate = function(checklist){
			if(lodash.isEmpty(checklist.name)) return 'name is not defined';
			if(!lodash.isEmpty(checklist.sections)){
				var err = null;
				checklist.sections = lodash.filter(checklist.sections, function(sec){
					if(lodash.isEmpty(sec.name)){
						if(!lodash.isEmpty(sec.items)) { err = 'there is a secction without name'; }
						else{
							return false;
						} //no name neether items; remove
					}
					return true;
				});
			}
		};
		
		/**
		 * @event trggered from client, if not, the event came from server
		 * */
		var sync = function(event, arg, next){
			//check if ready for synchronization
			if(_ready){
				if(event){
					//Update server state
					if(event == 'workingOn:save'){
						socket.emit(event, arg, function(error, checklist){
							if(error){ _error = error; }
							if(next){ next(_error, checklist);	}
						});
					}else{
						socket.emit(event, arg, function(error, workingOn){
				        	if(error){
					    		_error = error;
					    	}else{
					    		if(workingOn){
						    		_checklist = workingOn.checklist;
						        	_updated = workingOn.updated;
						        	_error = null;
						        	//Update other views 
						        	notifyObsrvers();
					    		}else{
						    		_error = "no workingOn retrieved";
						    	}
					    	}
					    	//service consumer after sync function
				        	if(next){
				        		next(_error, _checklist);
				        	}
				        });			
					}
				}else{
					_checklist = arg.workingOn.checklist;
		        	_updated = arg.workingOn.updated;
		        	_error = arg.error;
		        	//Update other views 
		        	notifyObsrvers();
		        	//service consumer after sync function
		        	if(next){
		        		next(_error);	
		        	}
				}
			}
		};

		var authenticate = function(){
			socket.emit('user:login', Authentication.user, function(error, workingOn) {
				if(error){
					_ready = false;
					_error = error;
				}else{
					if(workingOn){
						_ready = true;
						_checklist = workingOn.checklist;
						_updated = workingOn.updated;
						_error = null;
					}else{
						_error = "no workingOn retrieved";
					}
				}

				notifyObsrvers();
			});
		};

	    /**
	     * Retrieve from server the actual state
	     * */
        var reset = function(){
            //Retreive working checklist from server
            sync('workingOn:pull', _checklist);
        };
	    
	    /**
	     * Create a totaly new checklist state object
	     * */
	    var createNew = function(next){
	        _checklist = {
	        	name 		: 'My New Checklists',
	        	description : '',
	        	language 	: Authentication.user.language,
	        	user		: Authentication.user
	        };
	        
	        sync('workingOn:push', _checklist, next);
	    };
	    
	    /**
	     * Clear the actual state to default values
	     * */
	    var clear = function(){
	    	_checklist.description = '';
	    	_checklist.sections = [];
	    	
	    	sync('workingOn:push', _checklist);
	    };
	    
	    /**
	     * Loads the given checklist into the actual state
	     * @param checklist 
	     * */
	    var edit = function(id, next){
	    	//Command the server to load the given checklist (id) into the working on state
	    	sync('workingOn:edit', id, next);
	    };
	    
	    /**
	     * Takes the actual working state and post back to Checklists collection on server
	     * */
	    var save = function(next){
			var err = validate(_checklist);
			if(err){
				next(err, _checklist);
			}else{
				sync('workingOn:save', _checklist, next);
			}
	    };
	    
	    /**
	     * This is the only way that a view controller can update the working on state on server
	     * */
	    var update = function(checklist, next){
    		sync('workingOn:push', checklist, next);
	    };

		/**
		 * Instantiation commands
		 */
		if(Authentication.user && Authentication.user.workingOn)
		{
			_checklist = Authentication.user.workingOn.checklist;
			authenticate();
		}

	    /**
	     * Service public interface
	     **/
	    var service = {
	    	//Properties
    		getUpdated			: function () { return _updated },
	    	getChecklist 		: function () { return _checklist },
	    	isReady				: function () { return _ready; },
	    	getError			: function () { return _error; },
	    	//Methods
	    	registerObserver 	: registerObserver,
	    	unRegisterObserver	: unRegisterObserver,
			authenticate		: authenticate,
	    	reset				: reset,
	    	create				: createNew,
	    	clear				: clear,
	    	edit				: edit,
	    	save				: save,
	    	update				: update
	    };
	    
	    return service;
	}
	
]);
