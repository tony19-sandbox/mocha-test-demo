export const keyDown = key => (dispatch, getState) => {
    const { modifier } = getState().data;
    dispatch({ type: KEYDOWN, key });
    return handle(modifier, key); // Returns true or false
};
