import test from 'tape';
import bindAll from '../src/bindAll';

test('bind', (t) => {
  t.test('binds', (t) => {
    class C {
      constructor(){ this.x = 1; this.y = 2 }

      foo(){ return this.x }
      bar(){ return this.y }
    }

    // sanity
    t.test('sanity', (t) => {
      const {foo, bar} = new C();
      t.notOk(foo.call({}));
      t.notOk(bar.call({}));

      t.end();
    });

    t.test('actual', (t) => {
      bindAll(C.prototype);
      const {foo, bar} = new C();
      t.equal(foo(), 1);
      t.equal(bar(), 2);

      t.end();
    });

    t.end();
  });

  t.end();
});
