import keycode from "keycodes";
import { spy, stub } from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import * as actions from "../actions";

chai.use(sinonChai);
const expect = chai.expect;

describe("keyDown", () => {
    const dispatch = stub();
    const modifier = 444;
    const getState = () => ({ data: { modifier } });
    let keyCode = keycode("x");
    let fn;

    beforeEach(() => {
        fn = actions.keyDown(keyCode);
    });

    afterEach(() => {
        dispatch.reset();
    });

    it("returns a function", () => {
        expect(fn).to.be.a.function;
    });

    it("that function returns expected boolean", () => {
        const result = fn(dispatch, getState);
        expect(result).to.be.a.boolean;
    });

    it("that function calls given dispatch", () => {
        fn(dispatch, getState);
        expect(dispatch).to.have.been.calledWith({type: actions.KEYDOWN, key: keyCode});
    });
});
