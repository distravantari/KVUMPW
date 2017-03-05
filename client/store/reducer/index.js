// import _ from "lodash"
import * as constant from "../action/const"; // ALL CONSTATNTA FIELD

const initialState = {
  target: {}
};

const receiveAbout = (state = initialState, action) => {
    switch (action.type) {
        case constant.ACTReceive: {
            const result = action.payload;
            return Object.assign({}, state, {
                target: result.face.body
            });
        }
        default:
    }
    return state;
};

export default receiveAbout;
