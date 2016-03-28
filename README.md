# SuperdelegateJS
Super delegation for Javascript. This library requires [jQuery](https://github.com/jquery/jquery).

## How to use it
Include superdelegate.js alongside jQuery:
```html
<script src="https://code.jquery.com/jquery-2.2.2.min.js" integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=" crossorigin="anonymous"></script>
<script src="superdelegate.js"></script>
```
Register a superdelegate:
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
```
Use it in your HTML:
```html
<div data-module="dismissable">
  This is dismissable <a href="#" data-bind="close">&times;</a>
</div>
<div data-module="dismissable">
  This is also <a href="#" data-bind="alert" data-message="Hello World"><strong>dismissable</strong></a>. <a href="#" data-bind="close">Close</a>
</div>
```
