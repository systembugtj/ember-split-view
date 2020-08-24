/* eslint max-len: 0 */
/* eslint new-cap: ["error", { "capIsNew": false }]*/
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { next, scheduleOnce } from '@ember/runloop'
import SplitChild from './split-child';
import splitViewLayout from 'ember-split-view/templates/components/split-view';


/**
 * This class represents a view that is split either vertically or horizontally.
 * The split view is composed of three child views: a left or top view, a sash
 * view, and a right or bottom view.  The sash may be dragged to change the
 * relative width or height of the child views.
 *
 * Vertical SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=true}}
 *   {{#split-child}}
 *     Content of the left view here.
 *   {{/split-child}}
 *   {{split-sash"}}
 *   {{#split-child}}
 *     Content of the right view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * Horizontal SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=false}}
 *   {{#split-child}}
 *     Content of the top view here.
 *   {{/split-child}}
 *   {{split-sash"}}
 *   {{#split-child}}
 *     Content of the bottom view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * @cLass SplitViewComponent
 * @extends Ember.Component
 */
export default Component.extend({
  layout: splitViewLayout,
  /**
   * @property {boolean} isVertical - the orientation of the split: true = vertical, false = horizontal
   * @default true
   */
  isVertical: true,

  /**
   * @property {Number} splitPosition - the position of the split in pixels
   * @default 50
   */
  splitPosition: 250,

  splits: null,
  isDragging: false,
  isRoot: false,
  classNames: ['split-view'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal'],

  init() {
    this._super();
    this.set('splits', A());
  },

  didInsertElement(...args) {
    this._super(...args);

    const parentView = this.parentView;
    const isRoot = !(parentView instanceof SplitChild);

    // run next to avoid changing the component during a render iteration
    next(this, () => {
      this.set('isRoot', isRoot);
      const resizeService = this.resizeService;

      if (!isRoot) {
        parentView.set('childSplitView', this);
        if (resizeService) {
          resizeService.off('didResize', this, this.didResize);
        }
      } else {
        // only need width and height on root split-view
        // split-child passes it down the tree for nested ones
        if (resizeService) {
          resizeService.on('didResize', this, this.didResize);
        }
      }
      next(this, () => {
        this._setStyle();
      });
      scheduleOnce('afterRender', this, () => {
        // must do this in afterRender so that the parent has calculated its width and height
        const element = this.$();
        this.set('width', element.width());
        this.set('height', element.height());
      });
    });
  },

  willDestroyElement() {
    this._super();
    const resizeService = this.resizeService;
    if (resizeService) {
      resizeService.off('didResize', this, this.didResize);
    }
  },

  didResize() {
    const element = this.$();
    this.set('width', element.width());
    this.set('height', element.height());
    this.constrainSplit();
  },

  _setStyle() {
    const style = this.element.style;
    if (this.isRoot) {
      // let the DOM know our minimum size
      const isVertical = this.isVertical;
      const size = `${this.minSize}px`;
      if (isVertical) {
        style.minWidth = size;
        style.minHeight = null;
      } else {
        style.minWidth = null;
        style.minHeight = size;
      }
    } else {
      style.minWidth = null;
      style.minHeight = null;
    }
  },

  styleChanged: observer('isVertical', 'minSize', 'isRoot',
    function () {
      this._setStyle();
    }
  ),

  addSplit(split) {
    const splits = this.splits;
    splits.addObject(split);

    if (splits.length === 2) {
      this.updateOrientation();
    }
  },

  removeSplit(split) {
    this.splits.removeObject(split);
  },

  updateOrientation: observer('isVertical',
    function () {
      const splits = this.splits;
      const leftOrTop = splits.objectAt(0);
      const rightOrBottom = splits.objectAt(1);

      if (this.isVertical) {
        leftOrTop.set('anchorSide', 'right');
        rightOrBottom.set('anchorSide', 'left');
      } else {
        leftOrTop.set('anchorSide', 'bottom');
        rightOrBottom.set('anchorSide', 'top');
      }
    }
  ),

  constrainSplit: observer('sash.width', 'width', 'height', 'isVertical',
    function () {
      const splits = this.splits;
      const leftOrTop = splits.objectAt(0);
      const rightOrBottom = splits.objectAt(1);

      if (leftOrTop) {
        const minLeftOrTopPosition = leftOrTop.get('minSize');

        if (this.splitPosition < minLeftOrTopPosition) {
          this.set('splitPosition', minLeftOrTopPosition);
        }
      }

      const size = this.isVertical ? this.width : this.height;
      if (rightOrBottom) {
        const minRightOrBottomPosition = size - rightOrBottom.get('minSize');

        if (this.splitPosition > minRightOrBottomPosition) {
          this.set('splitPosition', minRightOrBottomPosition);
        }
      }
    }
  ),

  minSize: computed('splits.@each.minSize', 'sash.width',
    function () {
      let result = 0;
      const children = this.splits;
      for (let i = 0; i < children.length; i += 1) {
        result += children[i].get('minSize');
      }
      result += (children.length - 1) * this.get('sash.width');
      return result;
    }
  ),

  mouseUp() {
    this.set('isDragging', false);
  },

  mouseLeave() {
    this.set('isDragging', false);
  },

  mouseMove(event) {
    if (!this.isDragging) {
      return;
    }

    let position = 0;

    const offset = this.$().offset();
    if (this.isVertical) {
      position = event.pageX - offset.left;
    } else {
      position = event.pageY - offset.top;
    }

    this.set('splitPosition', position);
    this.constrainSplit();
  },

});
