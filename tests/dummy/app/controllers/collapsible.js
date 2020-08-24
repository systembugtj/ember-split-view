import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    collapseLeft: function() {
      this.leftChild.collapse();
    },
    collapseRight: function() {
      this.rightChild.collapse();
    }
  }
});
