
See it in action: http://bryanhunt.github.io/#/split

There is a demo app in [tests/dummy](https://github.com/BryanHunt/ember-split-view/tree/master/tests/dummy).

## Installation

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

## Configuration

You need to add the following to your `config/environment.js`:
```javascript
resizeServiceDefaults: {
  debounceTimeout    : 200,
  heightSensitive    : true,
  widthSensitive     : true,
  injectionFactories : [ 'view', 'component']
},
```

### Examples
Vertical SplitView example:

```
{{#split-view isVertical=true as |split| }}
  {{#split.child}}
    Content of the left view here.
  {{/split.child}}
  {{split.sash}}
  {{#split.child}}
    Content of the right view here.
  {{/split.child}}
{{/split-view}}
```

Horizontal SplitView example:

```
{{#split-view isVertical=false as |split|}}
  {{#split.child}}
    Content of the top view here.
  {{/split.child}}
  {{split.sash}}
  {{#split.child}}
    Content of the bottom view here.
  {{/split.child}}
{{/split-view}}
```

### Donating

All donations will support this project and keep the developer supplied with Reese's Minis.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

