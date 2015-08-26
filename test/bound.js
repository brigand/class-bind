import test from 'tape';
import bound from '../src/bound';

test('bound', (t) => {

  // prep
  const getClass = () => class Foo {
    static make(value){
      return new Foo(value);
    }

    constructor(value){
      this.value = value;
    }

    @bound
    returnsValue(){
      return this.value;
    }
  };

  function runTests(t, env){
    process.env.NODE_ENV = env;


    // tests
    t.test('is bound', (t) => {
      const inst = getClass().make('test');
      const {returnsValue} = inst;
      t.equal(returnsValue(), 'test');
      inst.value = 'other';
      t.equal(returnsValue(), 'other');

      t.end();
    });

    t.test('[[Get]] on prototype ', (t) => {
      const C = getClass();
      const f = C.prototype.returnsValue;

      t.equal(typeof f, 'function', 'C.prototype.returnsValue is a function');

      // FIXME: better way to say 'it wasn\'t bound?'
      t.notEqual(f.toString(), (function(){}).bind({}), 'doesn\'t look like a bound function');
      t.notEqual(f.toString().indexOf('this.value'), -1, 'function contains "this.value"');

      t.end();
    });

    t.test('throws in [[Set]] on instances', (t) => {
      const inst = getClass().make();
      t.throws(() => {
        inst.returnsValue = function(){};
      });
      t.end();
    });

    t.test('[[Get]] returns unequal values on multiple instances', (t) => {
      const C = getClass();
      const a = C.make();
      const b = C.make();
      t.ok(a.returnsValue);
      t.ok(b.returnsValue);
      t.notEqual(a.returnsValue, b.returnsValue);
      t.notEqual(a.returnsValue, b.returnsValue);

      t.end();
    });

    // TODO: test writable/enumerable/configurable are preserved

    t.end();
  }

  t.test('env: development', (t) => {
    t.test('ensure similar behavior to production', (t) => {
      runTests(t, 'development');
    });

    t.test('[[Set]] on [[Protoype]] is visible on existing instances', (t) => {
      const C = getClass();
      const inst = C.make('original');
      C.prototype.returnsValue = () => 'updated';
      t.equal(inst.returnsValue(), 'updated');

      t.end();
    });

    t.test('[[Get]] returns strictly inequal values', (t) => {
      const inst = getClass().make();
      t.notEqual(inst.returnsValue, inst.returnsValue);
      t.notEqual(inst.returnsValue, inst.returnsValue);

      t.end();
    });

    t.end();
  });

  t.test('env: production', (t) => {
    t.test('ensure similar behavior to development', (t) => {
      runTests(t, 'development');
    });

    t.test('[[Get]] returns strictly equal values', (t) => {
      const inst = getClass().make();
      t.equal(inst.returnsFoo, inst.returnsFoo);

      t.end();
    });

    t.end();
  });
});
