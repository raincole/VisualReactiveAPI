# API of Visual Reactive project

## Functions

### VRAC.renderApp(program)

+ **program**: A [Program](#program) generated by main editor.
  
  **return value**: A web [App](#app).

## Data Structures

### UID

The unique ID of almost everything. There are 3 kinds of UID:

1. 16-character random string that consists of numbers and uppercase letters, like `7AL0E139CJ31014A`.
2. User-defined HTML element ID. Must start with `#VRAC`, like `#VRAC-TWD-field`.
3. Reserved UID. Such as `document`(`document` of DOM), `timer`(simulating `setTimeout`), `initial`. 

### Program

The top-level structure representing the whole of a web app.

```javascript
{
  widgets: {
    "TT9FRYJJC6ELQLLA": ...,
  },
  signals: {
    "7AL0E139CJ31014A": ...,
    "8KAN1O015CGA10BK": ...,
    ...
  },
}
```

+ **widgets**: A dictionary of [Widget](#widget). For now it contains only one main widget.
+ **signals**: The other stuffs besides HTML code. An element can be a [Action](#action), an [Element](#event), an [Event](#event), an [Attribute](#attribute) or a [Constant](#constant).

### Widget

A widget, including its HTML and CSS code.

```javascript
{
  uid: "TT9FRYJJC6ELQLLA",
  html: "<div>\n<form>...",
  css: ".twd-amount { width: 50px; }\n...",
}
```

### Signal

When we mention [Signal](#signal) in this specification, it can be a [Action](#action), an [Element](#event), an [Event](#event), an [Attribute](#attribute) or a [Constant](#constant).

### Action

A general-purpose function.

```javascript
{
  uid: "5TEJD01MWE4R5DG5",
  name: "twdToUsd",
  parameters: [...],
  body: "var rate = 30.1;\nreturn twd / rate;\n",
}
```

+ **uid**: [UID](#uid).
+ **name**: (optional) String. The name of this action.
+ **parameters**: An array of [Parameter](#parameter)s. The parameters of this action.
+ **body**: String. The body of this action.

### Parameter

A parameter of certain [Action](#action).

```javascript
{
  name: "twd",
  valueRef: "GDTKI0ANM4IR48US",
}
```

+ **name**: String. The name of this parameter.
+ **valueRef**: [UID](#uid). (optional) A reference to the [Signal](#signal) linked to this parameter. **Note:** If it's null, the value of parameter is `undefined`(not `null`!).

### Element

An HTML element in a certain [Widget](#widget).

```javascript
{
  uid: "#VRAC-twd-field",
  widgetRef: "TT9FRYJJC6ELQLLA",
  selector: "#VRAC-twd-field",
}
```

+ **uid**: [UID](#uid). Generally it's defined by user and with prefix `#VRAC`.
+ **widgetRef**: [UID](#uid). A reference to the widget this element belongs to.
+ **selector**: String. The selector used to select this element in its parent widget. For now it's the same as `uid`.

### Event

An DOM Event of a certain [Element](#element) or `document`.

```javascript
{
  uid: "AA9DH50KX81UES21",
  elementRef: "P4P8TIOTU9LGDSBF",
  type: "click",
}
```

+ **uid**: [UID](#uid).
+ **elementRef**: [UID](#uid). A reference to the element this event is emitted from.
+ **type**: String. The name of this event. Generally it should be equal to standard [Event.type](https://developer.mozilla.org/en-US/docs/Web/API/event.type).

### Attribute

An attribute of a certain [Element](#element) or `document`.

```javascript
{
  uid: "O6ZWLUYPPXN042SK",
  elementRef: "P4P8TIOTU9LGDSBF",
  name: "value",
}
```

+ **uid**: [UID](#uid).
+ **elementRef**: [UID](#uid). A reference to the element this attribute belongs to.
+ **name**: String. The name of this attribute. Generally it should be one of standard [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).

### Constant

A constant.

```javascript
{
  uid: "HMZ3G30E5CNQ7D2N",
  type: "String",
  value: "post"
}
```

+ **uid**: [UID](#uid).
+ **type**: String. The type of this constant. 
+ **value**: The value of this constant.

### App

A rendered web app.

```javascript
{
  files: [
    { path: "index.html", content: "<html>\n<body>\n..." },
    { path: "main.js", content: "$(document).ready(function(){\n..." },
    { path: "main.css", content: ".twd-amount {\n..." }
  ]
}
```

+ **files**: A bunch of files that make up this web app.

# Webview Context

## Function

`var Webview = VRAC.Webview`

### Webview.loadAndParseHtml(html, css)

To load and parse the HTML code of a widget.

+ **html**: String. The HTML code of a widget.
+ **css**: String. The CSS code of a widget.

**return value**: An array of [UserElement](#userelement).

### Webview.startSelecting()

To start selecting element in the Webview. The [UserElement](#userelement) under the cursor would be highlighten.

### Webview.stopSelecting()

To stop [startSelecting()](#startSelecting).

### Webview.getCurrentUserElement()

Get the details of the innermost [UserElement](#userelement) under the cursor.

**return value**: 

```javascript
{
  uid: "#VRAC-TWD-field",
  events: ['click', 'change', ...],
  attributes: ['value', 'class', 'name', ...],
}
```

+ **uid**: The UID of current [UserElement](#userelement).
+ **events**: The events that current element can emit. See also [Event](#event).
+ **attributes**: The attributes that current element has. See also [Attribute](#attribute).

## Data Structure

### UserElement

```javascript
{
  uid: "#VRAC-TWD-field",
  clientRect: {
    left: 10,
    top: 20,
    right: 15,
    bottom: 30,
    width: 5,
    height: 10,
  },
}
```
