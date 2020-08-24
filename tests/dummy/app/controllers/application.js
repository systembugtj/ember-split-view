import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';

export default Controller.extend({
  tabs: A([
    EmberObject.create({ title: "Vertical", content: 'vertical'}),
    EmberObject.create({ title: "Horizontal", content: 'horizontal'}),
    EmberObject.create({ title: "Vertical Composite", content: 'verticalComposite'}),
    EmberObject.create({ title: "Horizontal Composite", content: 'horizontalComposite'}),
    EmberObject.create({ title: "Composite", content: 'composite'}),
    EmberObject.create({ title: "Collapsible Panes", content: 'collapsiblePanes'}),
  ])
});
