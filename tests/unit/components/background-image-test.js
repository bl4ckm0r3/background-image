import emberQunit from 'ember-qunit';
import Ember from 'ember';

const { run } = Ember;
const { moduleForComponent, test } = emberQunit;

moduleForComponent('background-image', 'component:background-image', {
  unit: true
});

test('will load an image', function(assert) {
  assert.expect(1);
  const img = "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
  let component;

  run(() => {
    component = this.subject({
      url: img
    });
  });

  run.next(() => {
    assert.equal(component.get('src'), img, 'the component loaded the right image');
  });
});
