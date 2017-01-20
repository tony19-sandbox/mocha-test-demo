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

/**
 * This suite is slightly more granular than the v1 suite, which
 * helps with readability of the test output and allows for
 * unrelated tests to run independently.
 */
describe("Dispatcher v2", () => {
    const dispatch = stub();
    const keyCode = keycode("u");
    const myStub = stub();
    let keyDown;

    function reset() {
        dispatch.reset();
        keyDown.reset();
        myStub.reset();
    }

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

    describe("with non-<input>", () => {
        before(() => {
            mapDispatchToProps(dispatch).onKeyDown(createEvent("div", keyCode));
        });

        after(reset);

        it("dispatches key", () => {
            // If `dispatch()` is called with `myStub`, `keyDown()` must
            // have been invoked because `myStub` can only be returned
            // by our `keyDown()`.
            expect(dispatch).to.have.been.calledWith(myStub);
        });

        it("calls keyDown with only keyCode as argument", () => {
            expect(keyDown).to.have.been.calledWithExactly(keyCode);
        })
    });

    describe("with <input>", () => {
        before(() => {
            mapDispatchToProps(dispatch).onKeyDown(createEvent("input", keyCode));
        });

        after(reset);

        it("does not dispatch key", () => {
            expect(dispatch).to.not.have.been.called;
        });

        it("does not call keyDown", () => {
            expect(keyDown).to.not.have.been.called;
        });
    });

    describe("event.preventDefault", () => {
        it("called when dispatch returns true", () => {
            dispatch.returns(true);
            const event = createEvent("div", keyCode);
            mapDispatchToProps(dispatch).onKeyDown(event);
            expect(event.preventDefault).to.have.been.called;
        });

        it("does not call preventDefault when dispatch returns false", () => {
            dispatch.returns(false);
            const event = createEvent("div", keyCode);
            mapDispatchToProps(dispatch).onKeyDown(event);
            expect(event.preventDefault).to.not.have.been.called;
        });
    });
});
