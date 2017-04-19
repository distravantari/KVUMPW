import request from "superagent";

// upload face to FACEDB
export const saveFaceToDB = (file) => {
    return new Promise((resolve, reject) => {
        const photo = new FormData();
        request
        .post("/savephoto")
        .send({face: file})
        .end((err, resp) => {
            if (err) {
                reject(err);
            }
            resolve(resp);
        });
    })
};

// receive all FACEDB
export const receiveFaceDB = () => {
    return new Promise((resolve, reject) => {
        request
        .post("/getShadowCandidate")
        .end((err, resp) => {
            if (err) {
                reject(err);
            }
            resolve(resp.body);
        });
    })
};

// check if input image == face
export const checkFace = (file) => {
    return new Promise((resolve, reject) => {
        request
        .post("/detect")
        .type("form")
        .send({ photo: file })
        .end((err, res) => {
            if (err) {
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};