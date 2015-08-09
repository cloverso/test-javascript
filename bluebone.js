/*!
 *Bluebone JavaScript MVC Library v0.0.8
 * https://github.com/MrClovers/Bluebone
 *
 * Date: 2015-07-29
 */

(function() {
	// 初始变量声明
	var Bluebone, $, Controller, Events, Log, Model, Module, moduleKeywords;

	var ArrayProto 		= Array.prototype, 
		ObjProto 		= Object.prototype, 
		FuncProto 		= Function.prototype,
		StrProto 		= String.prototype,
	   	toString			= ObjProto.toString,
	   	hasProp 		= ObjProto.hasOwnProperty,
	   	slice 			= ArrayProto.slice,
	   	indexOf 		= ArrayProto.indexOf,
	   	forEach 		= ArrayProto.forEach,
	   	filter 			= ArrayProto.filter,
	   	map 			= ArrayProto.map;
	    
	var _extend =  function(prop){
	    	slice.call(arguments, 1).forEach(function(source) {
	      		for (var key in source) {
		       		if (key !== 'extended' && source[key] !== undefined) 
		       			prop[key] = source[key];
	      		}
	    	});
	    	if (prop.extended != null) prop.extended.apply(this);
	  	// 返回需要的目标对象
	   	return prop
	};
	

	// Bluebone声明
	Bluebone = this.Bluebone = {};
	// 版本号
	Bluebone.version = '0.0.8';


	// 事件
	Events = Bluebone.Events = {		
		// 绑定事件，ev 是空格分隔的事件类型的列表。
		bind: function(ev, callback) {
			var base, evs, j, len, name;
			evs = ev.split(' ');
			if (!hasProp.call(this, '_callbacks')) {
				this._callbacks || (this._callbacks = {});
			}
			for (j = 0, len = evs.length; j < len; j++) {
				name = evs[j];
				(base = this._callbacks)[name] || (base[name] = []);
				this._callbacks[name].push(callback);
			}
			return this;
		},
		// 绑定单次事件，ev 是空格分隔的事件类型的列表。
		one: function(ev, callback) {
			var handler;
			return this.bind(ev, handler = function() {
				this.unbind(ev, handler);
				return callback.apply(this, arguments);
			});
		},
		// 触发事件，可传入用空格分隔的事件类型列表(可选)。
		trigger: function() {
			var args, callback, ev, j, len, list, ref;
			args = arguments.length >= 1 ? slice.call(arguments, 0) : [];
			ev = args.shift();
			list = (ref = this._callbacks) != null ? ref[ev] : void 0;
			if (!list) {
				return;
			}
			for (j = 0, len = list.length; j < len; j++) {
				callback = list[j];
				if (callback.apply(this, args) === false) {
					break;
				}
			}
			return true;
		},
		// 侦听事件在给定的控制器或模型实例上(obj)，ev 是空格分隔的事件类型的列表。
		listenTo: function(obj, ev, callback) {
			obj.bind(ev, callback);
			this.listeningTo || (this.listeningTo = []);
			this.listeningTo.push({
				obj: obj,
				ev: ev,
				callback: callback
			});
			return this;
		},
		// 侦听事件在给定的控制器或模型实例上(obj)，该处理程序只执行一次，ev 是空格分隔的事件类型的列表。
		listenToOnce: function(obj, ev, callback) {
			var handler, listeningToOnce;
			listeningToOnce = this.listeningToOnce || (this.listeningToOnce = []);
			obj.bind(ev, handler = function() {
				var i, idx, j, len, lt;
				idx = -1;
				for (i = j = 0, len = listeningToOnce.length; j < len; i = ++j) {
					lt = listeningToOnce[i];
					if (lt.obj === obj) {
						if (lt.ev === ev && lt.callback === handler) {
							idx = i;
						}
					}
				}
				obj.unbind(ev, handler);
				if (idx !== -1) {
					listeningToOnce.splice(idx, 1);
				}
				return callback.apply(this, arguments);
			});
			listeningToOnce.push({
				obj: obj,
				ev: ev,
				callback: handler
			});
			return this;
		},
		// 在给定的控制器或模型实例上停止侦听事件，events 是空格分隔的事件类型的列表。
		stopListening: function(obj, events, callback) {
			var e, ev, evts, idx, j, k, l, len, len1, len2, len3, listeningTo, lt, m, n, ref, ref1, ref2;
			if (arguments.length === 0) {
				ref = [this.listeningTo, this.listeningToOnce];
				for (j = 0, len = ref.length; j < len; j++) {
					listeningTo = ref[j];
					if (!listeningTo) {
						continue;
					}
					for (k = 0, len1 = listeningTo.length; k < len1; k++) {
						lt = listeningTo[k];
						lt.obj.unbind(lt.ev, lt.callback);
					}
				}
				this.listeningTo = void 0;
				this.listeningToOnce = void 0;
			} else if (obj) {
				ref1 = [this.listeningTo, this.listeningToOnce];
				for (l = 0, len2 = ref1.length; l < len2; l++) {
					listeningTo = ref1[l];
					if (!listeningTo) {
						continue;
					}
					events = events ? events.split(' ') : [void 0];
					for (m = 0, len3 = events.length; m < len3; m++) {
						ev = events[m];
						for (idx = n = ref2 = listeningTo.length - 1; ref2 <= 0 ? n <= 0 : n >= 0; idx = ref2 <= 0 ? ++n : --n) {
							lt = listeningTo[idx];
							if (lt.obj !== obj) {
								continue;
							}
							if (callback && lt.callback !== callback) {
								continue;
							}
							if ((!ev) || (ev === lt.ev)) {
								lt.obj.unbind(lt.ev, lt.callback);
								if (idx !== -1) {
									listeningTo.splice(idx, 1);
								}
							} else if (ev) {
								evts = lt.ev.split(' ');
								if (indexOf.call(evts, ev) >= 0) {
									evts = (function() {
										var len4, p, results;
										results = [];
										for (p = 0, len4 = evts.length; p < len4; p++) {
											e = evts[p];
											if (e !== ev) {
												results.push(e);
											}
										}
										return results;
									})();
									lt.ev = $.trim(evts.join(' '));
									lt.obj.unbind(ev, lt.callback);
								}
							}
						}
					}
				}
			}
			return this;
		},
		// 解除绑定事件，如果不传入任何参数，解绑所有事件；ev 是用空隔分隔的事件列表，如果只传入 ev，那么 ev 列表所绑定的事件回调将解除；如果传入一个特定的事件名称和回调，则只解除该回调。
		unbind: function(ev, callback) {
			var cb, evs, i, j, k, len, len1, list, name, ref;
			if (arguments.length === 0) {
				this._callbacks = {};
				return this;
			}
			if (!ev) {
				return this;
			}
			evs = ev.split(' ');
			for (j = 0, len = evs.length; j < len; j++) {
				name = evs[j];
				list = (ref = this._callbacks) != null ? ref[name] : void 0;
				if (!list) {
					continue;
				}
				if (!callback) {
					delete this._callbacks[name];
					continue;
				}
				for (i = k = 0, len1 = list.length; k < len1; i = ++k) {
					cb = list[i];
					if (!(cb === callback)) {
						continue;
					}
					list = list.slice();
					list.splice(i, 1);
					this._callbacks[name] = list;
					break;
				}
			}
			return this;
		}
	};
	// 绑定事件别名
	Events.on = Events.bind;
	// 解除绑定事件别名
	Events.off = Events.unbind;
	// 为Bluebone对象添加事件成员
	_extend.call(Bluebone, Bluebone, Events);


	// 模型
	Model = Bluebone.Model = (function(superClass) {
		// 继承模块方法
		Model.extend = superClass;		
		// Model函数声明
		function Model(attributes, options) {
			var attrs = attributes || {};
			options || (options = {});
			this.id || (this.id = this.constructor.uid('c-'));
			this.attributes = {};
			attrs = _extend({}, attrs, (this.defaults || void 0));
			this.set(attrs, options);

			// var attributes, name;
			// name = arguments[0], attributes = arguments.length >= 2 ? slice.call(arguments, 1) : [];
			// this.className = name;
			// this.id || (this.id = this.constructor.uid('c-'));
			// this.constructor.deleteAll();
			// if (attributes.length) this.attributes = attributes;
			// this.unbind();

			this.initialize.apply(this, arguments);
		}

		Model.extend(Model, Events, {
			idCounter: 0,
			records: [],
			attributes: {},
			uid: function(prefix) {
				var id = ++this.idCounter + '';
				return prefix ? prefix + id : id;
			},
			addRecord: function(record, idx) {
				var root;
				if (root = this.records[record.id]) {
					root.refresh(record);
				} else {
					if (idx !== void 0) {
						this.records.splice(idx, 0, record);
					} else {
						this.records.push(record);
					}
				}
			},
			refresh: function(values, options) {
				var records, result, seif = this;
				options || (options = {});
				records = this.parseJSON(values);
				toString.call(records) !== '[object Array]' && (records = [records]);
				forEach.call(records, function(){
					seif.addRecord(this);
				});
				result = this.cloneArray(records);
				this.trigger('refresh', result, options);
				return result;
			},
			find: function() {
				var ref;
				return ((ref = this.records[id]) != null) ? ref.clone() : void 0;
			},
			deleteAll: function() {
				this.records = [];
			},
			parseJSON: function(objects) {
				var i, len, results, value, seif = this;
				if (!objects) return;
				typeof objects === 'string' && (objects = JSON.parse(objects));

				if (toString.call(objects) === '[object Boolean]') {
					results = [];
					forEach.call(objects, function(){
						results.push((this instanceof seif) ? this : new seif(this));
					})
					return results;
				} else {
					return (objects instanceof this) ? objects : new this(objects);
				}
			},
			cloneArray: function(array) {
				var results = [];
				forEach.call(array, function(){
					results.push(this.clone());
				})
			}
		})

		// 原型成员拓展
		Model.extend(Model.prototype, {
			newRecord: true,
			initialize: function(){ console.log(666) },
			set: function(attrs) {
				var key, value;
				if (attrs.id) this.id = attrs.id;
				for (key in attrs) {
					value = attrs[key];
					if (typeof value === 'function') continue;
					this[key] = value;
				}
			},
			create: function() {
				this.newRecord = false;
				this.constructor.records[this.id] = this;
			},
			update: function() {
				this.constructor.records[this.id] = this;
			},
			destory: function() {
				delete this.constructor.records[this.id];
			},
			save: function() {
				this.newRecord ? this.create() : this.update();
			},			
			unbind: function() {
				Events.unbind.apply(this)
			},
			clone: function() {
				return Object.create.call(this, this);
			}
		});
		
		return Model;
	})(_extend);


	// 控制器
	Controller = Bluebone.Controller = (function(superClass) {
		// 继承公共模块
		Controller.extend = superClass;
		// 原型成员拓展
		Controller.extend(Controller.prototype, Events, {
			eventSplitter: /^(\S+)\s*(.*)$/,
			// el 的默认标记名称
			tag: 'div',
			// 释放
			release: function() {
				this.trigger('release', this);
				this.el.remove();
				this.unbind();
				return this.stopListening();
			},
			// 事件委托
			delegateEvents: function(events) {
				var eventName, key, match, method, results, selector;
				results = [];
				// 遍历事件列表
				for (key in events) {
					method = events[key];
					if (typeof method === 'function') {
						method = (function(_this, method) {
							return function() {
								method.apply(_this, arguments);
								return true;
							};
						})(this, method);
					} else {
						if (!this[method]) {
							throw new Error(method + " doesn't exist");
						}
						method = (function(_this, method) {
							return function() {
								_this[method].apply(_this, arguments);
								return true;
							};
						})(this, method);
					}
					match = key.match(this.eventSplitter);
					eventName = match[1];
					selector = match[2];
					if (selector === '') {
						results.push(this.el.bind(eventName, method));
					} else {
						results.push(this.el.delegate(selector, eventName, method));
					}
				}
				return results;
			},
			// 刷新元素
			refreshElements: function() {
				var key, ref, results, value;
				ref = this.elements;
				results = [];
				for (key in ref) {
					value = ref[key];
					results.push(this[value] = $(key));
				}
				return results;
			},
			// 在当前实例的上下文中延迟执行执行给定的函数
			delay: function(func, timeout) {
				return setTimeout(func.bind(this), timeout || 0);
			},
			// 更新html元素
			html: function(element) {
				this.el.html(element.el || element);
				this.refreshElements();
				return this.el;
			},
			// 将给定的元素或控制器实例追加到 el 内部之后
			append: function() {
				var e, elements, ref;
				elements = arguments.length >= 1 ? slice.call(arguments, 0) : [];
				elements = (function() {
					var j, len, results;
					results = [];
					for (j = 0, len = elements.length; j < len; j++) {
						e = elements[j];
						results.push(e.el || e);
					}
					return results;
				})();
				(ref = this.el).append.apply(ref, elements);
				this.refreshElements();
				return this.el;
			},
			// 将 el 追加到给定的元素或控制器实例
			appendTo: function(element) {
				this.el.appendTo(element.el || element);
				this.refreshElements();
				return this.el;
			},
			// 将给定的元素或控制器实例追加到 el内部之前
			prepend: function() {
				var e, elements, ref;
				elements = 1 <= arguments.length ? slice.call(arguments, 0) : [];
				elements = (function() {
					var j, len, results;
					results = [];
					for (j = 0, len = elements.length; j < len; j++) {
						e = elements[j];
						results.push(e.el || e);
					}
					return results;
				})();
				(ref = this.el).prepend.apply(ref, elements);
				this.refreshElements();
				return this.el;
			},
			// 替换给定元素
			replace: function(element) {
				var previous;
				element = element.el || element;
				if (typeof element === "string") {
					element = StrProto.trim.call(element);
				}
      			previous = this.el, this.el = element;
				previous.replaceWith(this.el);
				this.delegateEvents(this.events);
				this.refreshElements();
				return this.el;
			}
		});
		// Controller函数声明
		function Controller(options) {
			// 如果传递一个函数，则将函数绑定到释放事件，否则激发释放事件
			this.release = this.release.bind(this);
			var context, key, parent_prototype;
			// 遍历参数值
			for (key in options) {
				this[key] = options[key];
			}
			if (!this.el) {
				this.el = document.createElement(this.tag);
			}
			this.el = $(this.el);
			if (this.className) {
				this.el.addClass(this.className);
			}
			if (this.attributes) {
				this.el.attr(this.attributes);
			}
			if (!this.events) {
				this.events = this.constructor.events;
			}
			if (!this.elements) {
				this.elements = this.constructor.elements;
			}
			context = this;
			while (parent_prototype = context.constructor.__super__) {
				if (parent_prototype.events) {
					this.events = $.extend({}, parent_prototype.events, this.events);
				}
				if (parent_prototype.elements) {
					this.elements = $.extend({}, parent_prototype.elements, this.elements);
				}
				context = parent_prototype;
			}
			if (this.events) {
				this.delegateEvents(this.events);
			}
			if (this.elements) {
				this.refreshElements();
			}
			// 运行时执行父类的构造函数( Module()，若存在 init() 方法，则调用执行)
			if (toString.call(this.init) === '[object Function]') {
				this.init.apply(this, arguments);
			}
		}
		// 返回值
		return Controller;
	})(_extend);


	// $  DOM操作
	$ = Bluebone.$ = this.$ = (function(superClass) {

		var fragmentRE 			=   /^\s*<(\w+|!)[^>]*>/,
			classSelectorRE		=   /^\.([\w-]+)$/,
		 	idSelectorRE 		=   /^#([\w-]+)$/,
		  	tagSelectorRE		=   /^[\w-]+$/,
		  	elementTypes  		=   [1, 3, 8, 9, 11],
		  	getComputedStyle	=   document.defaultView.getComputedStyle,

		  	tempParent 			=   document.createElement('div'),
			table 				=   document.createElement('table'),
	    	tableRow			=   document.createElement('tr'),
			containers			= 	{
									    'tr': document.createElement('tbody'),
									    'tbody': table, 'thead': table, 'tfoot': table, 
									    'td': tableRow, 'th': tableRow,
									    '*': document.createElement('div')
								  	},
		  	classCache			=   {},
		  	elementDisplay		=   {},			
			Event, classList;
			
		
		Query.extend = superClass;		

		Query.extend(Query, {
			// 创建DOM
			fragment: function(html, name) {
				if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
				if (!(name in containers)) name = '*';
				var container = containers[name];
				container.innerHTML = '' + html;
				return Query.prototype.each.call(slice.call(container.childNodes), function(){
					container.removeChild(this);
				})
			},
			// 数组对象包装
			Q: function(dom, selector) {
				dom = dom || [];
				dom.__proto__ = Query.prototype;
				dom.selector = selector || '';
				return dom;
			},
			// DOM 操作初始化
			init: function(selector, context) {
				if (!selector) {
					// 如果selector为空，直接返回空的数组对象
					return Query.Q();
				} else if (toString.call(selector) === '[object Function]') {
					// 如果selector为函数，待dom树加载完成后执行
					return Query.prototype.ready(selector);
				} else if (selector instanceof Query) {
					// 如果selector为已包装对象，直接返回
					return selector;
				} else {
					var dom;
					// 如果selector为数组，过滤掉空的数组元素
					if (toString.call(selector) === '[object Array]') {
						dom = filter.call(selector, function(item){
							return item !== undefined && item !== null;
						})
					// 如果context存在，在context环境下查找	
					} else if (context !== undefined) {
						return $(context).find(selector)
					// 如果selector为dom元素或者window，直接包装为数组
					} else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window) {
						dom = [selector], selector = null;
					// 如果selector为html标签片段，则补全
					} else if (fragmentRE.test(selector)) {
						dom = Query.fragment(StrProto.trim.call(selector), RegExp.$1);
						selector = null;
					// 若上述条件均不存在，则直接在document环境下查找
					} else {
						dom = Query.sift(document, selector)
					}
					// 最终返回包装后的数组
					return Query.Q(dom, selector);				
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
			},
			// 匹配当前元素是否存在传入的CSS选择符
			matches: function(element, selector) {
				if (!element || element.nodeType !== 1) return false;
				// 接收一个css选择符，调用元素与该选择符匹配返回true
				var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
									  element.oMatchesSelector || element.matchesSelector;
				if (matchesSelector) {
					return matchesSelector.call(element, selector);
				};
			},
			// 插入内容，供插入方法使用
			insert: function(operator, target, node) {
				var parent = (operator % 2) ? target : target.parentNode;
				parent ? parent.insertBefore(node, 
					!operator ? target.nextSibling :
					operator == 1 ? parent.firstChild :
					operator == 2 ? target :
					null) : Query(node).remove();
			},
			// 遍历脚本节点
			traverseNode: function(node, fn) {
				fn(node);
				for (var key in node.childNodes) Query.traverseNode(node.childNodes[key], fn)
			}
		});		
		
		// 原型链四种内容插入方法
		['after', 'prepend', 'before', 'append'].forEach(function(key, operator){
			Query.prototype[key] = function() {
				// 根据传入内容创建节点
				var nodes = Query.prototype.map.call(arguments, function(n){
					return (n instanceof Object) ? n : Query.fragment(n);
				})
				// 如果节点内容不存在，退出
				if (nodes.length < 1) return this;
				var size = this.length, copyByClone = size > 1, inReverse = operator < 2;

				return this.each(function(index, target){
					for (var i = 0, len = nodes.length; i < len; i++) {
						var node = nodes[inReverse ? nodes.length -i-1 : i];
						// 如果插入的是 javascript 脚本代码，则调用 window.eval 方法解析执行
						Query.traverseNode(node, function(node){
							if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || nody.type === 'text/javascript')) {
								window['eval'].call(window, node.innerHTML);
							}
						})
						if (copyByClone && index < size -1) {
							node = node.cloneNode(true);
						}
						// 插入内容
						Query.insert(operator, target, node);
					}
				})
			}
			Query.prototype[(operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After')] = function(html) {
				Query(html)[key](this);
				return this;
			}
		})

		Query.extend(Query.prototype, {
			// DOM结构创建完成执行回调
			ready: function(callback) {
				document.addEventListener("DOMContentLoaded", callback, false);
				return this;
			},
			// 成员遍历
			each: function(callback) {
				if (toString.call(this) === '[object Array]') {
					forEach.call(this,function(el, index){
						if (callback.call(el, index, el) === false) return this;
					})
				} else {
					for (var key in this) {
						if (callback.call(this[key], key, this[key])) return this;
					}
				}				
				return this;
			},
			// 数组映射
			map: function(callback) {
				var value, i, len, key, values = [];
				if (toString.call(this) === '[object Array]') {
					values = map.call(this, function(el, index){
						return callback.call(el, index, el);
					})
					// for (i = 0, len = this.length; i < len; i++) {
					// 	value = callback.call(this[i], i, this[i]);
					// 	if (value != null) values.push(value);
					// }
				} else {
					for (key in this) {
						value = callback(this[key], key);
						if (value != null) values.push(value);
					}
				}
				return values.length > 0 ? [].concat.apply([], values) : values;
			},
			// 子元素查询
			find: function(selector) {
				var result;
				if (this.length == 1) {
					result = Query.sift(this[0], selector)
				} else {
					result = this.map(function(){
						return Query.sift(this, selector)
					})
				}
				return Query(result);
			},
			filtered: function(nodes, selector) {
				return selector === undefined ? Query(nodes) : Query(nodes).filter(selector);
			},
			slice: function() {
				return Query(slice.apply(this, arguments));
			},
			// 获取数组的某个成员
			get: function(index) {
				return index === undefined ? slice.call(this) : this[index];
			},
			eq: function(index) {
				return index === -1 ? this.slice(index) : this.slice(index, + index +1);
			},
			// 删除元素
			remove: function() {
				return this.each(function(){
					if (this.parentNode != null)
						this.parentNode.removeChild(this);
				})
			},
			empty: function() {
				return this.each(function(){ this.innerHTML = '' })
			},
			// 元素过滤
			filter: function(selector) {
				return Query(filter.call(this, function(element){
					return Query.matches(element, selector);
				}))
			},
			children: function(selector) {
				return this.filtered(this.map(function(){ return slice.call(this.children)}), selector);
			},
			siblings: function(selector) {
				return this.filtered(this.map(function(i, el){
			        return slice.call(el.parentNode.children).filter(function(child){ return child!==el })
			    }), selector)
			},
			// 以当前触发元素为上下文查找包含目标元素最近的父级元素
			closest: function(selector, context) {
				var node = this[0];
				while (node && !Query.matches(node, selector)) {
					node = node != context && node !== document && node.parentNode;
				}
				return Query(node);
			},
			html: function(html) {
				return html === undefined ?
				(this.length > 0 ? this[0].innerHTML : null) :
				this.each(function(index){
					var originHtml = this.innerHTML;
					$(this).empty().append( html );
				})
			},			
			text: function(text) {
				return text === undefined ?
				(this.length > 0 ? this[0].textContent : null) :
				this.each(function(){ this.textContent = text })
			},
			val: function(value) {
				return (value === undefined) ?
				(this.length > 0 ? this[0].value : undefined) :
				this.each(function(index){
					this.value = value;
				})
			},
			attr: function(name, value) {
				var result;
				return (typeof name == 'string' && value === undefined) ?
				(this.length == 0 || this[0].nodeType !== 1 ? undefined :
					(name == 'value' && this[0].nodeName == 'INPUT') ? this[0].value :
					(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
					) : this.each(function(index){
						if (this.nodeType !== 1) return;
						if (name instanceof Object) for (key in name) this.setAttribute(key, name[key]);
						else this.setAttribute(name, value)
					})
			},
			removeAttr: function(name) {
				return this.each(function(){
					if (this.nodeType === 1) this.removeAttribute(name);
				})
			},
			hasClass: function(name) {
				if (this.length < 1) return false;
				else return this[0].classList.contains(name);
			},
			addClass: function(name) {
				return this.each(function(){ this.classList.add(name) });
			},
			removeClass: function(name) {
				return this.each(function(){ this.classList.remove(name) })
			},
			toggleClass: function(name) {
				return this.each(function(){ this.classList.toggle(name) });
			},
			hide: function() {
				return this.each(function(){
					if (!elementDisplay[this])
						elementDisplay[this] = getComputedStyle(this, '').getPropertyValue('display');
					this.style.display = 'none';
				})
			},
			show: function() {
				return this.each(function(){
					this.style.display === 'none' && (this.style.display = null);
					if (getComputedStyle(this, '').getPropertyValue('display') === 'none')
						this.style.display = elementDisplay(this.nodeName);
				})
			}
		});	
	
		Event = {
			handlers: {},
			_eid: 1,
			//取element的唯一标示符，如果没有，则创建一个并返回
			eid: function(element) {
				return element._eid || (element._eid = this._eid++)
			},
			//遍历处理函数
			eachEvent: function(events, fn, iterator) {
				if (events instanceof Object) {
					Query.prototype.each.call(events, iterator);
				} else  {
					Query.prototype.each.call(events.split(/\s/), function(index, type){
						iterator(type, fn);
					})
				}
			},	
			//解析事件类型，返回一个包含事件名称和事件命名空间的对象
			parse: function(event) {
			 	var parts = ('' + event).split('.');
			 	return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
			},
			// 生成命名空间的正则
			matcherFor: function(ns) {
				return new RegExp('(?:^|)' + ns.replace('', '.*?') + '(?: |$)');
			},
			//查找绑定在元素上的指定类型的事件处理函数集合
			findHandlers: function(element, event, fn, selector) {
				event = this.parse(event);
				if (event.ns) {
					var matcher = this.matcherFor(event.ns);					
				}
				return (this.handlers[this.eid(element)] || []).filter(function(handler){
					return handler
						&& (!event.e  || handler.e == event.e)
						&& (!event.ns || matcher.test(handler.ns))
						&& (!fn  	  || Event.eid(handler.fn) === Event.eid(fn))
						&& (!selector || handler.sel == selector)
				})
			},
			// 给元素绑定监听事件；参数：第一个为dom，第二个为事件名称，第三个为回调函数，第四个为处理回调函数的方法，第五个为是否冒泡
			add: function(element, events, fn, selector, getDelegate, capture) {
				// 是否冒泡
				capture = !!capture;
				// 1，取出当前id元素上已绑定的事件，不存在则创建
				var id = this.eid(element), set = (this.handlers[id] || (this.handlers[id] = []));
				// 2，遍历处理函数，传参：第一个为事件名，第二个为本身的回调函数，第三个为回调处理函数（用来遍历处理函数，会传入事件名与本身回调），
				this.eachEvent(events, fn, function(event, fn){
					// 事件委托
					var delegate = getDelegate && getDelegate(fn, event), callback = delegate || fn;
					var proxyfn = function(event) {
						var result = callback.call(element, event);
						//当事件处理函数返回false时，阻止默认操作
						if (result === false) {
							event.preventDefault();
						}
						return result;
					}
					// 3，使用parse解析事件类型，创建handler对象
					var handler = Query.extend(Event.parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
					// 4，将handler对象存入函数集中
					set.push(handler);
					// 5，调用addEventListener绑定事件
					element.addEventListener(handler.e, proxyfn, capture);
				})
			},
			// 注销事件监听
			remove: function(element, events, fn, selector) {
				// 1，根据dom获取唯一id
				var id = this.eid(element);
				// 2，调用eachEvent方法依次处理
				this.eachEvent(events || '', fn, function(event, fn){
					// 3，根据findHandler找到当前type的事件类型集合
					Event.findHandlers(element, event, fn, selector).forEach(function(handler){
						// 4，删除数据句柄，然后移除dom事件
						delete Event.handlers[id][handler.i];
						element.removeEventListener(handler.e, handler.proxy, false);
					})
				})
			}
		};
		Query.extend(Query.prototype, {
			// 事件绑定
			bind: function(event, callback) {
				return this.each(function(i, element){
					Event.add(element, event, callback)
				})
			},
			// 取消事件绑定
			unbind: function(event, callback) {
				return this.each(function(){
					Event.remove(this, event, callback);
				})
			},
			//事件委托
			delegate: function(selector, event, callback) {
				var capture = false;

				return this.each(function(i, element){
					Event.add(element, event, callback, selector, function(callback){
						return function(e) {
							//以当前触发元素为上下文，查找与目标元素相匹配的父级元素，若存在则执行回调
							var evt, match = Query(e.target).closest(selector, element).get(0);
							if (match) {
								return callback.apply(match);
							}
						}
					}, capture)
				})
			},
			// 取消事件委托
			undelegate: function(selector, event, callback) {
				return this.each(function(){
					Event.remove(this, event, callback, selector);
				})
			},
			// 添加事件监听综合方法
			on: function(event, selector, callback) {
				return selector == undefined || toString.call(selector) === '[object Function]' ?
				this.bind(event, selector) : this.delegate(selector, event, callback);
			},
			// 撤消事件监听综合方法
			off: function(event, selector, callback) {
				return selector == undefined || toString.call(selector) === '[object Function]' ?
				this.unbind(event, selector) : this.undelegate(selector, event, callback);
			}
		});
		// 事件快捷绑定
		;('focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover' + 
		'mouseout change select keydown keypress keyup error').split(' ').forEach(function(event) {
		    Query.prototype[event] = function(callback){ return this.bind(event, callback) }
		});

		function Query(selector, context) {
			return Query.init(selector, context);
		}		
		return Query;
	})(_extend);
	

	// 用来创建新的类，或从现有的继承;可以通过传参添加拓展成员:instances 为实例成员，statics 为类的静态成员
	Controller.extend = Model.extend = function(protoProps, staticProps) {
		var child, parent = this;
		child = function(){ return parent.apply(this, arguments) };

		var ctor = function(){ this.constructor = child }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;

		_extend(child, parent, staticProps);
		if (protoProps) _extend(child.prototype, protoProps);

		return child;
	}

}).call(this);
