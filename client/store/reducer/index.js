// import _ from "lodash"
import * as con from "../action/const"; // ALL CONSTATNTA FIELD

const initialState = {
  target: {}
};

const receiveAbout = (state = initialState, action) => {
    switch (action.type) {
        case con.ACTReceive: {
            const result = action.payload;
            return Object.assign({}, state, {
                target: result.response
            });
        }
        default:
    }
    return state;
};

export default receiveAbout;
