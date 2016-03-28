/**
 * Superdelegate v0.1.0
 * Copyright (c) 2016 Theriault
 */
;(function (root) {
	var Superdelegate = {};
	var eventRegister = {};
	var modules = {};
	var options = {"superdelegate": "module", "delegate": "bind"};
	var listener = function (e) {
		var p = e.target;
		var delegate = null, delegateAttr = null, superdelegate = null, superdelegateAttr = null;
		do {
			if (delegate === null) {
				delegateAttr = p.getAttribute("data-" + options.delegate);
				if (delegateAttr) {
					delegate = p;
				}
			}
			if (superdelegate === null) {
				superdelegateAttr = p.getAttribute("data-" + options.superdelegate);
				if (superdelegateAttr) {
					superdelegate = p;
				}
			}
			if (superdelegate !== null) {
				break;
			}
			p = p.parentNode;
		} while (p.parentNode);
		if (superdelegate === null) return;
		if (!(superdelegateAttr in modules)) return;
		var mod = modules[superdelegateAttr];
		if (delegate !== null) {
			var event_name = e.type + "-" + delegateAttr;
			e.super = superdelegate;
			var target = delegate;
		} else {
			var event_name = e.type;
			var target = superdelegate;
		}
		var id = superdelegate.getAttribute("data-id") || "";
		if (id.length) {
			if (!(id in mod.instanceData)) {
				mod.instanceData[id] = {};
			}
			e.instanceData = mod.instanceData[id];
		}
		if ("data" in mod) {
			e.data = mod.data;
		}
		if (event_name in mod.handles) {
			return mod.handles[event_name].call(target, e);
		}
	};
	Superdelegate.option = function (name, value) {
		if (value === undefined) {
			return options[name];
		} else {
			options[name] = value;
		}
	};
	Superdelegate.register = function (name, handlers, data) {
		var eventMap = {};
		for (var i in handlers) {
			var eventType = i.split('-')[0];
			eventMap[eventType] = true;
		}
		for (var i in eventMap) {
			if (i in eventRegister) {
				eventRegister[i][name] = true;
			} else {
				root.jQuery(root.document).on(i + ".superdelegate", listener);
				eventRegister[i] = {};
				eventRegister[i][name] = true;
			}
		}
		if (!(name in modules)) {
			modules[name] = {"instanceData": {}};
		}
		modules[name].handles = handlers;
		modules[name].data = data;
		return Superdelegate;
	};
	
	Superdelegate.unregister = function (name) {
		if (!(name in modules)) {
			return Superdelegate;
		}
		var handlers = modules[name].handlers;
		var eventMap = {};
		for (var i in handlers) {
			var eventType = i.split('-')[0];
			eventMap[eventType] = true;
		}
		for (var i in eventMap) {
			if (i in eventRegister) {
				delete eventRegister[i][name];
				var has = false;
				for (var i2 in eventRegister[i]) {
					has = true;
					break;
				}
				if (!has) {
					root.jQuery(root.document).off(i + ".superdelegate");
				}
			}
		}
		delete modules[name];
		return Superdelegate;
	};
	
	root.Superdelegate = Superdelegate;
})(window);
