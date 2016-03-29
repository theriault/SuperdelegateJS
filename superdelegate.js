/**
 * Superdelegate v0.1.0
 * Copyright (c) 2016 Theriault
 */
;(function (root, doc) {
	var Superdelegate = {};
	var eventRegister = {};
	var modules = {};
	var options = {"superdelegate": "super", "subdelegate": "sub"};
	var listener = function (e) {
		var p = e.target;
		var subdelegate = null, subdelegateAttr = null, superdelegate = null, superdelegateAttr = null;
		do {
			if (subdelegate === null) {
				subdelegateAttr = p.getAttribute("data-" + options.subdelegate);
				if (subdelegateAttr) {
					subdelegate = p;
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
		e.super = superdelegate;
		if (subdelegate !== null) {
			var eventName = e.type + "-" + subdelegateAttr;
			var target = subdelegate;
		} else {
			var eventName = e.type;
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
		if (eventName in mod.handles) {
			return mod.handles[eventName].call(target, e);
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
				doc.addEventListener(i, listener);
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
					doc.removeEventListener(i, listener);
				}
			}
		}
		delete modules[name];
		return Superdelegate;
	};
	
	root.Superdelegate = Superdelegate;
})(window, document);
