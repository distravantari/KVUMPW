import request from "superagent";
import * as constant from "az-client/store/action/const";

export const dropHandler = (file) => {
    const photo = new FormData();
    photo.append("photo", file[0]);
    request.post("/upload")
        .send(photo)
        .end((err, resp) => {
            if (err) {
                console.error(err);
            }
            console.log("response: ", resp);
            alert(resp.text);
            return resp;
        });
};

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

export const grayScale = (imgObj) => {
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");

    const imgW = imgObj.width;
    const imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
    const rgb = 3;
    const gl = Number(constant.graylevel);

    for (let y = 0; y < imgPixels.height; y++) {
        for (let x = 0; x < imgPixels.width; x++) {
            const i = (y * gl) * imgPixels.width + x * gl;
            const avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / rgb;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }

    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
};

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
