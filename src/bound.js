export default bound;

function bound(target, key, {value, configurable, enumerable, writable}){
  return {
    configurable,
    enumerable,

    // on set replace the property descriptor
    set: function(newValue){
      if (this !== target || !writable) {
        throw new Error(`class-bind: bound property '${key}' is not writable`)
      }

      // call this function again with a different value
      var descriptor = bound(target, key, {
        configurable, enumerable, value: newValue
      });

      Object.defineProperty(this, key, descriptor);
    },

    get: function getter(){
      // e.g. App.prototype.returnsFoo doesn't mess up the property
      if (this === target) return value;

      // in development we return it every time so that react-hot-loader
      // works
      if (process.env.NODE_ENV !== 'production') {
        return value.bind(this);
      }

      // for production we shadow the accessor property descriptor
      // with a simple property descriptor containing the bound function
      Object.defineProperty(this, key, {
        configurable, enumerable, writable,
        value: value.bind(this),
      });

      return this[key];
    },
  };
}
