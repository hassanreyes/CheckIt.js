'use strict';

//Checklists service used to communicate Checklists REST endpoints
angular.module('checklists').factory('Checklists', ['$resource',
	function($resource) {
		return $resource('checklists/:checklistId', { checklistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			browse: {
				method: 'GET',
				params: {isBrowsing: true},
				isArray: true
			}
		});
	}
]);

//Checklists service used to communicate Checklists REST endpoints
angular.module('checklists').factory('Search', ['$resource',
	function($resource) {
		return $resource('search/:query', { query : '@query' }, {
			search: {
				method: 'GET',
				params: { searchText: '@query'},
				isArray: true
			}
		});
	}
]);

angular.module('checklists').factory('Parser', ['Checklists',
	function(Checklists) {
		// Parser service logic
		// ...
		

		// Public API
		return {
			parse: function(text, checklist) {
				
				var metadata = {};
				
				if(!checklist){
					checklist = {
						name : 'Untitled',
						description : null,
						sections : []
					};
				}
				
				var lines = text.split("\n");
				
				if(lines.length == 0){
					throw "not valid checklist";
				}
				
				var reMetadata = new RegExp("\{(\s*?.*?)*?\}");
				var hasMetadata = reMetadata.test(lines[0].trim());
				
				var ln = -1;
				if(hasMetadata){
					metadata = JSON.parse(lines[0]);
					ln++;
				}else{
					metadata = { language: 'en' };
				}
				
				//Title
				checklist.name = lines[++ln].trim();
				
				var obj = checklist;
				var item = null;
				var objType = 'Desc';
				var regexTab = new RegExp("^\t");
				
				while(++ln < lines.length){
					var line = String(lines[ln]);
					var tt = typeof line;
					
					switch(objType)
					{
						case 'Desc':
							if(regexTab.test(line)){
								var content = line.trim();
								if(content != ''){
									if(obj.description == null){
										obj.description = content;
									}else{
										obj.description = obj.description + '\n' + content;
									}
								}else{
									if(obj === checklist){
										objType = 'Section';
									}else{
										objType = 'Item';
									}
								}
							}else if(line.trim() == ''){
								if(obj === checklist){
									objType = 'Section';
								}else{
									objType = 'Item';
								}
							}else{
								var content = line.trim();
								if(obj.description == null){
									obj.description = content;
								}else{
									obj.description = obj.description + '\n' + content;
								}
							}
						break;
						case 'Section':
							if(regexTab.test(line)){
								objType = 'Item';
								var content = line.trim();
								if(obj === checklist){
									throw "At least one section must be declared";
								}else{
									obj.items.push({ content : content });
								}	
							}else if(line.trim() == ''){
								//remain Section
							}else{
								checklist.sections.push({ name : line, description : null, items : [] });
								obj = checklist.sections[checklist.sections.length - 1];
								objType = 'Desc';
							}
						break;
						case 'Item':
							if(regexTab.test(line)){
								if(obj === checklist){
									throw "At least one section must be declared";
								}else{
									var content = line.trim();
									if(content != ''){
										if(item != null){
											item.content = item.content + '\n' + content;
										}else {
											obj.items.push({ content : content });
											item = obj.items[obj.items.length - 1];
										}
									}else{
										item = null;
									}
								}	
							}else if(line.trim() == ''){
								//remain Item
								item = null;
							}else{
								checklist.sections.push({ name : line, description : null, items : [] });
								obj = checklist.sections[checklist.sections.length - 1];
								objType = 'Desc';
							}
						break;
					}
				}	
				
				return checklist;
			}
		};
	}
]);

angular.module('checklists').factory('WorkingChecklist', ['Checklists',
	function(Checklists){
		
		var name = '';
		var category = {};
		var checklist = undefined;
		var observerCallbacks = [];
		
		return {
			
			currentCategory: function(){
				return category;
			},
			
			//register an observer
			registerObserverCallback: function(callback){
				observerCallbacks.push(callback);
			},
			
			//call this when you know 'checklist' has been changed
			notifyObsrvers: function(){
				angular.forEach(observerCallbacks, function(callback){
			      callback();
			    });
			},
			
			clear: function(){
				this.checklist = new Checklists ({
					name: this.name,
					sections : []
				});
				this.notifyObsrvers();
			},
			
			currentChecklist: function(){
				if(this.checklist == undefined){
					this.checklist = new Checklists ({
						name: this.name,
						sections : []
					});
				}
				return this.checklist;
			},
			
			setCurrentChecklist: function(checklist){
				this.checklist = checklist;
				this.notifyObsrvers();
			},
			
			addSection: function(name){
				name = name ? name : '';
				this.checklist.sections.push({ name : name, items : [] });
				this.notifyObsrvers();
			},
			
			removeLastSection: function(){
				this.checklist.sections.pop();
				this.notifyObsrvers();
			},
			
			removeSection: function(idx){
				this.checklist.sections.splice(idx, 1);
				this.notifyObsrvers();
			},
			
			addItem: function(section, content){
				section.items.push({ content : content });
				this.notifyObsrvers();
			},
			
			removeLastItem: function(section){
				section.items.pop();
				this.notifyObsrvers();
			},
			
			removeItem: function(section, idx){
				section.items.splice(idx,1);
				this.notifyObsrvers();
			}

		};
	}
]);
