# SuperdelegateJS
Super delegation for Javascript. This library requires [jQuery](https://github.com/jquery/jquery).

## How to use it
Include superdelegate.js alongside jQuery:
```html
<script src="https://code.jquery.com/jquery-2.2.2.min.js" integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=" crossorigin="anonymous"></script>
<script src="superdelegate.js"></script>
```
Register a superdelegate:
```javascript
Superdelegate.register(name, eventMap[, data]);
```
`name` is the unique name of the superdelegate to register (which will be delegated through `data-module` in your HTML). `eventMap` is a map of events where the keys are an event type (`click`, `focusout`, `keydown`, etc.), followed by a dash, followed by a subdelegate name (which will be delegated through `data-bind` in your HTML). The values of `eventMap` are the event handlers. The first argument passed to each event handler will be an extended jQuery Event object (see below). Inside the event handlers, `this` will point to the `data-bind` element. `data` is an optional third argument. This value will be exposed to all event handlers through `Event.data`

Example usage:
```html
<script>
Superdelegate.register("dismissable", {
  "click-close": function (e) {
    $(e.super).remove(); // 'e.super' points to the data-module element
    return false;
  },
  "click-alert": function (e) {
    alert($(this).data("message")); // 'this' points to the data-bind element
  }
});
</script>
<div data-module="dismissable">
  This is dismissable <a href="#" data-bind="close">&times;</a>
</div>
<div data-module="dismissable">
  This is also <a href="#" data-bind="alert" data-message="Hello World"><strong>dismissable</strong></a>. <a href="#" data-bind="close">Close</a>
</div>
```

### Extended jQuery Event object
The standard jQuery Event object will have a few more properties available in every event.

#### Event.super

`Event.super` will point to the parent `data-module` element inside each event.

#### Event.data
This will be the 3rd argument when `Superdelegate.register` was called. See the example for `Event.instanceData`

#### Event.instanceData
`Event.instanceData` will be available if the parent `data-module` element has a `data-id` attribute. You can use this to maintain a separate data object per unique `data-id`. See example below.

Example:
```html
<div data-module="dialog" data-id="1">
 <label>Your name: <input type="text" name="name" data-bind="name" /></label> <button type="button" data-bind="say-name">Say hello</button>
</div>
<div data-module="dialog" data-id="2">
 <label>Another name: <input type="text" name="name" data-bind="name" /></label> <button type="button" data-bind="say-name">Say hello</button>
</div>
<div data-module="dialog" data-id="1">
  <button type="button" data-bind="say-name">Say hello to yourself from somewhere else</button>
</div>

<script>
Superdelegate.register("dialog", {
  "focusout-name": function (e) {
    e.data.lastName = this.value;
    e.instanceData.name = this.value; 
  },
  "click-say-name": function (e) {
    alert("Hello " + (e.instanceData.name || "nobody") + "! The last name entered was: " + e.data.lastName);
  }
}, {"lastName": ""});
</script>
```

### Superdelegate events

You can also pass events to be handled by the superdelegate element by omitting the dash and subdelegate name in the event map. Inside these events, `this` will point to the `data-module` element.

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
<div data-module="test-module" style="padding:20px;background-color:#F00;">
  <div data-bind="child" style="padding:20px;"></div>
</div>
```
