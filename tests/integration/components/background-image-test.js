import emberQunit from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { run } = Ember;
const { moduleForComponent, test } = emberQunit;

moduleForComponent('background-image', 'Integration: component:background-image', {
  integration: true
});

test('it will parse and render the right attributes', function(assert) {
  assert.expect(6);
  const img = "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
  
  this.render(hbs`
    {{background-image class='test_class' opacity=1 width='100px' url='data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'}}
  `);
  const done = assert.async();

  run.later(() => {
    assert.equal(this.$('div').length, 1, 'it loads');
    assert.ok(this.$('div').hasClass('test_class'), 'it has the right class');
    assert.equal(this.$('.test_class').css('background-image'), `url("${img}")`, 'it has the right background');
    assert.equal(Ember.$('.test_class').css('opacity'), 1, 'it has the right opacity');
    assert.equal(Ember.$('.test_class').css('width'), '16px', 'it has the right width');
    assert.equal(Ember.$('.test_class').css('height'), '16px', 'it has the right height');
    done();
  }, 1);
});

test('it will execute loadError callback', function(assert) {
  assert.expect(1);
  const done = assert.async();
  this.set('loadErrorExternal', (s) => run(() => {
      assert.ok(true, `Logger called when passing ${s}`);
      done();
    })
  );

  this.render(hbs`
    {{background-image loadError=(action loadErrorExternal) url=null}}
  `);
});

test('it will call didLoad external action', function(assert) {
  assert.expect(1);
  const done = assert.async();

  this.set('didLoadExternal', () => {
    assert.ok(true, 'called external didload');
    done();
  });

  this.render(hbs`
    {{background-image didLoad=(action didLoadExternal) url='data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'}}
  `);
});
