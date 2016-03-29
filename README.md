# SuperdelegateJS
Super delegation for Javascript &mdash; delegate all events including ones that don't bubble.

## How to use it
Include superdelegate.js:
```html
<script src="superdelegate.js"></script>
```
Register a superdelegate:
```javascript
Superdelegate.register(name, eventMap[, data]);
```
Argument | Description
---------|------------
`name` | Unique name of the superdelegate to register. This will be delegated through `data-super` in your HTML. 
`eventMap` | Map of events where the keys are an event type (`click`, `mousedown`, `keydown`, `blur`, `submit`, `load`, `focusout`, etc.), followed by a dash, followed by a subdelegate name (which will be delegated through `data-sub` in your HTML). The dash and subdelegate name may be omitted to provide an event handler directly for the `data-super` element.
`data` | Optional argument that will be passed through to all event handlers via `Event.data`

Example usage:
```html
<script>
Superdelegate.register("dismissable", {
  "click-close": function (e) {
    $(e.super).remove(); // 'e.super' points to the data-super element
    return false;
  },
  "click-alert": function (e) {
    alert(this.dataset.message); // 'this' points to the data-sub element
  }
});
</script>
<div data-super="dismissable">
  This is dismissable <a href="#" data-sub="close">&times;</a>
</div>
<div data-super="dismissable">
  This is also <a href="#" data-sub="alert" data-message="Hello World"><strong>dismissable</strong></a>. <a href="#" data-sub="close">Close</a>
</div>
```

### Event object
Each event handler's Event object will be augmented with the following properties.

#### Event.stopDelegation()
Call `Event.stopDelegation` to prevent the delegation events from happening. This also happens if `Event.stopPropagation` is called on events that bubble or `Event.stopImmediatePropagation` is called on events that don't bubble.

#### Event.super

`Event.super` will point to the parent `data-super` element.

#### Event.data
This will be the 3rd argument of `Superdelegate.register` for the corresponding superdelegate. See the example for `Event.instanceData`

#### Event.instanceData
`Event.instanceData` will be available if the parent `data-super` element has a `data-id` attribute. You can use this to maintain a separate data object per unique `data-id`.

Example:
```html
<div data-super="dialog" data-id="1">
 <label>Your name: <input type="text" name="name" data-sub="name" /></label> <button type="button" data-sub="say-name">Say hello</button>
</div>
<div data-super="dialog" data-id="2">
 <label>Another name: <input type="text" name="name" data-sub="name" /></label> <button type="button" data-sub="say-name">Say hello</button>
</div>
<div data-super="dialog" data-id="1">
  <button type="button" data-sub="say-name">Say hello to yourself from somewhere else</button>
</div>

<script>
Superdelegate.register("dialog", {
  "blur-name": function (e) {
    e.data.lastName = this.value;
    e.instanceData.name = this.value; 
  },
  "click-say-name": function (e) {
    alert("Hello " + (e.instanceData.name || "nobody") + "! The last name entered was: " + e.data.lastName);
  }
}, {"lastName": ""});
</script>
```

### Superdelegate event handlers

You can also pass event handlers for the superdelegate itself by omitting the dash and subdelegate name in the event map. Inside these event handlers, `this` will point to the `data-super` element. If a subdelegate event calls `Event.stopDelegation` though, then the superdelegate event will not be called.

Example:
```html
<script>
Superdelegate.register("test-module", {
  "click": function (e) {
    alert("You clicked the superdelegate.");
  },
  "click-child": function (e) {
    alert("You clicked the subdelegate.");
  }
});
</script>
<div data-super="test-module" style="padding:20px;background-color:#F00;">
  <div data-sub="child" style="padding:20px;"></div>
</div>
```
