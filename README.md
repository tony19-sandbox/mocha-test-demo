[![Build Status](https://travis-ci.org/tony19-sandbox/mocha-test-demo.svg?branch=master)](https://travis-ci.org/tony19-sandbox/mocha-test-demo)

> Demonstrates Mocha, Chai, Sinon, and Istanbul

### Quick start

Run these commands:

    yarn
    yarn test-cov

Observe this output:

```shell
  Dispatcher v1
    ✓ Dispatches a keyDown event with the specified keyCode if the selected element is not an <input>

  Dispatcher v2
    with non-<input>
      ✓ dispatches key
      ✓ calls keyDown with only keyCode as argument
    with <input>
      ✓ does not dispatch key
      ✓ does not call keyDown


  5 passing (28ms)

=============================================================================
Writing coverage object [/Users/tony/src/tmp/mocha-test-demo/coverage/coverage.json]
Writing coverage reports at [/Users/tony/src/tmp/mocha-test-demo/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 61.54% ( 8/13 )
Branches     : 75% ( 3/4 )
Functions    : 50% ( 2/4 )
Lines        : 60% ( 6/10 )
================================================================================
✨  Done in 1.89s.
```

### Question

Given the following functions, how would `dispatch()` be unit tested?

```javascript
export const keyDown = key => (dispatch, getState) => {
    const { modifier } = getState().data;
    dispatch({ type: KEYDOWN, key });
    return handle(modifier, key); // Returns true or false
};

export const mapDispatchToProps = dispatch => ({
    onKeyDown: e => {
        if(e.target.tagName === "INPUT") return;
        const handledKey = dispatch(keyDown(e.keyCode));
        if(handledKey) {
            e.preventDefault();
        }
    }
});
```

<sup>http://stackoverflow.com/q/41633297/6277151</sup>

### Answer

Our goal is to verify:

  * The key-event handler exits early when the target is an `<input>`.
     Otherwise, the following occurs.
  * `dispatch()` is called.
  * The call to `dispatch()` has exactly one argument: a function `F`.
  * `F` is the return value of `keyDown()`.
  * `keyDown()` is called.
  * The call to `keyDown()` has exactly one argument: the key code.

Since `keyDown()` is imported from `actions`, we could [stub](http://sinonjs.org/docs/#stubs)
the function in order to observe its calls and arguments and
to set its return value. In our case, we setup `keyDown()` to return
a `dummy` value whenever it gets called with `keyCode`:

    before(() => {
        keyDown = stub(actions, "keyDown");
        keyDown.withArgs(keyCode).returns(dummy);
    });

After our tests are done, we need to undo the stub in case other test
suites need to use it.

    after(() => {
        keyDown.restore();
    });

Then, our unit test would verify `dispatch` was called with the `dummy`
that we had previously setup. We know the `dummy` can only be returned
by our stubbed `keyDown()`, so this check also verifies that `keyDown()`
was called.

    expect(dispatch).to.have.been.calledWith(dummy);

And this is a more explicit check that `keyDown()` was called with the
`keyCode` as its only argument:

    expect(keyDown).to.have.been.calledWithExactly(keyCode);


### License

[MIT](https://opensource.org/licenses/MIT) &copy; Anthony Trinh
