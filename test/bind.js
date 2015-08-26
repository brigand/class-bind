import test from 'tape';
import bind from '../src/bind';

test('bind', (t) => {
  t.test('binds', (t) => {
    class C {
      constructor(){ this.x = 1 };
      foo(){ return this.x };
    }

    // sanity
    t.test('sanity', (t) => {
      const {foo} = new C();
      t.notOk(foo.call({}));
      t.notOk(foo.call({}));

      t.end();
    });

    t.test('actual', (t) => {
      bind(C.prototype, 'foo');
      const {foo} = new C();
      
      t.equal(foo(), 1);

      t.end();
    });

    t.end();
  });

  t.end();
});
