const dummyData = () => ({ data: { modifier: 1 } });
const handle = () => true;
const KEYDOWN = 'keydown';

export const keyDown = key => (dispatch, getState=dummyData) => {
    const { modifier } = getState().data;
    dispatch({ type: KEYDOWN, key });
    return handle(modifier, key); // Returns true or false
};
