//jQuery.js, Zepto.js, Spine.js, Backbone.js 库／框架 组织概要
var jQuery, Zepto, Backbone, Spine;

// jQuery.js
jQuery = (function(){
	function jQuery( selector, context ) {
		return new jQuery.prototype.init( selector, context );
	};

	jQuery.extend = jQuery.prototype.extend = function( prop ) {
		[].slice.call(arguments, 1).forEach( function(source){
			for ( var key in source) {
				// 条件判断 ......
				prop[key] = source[key];
			}
		});
		return prop;
	};

	jQuery.extend(jQuery.prototype, {
		init: function( selector, context ) {
			if ( !selector ) return this;
			if ( selector.nodeType) {
				this[0] = selector, this.length = 1;
				return this;
			}
			var nodeList = ( context || document ).querySelectorAll( selector );
			this.length = nodeList.length;
			for ( var i = 0, len = this.length; i < len; i++ ) {
				this[i] = nodeList[i];
			}
			return this;
		},
		each: function( fn ) {
			for (var i = 0, len = this.length; i < len; i++ ) fn.call(this[i], i, this[i])
			return this;
		}
		// 其它实例成员 ......

	});

	jQuery.extend(jQuery {
		// 其它静态成员 ......
	});

	// 原型链重定向
	jQuery.prototype.init.prototype = jQuery.prototype;

	return jQuery;
})();

// Zepto
Zepto = (function(){
	var 	classSelectorRE		=   /^\.([\w-]+)$/,
	 	idSelectorRE 		=   /^#([\w-]+)$/,
	  	tagSelectorRE		=   /^[\w-]+$/;

	function Zepto( selector, context ) {
		return Zepto.init( selector, context );
	};

	Zepto.extend = Zepto.prototype.extend = function( prop ) {
		[].slice.call(arguments, 1).forEach( function(source){
			for ( var key in source) {
				// 条件判断 ......
				prop[key] = source[key];
			}
		});
		return prop;
	};

	Zepto.extend(Zepto, {
		// 数组对象包装
		Q: function( dom, selector ) {
			dom = dom || [];
			// 原型链重定向
			dom.__proto__ = Zepto.prototype;
			dom.selector = selector || '';
			return dom;
		},
		// DOM 操作初始化
		init: function( selector, context ) {
			if ( !selector ) {
				// 如果selector为空，直接返回空的数组对象
				return Zepto.Q();
			} else if (Object.prototype.toString.call( selector ) === '[object Function]') {
				// 如果selector为函数，待dom树加载完成后执行
				return Zepto.prototype.ready(selector);
			} else if ( selector instanceof Zepto ) {
				// 如果selector为已包装对象，直接返回
				return selector;
			} else {
				var dom;
				// 如果selector为数组，过滤掉空的数组元素
				if (Object.prototype.toString.call( selector ) === '[object Array]') {
					dom = [].prototype.filter.call(selector, function(item){
						return item !== undefined && item !== null;
					})
				} else if (  ) {
					// 部分条件执行语句 ......	
				} else {
					// 执行DOM查询
					dom = Zepto.sift( document, selector );
				};
				// 最终返回包装后的数组
				return Zepto.Q(dom, selector);
			}
		},
		// 元素查询
		sift: function(context, selector) {
			var found;
			// 根据条件来匹配使用哪种选择器 getElementById(#id) || getElementsByClassName(.class) || getElementsByTagName(div) || querySelectorAll(div #id)
			return (context === document && idSelectorRE.test(selector)) ?
			((found = context.getElementById(RegExp.$1)) ? [found] : []) :
			(context.nodeType !== 1 && context.nodeType !== 9) ? [] :
			slice.call(
				classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) :
				tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : 
				context.querySelectorAll(selector)
			);
		}
		// 其它静态成员 ......
	});

	Zepto.extend(Zepto.prototype, {
		// DOM结构创建完成执行回调
		ready: function(callback) {
			document.addEventListener("DOMContentLoaded", callback, false);
			return this;
		},
		// 成员遍历
		each: function(callback) {
			if (Object.prototype.toString.call(this) === '[object Array]') {
				[].forEach.call(this,function(el, index){
					if (callback.call(el, index, el) === false) return this;
				})
			} else {
				for (var key in this) {
					if (callback.call(this[key], key, this[key])) return this;
				}
			}				
			return this;
		},
		// 其它实例成员 ......
	})

	return Zepto;
})();

// Spine
Spine = (function(){
	var   	 Controller, Events, Model, Module, Spine, $,
		extend = function(child, parent) {
			 for (var key in parent) { 
			 	if (hasProp.call(parent, key)) 
			 		child[key] = parent[key]; 
			} 
			function ctor() { 
				this.constructor = child; 
			} 
			ctor.prototype = parent.prototype; 
			child.prototype = new ctor(); 
			child.__super__ = parent.prototype; 
			return child; 
		},
		moduleKeywords = ['included', 'extended'];

	Spine = this.Spine = {};
	
	// 公共调用方法
	Module = Spine.Module =  (function() {
		Module.include = function(obj) {
			var key, ref, value;
			if (!obj) {
				throw new Error('include(obj) requires obj');
			}
			for (key in obj) {
				value = obj[key];
				if (indexOf.call(moduleKeywords, key) < 0) {
					this.prototype[key] = value;
				}
			}
			if ((ref = obj.included) != null) {
				ref.apply(this);
			}
			return this;
		};

		Module.extend = function(obj) {
			var key, ref, value;
			if (!obj) {
				throw new Error('extend(obj) requires obj');
			}
			for (key in obj) {
				value = obj[key];
				if (indexOf.call(moduleKeywords, key) < 0) {
					this[key] = value;
				}
			}
			if ((ref = obj.extended) != null) {
				ref.apply(this);
			}
			return this;
		};

		function Module() {
			if (typeof this.init === "function") {
				this.init.apply(this, arguments);
			}
		}

		return Module;
	})();

	// 事件模块
	Events = {
		bind: function(ev, callback) {
			// 相关执行语句 ......
		},
		one: function(ev, callback) {
			// 相关执行语句 ......
		},
		trigger: function() {
			// 相关执行语句 ......
		},
		listenTo: function(obj, ev, callback) {
			// 相关执行语句 ......
		},
		stopListening: function(obj, events, callback) {
			// 相关执行语句 ......
		},
		unbind: function(ev, callback) {
			// 相关执行语句 ......
		} 
	};

	// 数据处理模块
	Model = Spine.Model =  (function( superClass ){
		extend(Model, superClass);
		Model.extend(Events);
		Model.include(Events);

		Model.extend({
			// 其它静态成员 ......
		});

		Model.include({
			// 其它实例成员 ......
		});

		function Model( atts ) {
			Model.__super__.constructor.apply(this, arguments);
			// 其它相关执行语句 ......
		};

		return Model;
	})( Module );

	// 控制器模块
	Controller = Spine.Controller =  (function( superClass ){
		extend(Controller, superClass);
		Controller.include(Events);

		Controller.extend({
			// 其它静态成员 ......
		});

		Controller.include({
			// 其它实例成员 ......
		});

		function Controller( atts ) {
			Controller.__super__.constructor.apply(this, arguments);
			// 其它相关执行语句 ......
		};

		return Controller;
	})( Module );

	// DOM操作模块
	$ =Spine.$ =  (typeof window !== "undefined" && window !== null ? window.jQuery : void 0) || (typeof window !== "undefined" && window !== null ? window.Zepto : void 0) || function(element) {
		return element;
	};

	// 拓展方法
	Module.create = Module.sub = Controller.create = Controller.sub = Model.sub = function(instances, statics) {
		var Result;
		Result = (function(superClass) {
			extend(Result, superClass);

			function Result() {
				return Result.__super__.constructor.apply(this, arguments);
			}

			return Result;

		})(this);
		if (instances) {
			Result.include(instances);
		}
		if (statics) {
			Result.extend(statics);
		}
		if (typeof Result.unbind === "function") {
			Result.unbind();
		}
		return Result;
	};

	// 数据处理模块初始化声明
	Model.setup = function(name, attributes) {
		var Instance;
		if (attributes == null) {
			attributes = [];
		}
		Instance = (function(superClass) {
			extend(Instance, superClass);

			function Instance() {
				return Instance.__super__.constructor.apply(this, arguments);
			}

			return Instance;

		})(this);
		Instance.configure.apply(Instance, [name].concat(slice.call(attributes)));
		return Instance;
	};
})();

// Backbone
Backbone = (function(){

})();
