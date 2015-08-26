import bound from './bound';

export default function bind(proto, key){
  var desc = Object.getOwnPropertyDescriptor(proto, key);
  Object.defineProperty(proto, key, bound(proto, key, desc));
}
