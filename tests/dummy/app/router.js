import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('vertical');
  this.route('horizontal');
  this.route('verticalcomposite');
  this.route('horizontalcomposite');
  this.route('composite');
  this.route('collapsible');
});

export default Router;
