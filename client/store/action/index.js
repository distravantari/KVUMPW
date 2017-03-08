import request from "superagent";
import * as constant from "az-client/store/action/const";

// upload image to store/tmp
export const dropHandler = (file) => {
    return new Promise((resolve, reject) => {
        const photo = new FormData();
        photo.append("photo", file);
        request
        .post("/upload")
        .send(photo)
        .end((err, resp) => {
            if (err) {
                console.error(err);
            }
            console.log("response: ", resp);
            resolve(resp);
        });
    })
};

// upload face to FACEDB
export const saveFaceToDB = (file) => {
    return new Promise((resolve, reject) => {
        const photo = new FormData();
        request
        .post("/savephoto")
        .send({face: file})
        .end((err, resp) => {
            if (err) {
                console.error(err);
            }
            console.log("response: ", resp);
            resolve(resp);
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
            if (err) reject(err);
            resolve(res);
        });
    });
};

// convert image to grayscale
export const grayScale = (imgObj) => {
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");

    const imgW = imgObj.width;
    const imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    const skip = 4; // skip four piksel because RGB is 3 piksel
    const rgb = 3; // the total piksel RGB has
    const gl = grayLevel();

    for (let y = 0; y < imgPixels.height; y++) {
        for (let x = 0; x < imgPixels.width; x++) {
            const i = (y * skip) * imgPixels.width + x * skip;
            let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / rgb;
            
            for (let j = 0; j < gl.length; j++) {
                if(avg <= gl[j]) {
                    avg = gl[j];
                    j = gl.length;
                }
            }
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
};

// set image graylevel
export const grayLevel = () => {
    
    const max = 255;
    const min = 0;
    let gl = constant.graylevel;
    console.log("gl: ", gl);
    let length = 0;

    if(gl <= 0) length = 1;
    else length = gl;

    let values = [];
    const temp = Number(max)/(Number(gl)-Number(1));
    
    for (let i = 0; i < length; i++) { 
        if(temp >= Number.MAX_VALUE){
            // console.log("first if ", temp);
            values.push(0);
        }
        else if(temp == ((max)*-1)){
            // console.log("second if ", temp);
            values.push(0);
        }
        else{
            // console.log("third if ",temp);
            const res = Number(temp)*Number(i);
            values.push(res);
        }
    }

    return values;
};

// check if image dimention is 300x255
export const checkImage = (blob) => {
    const check = new Promise((resolve) => {
        const img = document.createElement("img");
        img.src = blob;
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            resolve({ height: h, width: w });
        };
    });
    return check;
};

// convert dataURL to file
export const convertToFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// save image target to redux
export const receiveTarget = (face) => {
    return dispatch => {
        dispatch({
            type: constant.ACTReceive,
            payload: {
                face
            }
        })   
    }
}