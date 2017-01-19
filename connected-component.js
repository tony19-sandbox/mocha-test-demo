import { keyDown } from './actions';

export const mapDispatchToProps = dispatch => ({
    onKeyDown: e => {
        if (e.target.tagName === "INPUT") return;
        const handledKey = dispatch(keyDown(e.keyCode));
        if (handledKey) {
            e.preventDefault();
        }
    }
});
