[![Build Status](https://travis-ci.org/tony19-sandbox/mocha-test-demo.svg?branch=master)](https://travis-ci.org/tony19-sandbox/mocha-test-demo)

> Demonstrates Mocha, Chai, Sinon, and Istanbul

### Quick start

Run these commands:

    yarn
    yarn test

Observe this output:

INSERT IMAGE

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

<sup>[StackOverflow ref(http://stackoverflow.com/q/41633297/6277151)</sup>

### Answer

Our goal is to verify:

  a. The key-event handler exits early when the target is an `<input>`.
     Otherwise, the following occurs.
  b. `dispatch()` is called.
  c. The call to `dispatch()` has exactly one argument: a function `F`.
  d. `F` is the return value of `keyDown()`.
  e. `keyDown()` is called.
  f. The call to `keyDown()` has exactly one argument: the key code.

Since `keyDown()` is imported from `actions`, we could [stub](http://sinonjs.org/docs/#stubs)
the function in order to observe its calls and arguments and
to set its return value. In our case, we setup `keyDown()` to return
a `dummy` value whenever it gets called with `keyCode`:

    before(() => {
        keyDown = stub(actions, "keyDown");
        keyDown.withArgs(keyCode).returns(dummy);
    });

After our test are done, we need to undo the stub in case other test
suites need to use it.

    after(() => {
        keyDown.restore();
    });

Then, our unit test would verify `dispatch` was called with the `dummy`
that we had previously setup. We know the `dummy` can only be returned
by our stubbed `keyDown()`, so this check also verifies that `keyDown()`
was called.

    expect(dispatch).to.have.been.calledWith(dummy);

Finally, we check that `keyDown()` was called with the `keyCode` as its
only argument:

    expect(keyDown).to.have.been.calledWithExactly(keyCode);


### License

MIT (c) Anthony Trinh
