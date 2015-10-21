'use strict';

//Menu service used for managing  menus
angular.module('core').service('Catalogs', ['Categories',
    function(Categories){
        
        var _this = this;
        _this._categories = [];
        _this._selCategories = [];
        
        var getCategories = function(){
            
            if(_this._categories.length == 0)
            {
                Categories.crud.query(function(cats){
    				for(var i = 0; i < cats.length; i++){
    				    _this._categories.push(cats[i]);
    				}
    			});
            }
            
            return _this._categories;
        };
            
        var getSelectableCategories = function(){
            
			getCategories().forEach(function(item){
			    _this._selCategories.push({ id : item._id, name : item.name, selected : false });
			});
            
            return _this._selCategories;
        };
        
        _this._categories = getCategories();
        _this._selCategories = getSelectableCategories();
        
        _this._data = {
			categories: _this._categories,
			selectableCategories: _this._selCategories
		};
		
		return _this._data;
    }
]);
