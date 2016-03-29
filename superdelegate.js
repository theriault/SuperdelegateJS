/**
 * Superdelegate v0.4.1
 * Copyright (c) 2016 Theriault
 */
;(function (root) {
	var Superdelegate = {};
	var eventRegister = {};
	var modules = {};
	var options = {"superdelegate": "super", "subdelegate": "sub"};
	var delegationHandle = function (e) {
		if (e._delegation && e._delegation.eventSub) {
			modules[e._delegation.super].handles[e._delegation.eventSub].call(e.sub, e);
		}
		if (e._delegation && e._delegation.eventSuper) {
			modules[e._delegation.super].handles[e._delegation.eventSuper].call(e.super, e);
		}
		if (!e.bubbles) {
			e.target.removeEventListener(e.type, delegationHandle, false);
		}
	};
	var stopDelegation = function () {
		this._delegation = null;
	};
	var captureEventHandle = function (e) {
		var p = e.target;
		var subdelegate = null, subdelegateAttr = null, superdelegate = null, superdelegateAttr = null;
		while (p.getAttribute) {
			if (subdelegate === null) {
				subdelegateAttr = p.getAttribute("data-" + options.subdelegate);
				if (subdelegateAttr !== null) {
					subdelegate = p;
				}
			}
			if (superdelegate === null) {
				superdelegateAttr = p.getAttribute("data-" + options.superdelegate);
				if (superdelegateAttr !== null) {
					superdelegate = p;
					break;
				}
			}
			p = p.parentNode;
		}
		if (superdelegate === null) return;
		if (!(superdelegateAttr in modules)) return;
		
		// delegation is possible, allow stopping it
		e.stopDelegation = stopDelegation;
		
		var mod = modules[superdelegateAttr];
		
		var eventSub = subdelegate !== null ? e.type + "-" + subdelegateAttr : "";
		var eventSuper = e.type;
		
		var hasSub = eventSub in mod.handles;
		var hasSuper = eventSuper in mod.handles;
		
		if (!hasSub && !hasSuper) {
			return;
		}
		
		e.sub = subdelegate;
		e.super = superdelegate;

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
		
		e._delegation = {
			"super": superdelegateAttr,
			"sub": subdelegateAttr
		};
		if (hasSub) {
			e._delegation.eventSub = eventSub;
		}
		if (hasSuper) {
			e._delegation.eventSuper = eventSuper;
		}
		if (!e.bubbles) {
			e.target.addEventListener(e.type, delegationHandle, false);
		}
	};
	var bubbleEventHandle = function (e) {
		delegationHandle(e);
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
				root.document.addEventListener(i, captureEventHandle, true);
				root.document.addEventListener(i, bubbleEventHandle, false);
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
					root.document.removeEventListener(i, captureEventHandle, true);
					root.document.removeEventListener(i, bubbleEventHandle, false);
				}
			}
		}
		delete modules[name];
		return Superdelegate;
	};
	
	root.Superdelegate = Superdelegate;
})(window);
