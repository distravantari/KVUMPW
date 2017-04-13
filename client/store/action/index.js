import request from "superagent";
import * as constant from "az-client/store/action/const";
import _ from "lodash";
import md5 from "md5";

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
                reject(err);
            }
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
                reject(err);
            }
            resolve(resp);
        });
    })
};

// upload shadow face to faceone and facetwo db
export const saveShadowToDB = (fileone, filetwo, name) => {
    const finalName = md5(name+constant.salt);
    return new Promise((resolve, reject) => {
        const photo = new FormData();
        request
        .post("/saveshadow")
        .send({faceone: fileone, facetwo: filetwo, name: finalName})
        .end((err, resp) => {
            if (err) {
                reject(err);
            }
            resolve(resp);
        });
    })
}

// Converts canvas to an image
export const convertCanvasToImage = (canvas) => {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}

// convert image to canvas
export const convertImageToCanvas = (image) => {
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext("2d").drawImage(image, 0, 0);

	return canvas;
}

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

// receive shadow based on name (query)
export const receiveShadow = (name) => {
    const finalName = md5(name+constant.salt);
    return new Promise((resolve, reject) => {
        request
        .post("/getShadow")
        .send({name: finalName})
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

    const skip = 4; // skip four piksel because RGBA is 3 piksel
    const rgb = 3; // the total piksel RGB has
    const gl = grayLevel();
    // let actualPixel = [];

    for (let y = 0; y < imgPixels.height; y++) {
        for (let x = 0; x < imgPixels.width; x++) {
            const i = (y * skip) * imgPixels.width + x * skip;
            let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / rgb;
            for (let j = 0; j < gl.length; j++) {
                if(avg <= gl[j]) {
                    const fdefisit = Number(avg) - Number(gl[j-1]);
                    const sdefisit = Number(gl[j]) - Number(avg);

                    if(fdefisit < sdefisit) avg = gl[j-1]
                    else avg = gl[j];
                    // avg = gl[j];
                    j = gl.length;
                }
            }
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
            // actualPixel.push(imgPixels.data[i]);
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    // console.log('distra ',actualPixel);
    return canvas.toDataURL();
};

// DEPRECATED 
// set image piksel expansion
export const old_expansion = (imgObj) => {
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");

    const imgW = imgObj.width;
    const imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    let ourPixel = [];
    const gl = grayLevel();
    imgPixels.data.map((val, idx) => {
        for (let i = 0; i < gl.length; i++) {
            if(val === gl[i]){
                const white = i*Number(constant.pixelDiff());
                const black = Number(constant.pixelExpansion)-white;
                const subpixel = [];
                for (let j = 0; j < constant.pixelExpansion; j++) {
                    if(j < black) {
                        subpixel.push(0); // black subpixel
                    }
                    else {
                        subpixel.push(1); // white subpixel
                    }
                }
                ourPixel.push(subpixel);
            }
        }
    });

    // console.log(imgPixels.data.entries()); // to see all the imgPixels entries
    // console.log('distra => ', imgPixels.data[5]);
    // console.log(ourPixel[5]);
    return ourPixel;
};

// draw pixel
export const drawPixel = (piksels, levelin, canvasName) => {
    var canvas = document.getElementById(canvasName);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";

    let x = 0; // position x subpiksel
    let y = 0; // position y subpiksel
    let min = 0; // minimum value on subpiksel
    let max = 0; // maximum value on subpiksel
    let level = levelin; //row image level (max = img.height)

    piksels.map((piksel,index) => {
        min = Math.sqrt(piksel.length)*index;
        max = min+(Math.sqrt(piksel.length)-1); 
        x = min;
        y=level*Math.sqrt(piksel.length);

        piksel.map((sub, sidx) => {
            if(sub == 0) ctx.fillRect(x,y,1,1);
            x++;
            if(x > max) {
                x=min;
                y++;
            }
        }) 
    })
};


// set image piksel expansion
export const expansion = (imgObj) => {

    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");

    const imgW = imgObj.width;
    const imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
    const skip = 4; // skip four piksel because RGBA is 3 piksel
    let ourPixel = [];
    const gl = grayLevel();
     for (let y = 0; y < imgPixels.height; y++) {
        for (let x = 0; x < imgPixels.width; x++) {
            const idx = (y * skip) * imgPixels.width + x * skip;
            for (let i = 0; i < gl.length; i++) {
                if(imgPixels.data[idx] === gl[i]){
                    const white = i*Number(constant.pixelDiff());
                    const black = Number(constant.pixelExpansion)-white;
                    const subpixel = [];
                    for (let j = 0; j < constant.pixelExpansion; j++) {
                        if(j < black) {
                            subpixel.push(0); // black subpixel (#000000)
                        }
                        else {
                            subpixel.push(1); // white subpixel (#FFFFFF)
                        }
                    }
                    ourPixel.push(shuffle(subpixel));
                    // ourPixel.push(imgPixels.data);
                }
            }
        }
    }
    return ourPixel;
};

// get avg transparancy every picture
export const getAvgTransparency = (pixel) => {

    let whitePixel = _.countBy(pixel)[0]; // count 0
    if(!whitePixel) whitePixel = 0; // make sure it wont return 0
    return whitePixel;

}

// get range from avg transparancy on one pixel
export const getRangeTransparancy = (T1, T2) => {
    const pE = constant.pixelExpansion
    const max = Math.max(0, (T1+T2-pE)) // max(0, 1/9+1/9-9/9) we only do the dividen (dividen/divider)
    const min = Math.min(T1, T2) // min(1/9, 1/9) we only do the dividen (dividen/divider)
    return [max, min]
}

// manage the shadow pixel based on the rules (please read the rule again !!!!)
export const managePixel = (expansion) => {
    let newE = [expansion[1], expansion[2]] // new expansion, so it won't override the last expansion
    let same = 0; //( for testing purpose)
    let def = 0; //( for testing purpose)

    expansion[0].map((target, index) => { // mapping target piksel
        const shadow1 = expansion[1][index];
        const shadow2 = expansion[2][index];

        const pt = getAvgTransparency(target) // rataan transparansi target
        const p1 = getAvgTransparency(shadow1) // rataan transparansi shadow1
        const p2 = getAvgTransparency(shadow2) // rataan transparansi shadow2

        const mycumulation = cumulation(shadow1, shadow2); // hasil or 2 subpiksel dari shadow
        // console.log("shadow1 ",shadow1)
        // console.log("shadow2 ",shadow2)
        // console.log("target ", target)
        // console.log("cumulation ", cumulation)

        // if black pixel on cumulation is not as many as target
        if(_.countBy(mycumulation)[1] != _.countBy(target)[1]){
            // if rataan transparansi target < minimum rentang transparansi
            // piksel hitam target lebih besar dari tumpukan shadow1 dan shadow2
            if(pt < getRangeTransparancy(p1, p2)[0]) {
                if(p1 >= p2) { // if white subpiksel on p1 >= p2
                    // atur ulang subpiksel hitam pada shadow 2
                    // agar bila ditumpukkan jadi hampir mendekati target  
                    shadow1.map((value, index) => {
                        const temp = value + shadow2[index];
                        if (temp < 1) shadow2[index] = 0
                        newE[1][index] = shadow2
                    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                }else{
                    // atur ulang subpiksel hitam pada shadow 1
                    // agar bila ditumpukkan jadi hampir mendekati target
                    shadow2.map((value, index) => {
                        const temp = value + shadow1[index];
                        if (temp < 1) shadow1[index] = 0
                        newE[0][index] = shadow1
                    }); 
                }
            }else{ // if rataan transparansi target > maximum rentang transparansi
                // kedua subpiksel hitam dari shadow akan di atur ulang
                if(p1 >= p2) { // if white subpiksel on p1 >= p2
                    // atur ulang subpiksel hitam pada shadow 2
                    // agar bila ditumpukkan jadi hampir mendekati target  
                    shadow1.map((value, index) => {
                        const temp = value + shadow2[index];
                        if (temp < 1) shadow2[index] = 0
                        newE[1][index] = shadow2
                    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                }else{
                    // atur ulang subpiksel hitam pada shadow 1
                    // agar bila ditumpukkan jadi hampir mendekati target
                    shadow2.map((value, index) => {
                        const temp = value + shadow1[index];
                        if (temp < 1) shadow1[index] = 0
                        newE[0][index] = shadow1
                    }); 
                }
            }
            def++; //( for testing purpose)
        }else{
            same++; //( for testing purpose)
        }
    })

    // newE[0][index] = shuffle(newE[0][index])
    console.log("samein ", same); //( for testing purpose)
    console.log("def ", def); //( for testing purpose)
    console.log("total ", same+def); //( for testing purpose)
    // newE.push(cumulation(newE[0], newE[1]));
    return newE
};

// sum/(using or operation) on two array
export const cumulation = (a1, a2) => {
    let res = []; // hasil or 2 subpiksel dari shadow
    res = a1.map((value, index) => {
        const temp = value + a2[index];
        if (temp >= 1) temp == 1
        return temp
    });
    return res;
}

// to shuffle array value
export const shuffle = (array) => {
    for (let i = array.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
    return array;
};

// set image graylevel
export const grayLevel = () => {
    
    const max = 255;
    const min = 0;
    let gl = constant.graylevel;
    console.log("gl: ", gl);
    console.log("pixelExpansion: ", constant.pixelExpansion);
    console.log("pixelDiff: ", constant.pixelDiff());
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

    console.log('all gl ', values);
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
};

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
};