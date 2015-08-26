import bind from './bind';

export default function bindAll(proto){
  Object.getOwnPropertyNames(proto)
    .forEach((key) => {
      if (typeof proto[key] === 'function') {
        bind(proto, key);
      }
    });
}
