import keycode from "keycodes";
import { spy, stub } from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import * as actions from "../actions";
import { mapDispatchToProps } from "../connected-component";

chai.use(sinonChai);
const expect = chai.expect;

// Creates a simple Event stub...
const createEvent = (tag, keyCode) => ({
    target: {
        tagName: tag.toUpperCase()
    },
    preventDefault: spy(),
    keyCode
});

describe("Dispatcher v1", () => {
    const keyCode = keycode("u");
    const myStub = stub();
    let keyDown;

    before(() => {
        // Stub actions.keyDown() so that we can observe whether it gets
        // called and with what arguments; and so that we can control its
        // return value. In this case, if `keyDown()` gets called with
        // the `keyCode` above, we return `myStub`. Otherwise, we return
        // undefined.
        keyDown = stub(actions, "keyDown");
        keyDown.withArgs(keyCode).returns(myStub);
    });

    after(() => {
        // Undo the stub on actions.keyDown() so that other suites
        // could use it if needed.
        keyDown.restore();
    });

    it("Dispatches a keyDown event with the specified keyCode if the selected element is not an <input>", () => {
        const dispatch = spy();

        mapDispatchToProps(dispatch).onKeyDown(createEvent("div", keyCode));

        // If `dispatch()` is called with `myStub`, `keyDown()` must
        // have been invoked because `myStub` can only be returned
        // by our `keyDown()`.
        expect(dispatch).to.have.been.calledWith(myStub);

        // Now verify that `keyDown()` was called with only `keyCode`
        // as an argument.
        expect(keyDown).to.have.been.calledWithExactly(keyCode);
    });
});
