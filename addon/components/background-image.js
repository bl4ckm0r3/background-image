import Ember from 'ember';
const {
  computed,
  computed: {
    notEmpty
  },
  Component,
  getWithDefault,
  Handlebars: {
    SafeString
  }, 
  Logger,
  on,
  run
} = Ember;

const get = Ember.get;
const set = Ember.set;

export default Component.extend({
  tagName: '',

  loader: computed(() => new Image()),

  src: '/images/loader.svg',

  isLoaded: notEmpty('loadedImg'),

  loadedImg: null,

  styleBindings: ['opacity', 'background-image', 'width', 'background-repeat'],

  styleAttrs: null,

  updateSizeAttr: ['width', 'height'],

  computedStyle: computed('styleBindings.[]', 'src', 'isLoaded', 'styleAttrs.[]', {
    get() {
      const isLoaded = this.get('isLoaded');

      if (!isLoaded) {
        // Render Loader
        const src = this.get('src');
        const loaderStyle = `background-image: url('${src}')`;
        return new SafeString(loaderStyle);
      }

      const styleAttrs = this.get('styleAttrs');

      const style = Array.from(styleAttrs.entries()).reduce((prev, [k, v]) => `${prev}${k}:${v};`, '');
      return new SafeString(style);
    }
  }).readOnly(),

  isPortrait: computed('loadedImg', {
    get() {
      const img = get(this, 'loadedImg');
      return img ? (img.width / img.height) < 1 : null;
    }
  }).readOnly(),

  parseStyleAttr: on('didReceiveAttrs', function({ newAttrs }) {
    const styleBindings = getWithDefault(this, 'styleBindings', []);

    const newStyle = new Map(styleBindings
      .filter((key) => !!newAttrs[key])
      .map((key) =>  [key, newAttrs[key]]));

    set(this, 'styleAttrs', newStyle);
  }),

  loadImage: on('didReceiveAttrs', function() {
    const url = get(this, 'url');

    if (url === get(this, 'src')) {
      return;
    }

    set(this, 'loadedImg', null);

    const imageLoader = get(this, 'loader');
    const handleWith = (eventName) => (e) => run(() => this.send(eventName, url, imageLoader, e));

    imageLoader.onload = handleWith('didLoad');
    imageLoader.onerror = handleWith('loadError');
    imageLoader.src = url;
  }),

  actions: {
    didLoad(url, image) {
      const styleAttrs = get(this, 'styleAttrs');
      const updateSizeAttr = getWithDefault(this, 'updateSizeAttr', []);
      const newSizes = updateSizeAttr.reduce((prev, curr) => {
        prev.push([curr, `${image[curr]}px`]);
        return prev;
      }, []);

      const bg = ['background-image', `url('${url}')`];
      const newAttrs = new Map([...styleAttrs, ...newSizes, bg]);

      run(() => {
        set(this, 'styleAttrs', newAttrs);
        set(this, 'src', url);
        set(this, 'loadedImg', image);

        image.onload = null;
        image.onerror = null;

        if (this.attrs && this.attrs.didLoad) {
          this.attrs.didLoad(url, image);
        }
      });
    },

    loadError(url, image) {
      Logger.error(`Could not load ${url}`);
      image.onload = null;
      image.onerror = null;

      if (this.attrs && this.attrs.loadError) {
        this.attrs.loadError(url, image);
      }
    }
  }
});
