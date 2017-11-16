import request from "superagent";
import * as constant from "az-client/store/action/const";
import md5 from "md5";

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

// upload shadow face to faceone and facetwo db
export const saveShadowToDB = (shadow1, shadow2, name) => {
    const finalName = md5(name+constant.salt);
    return new Promise((resolve, reject) => {
        const photo = new FormData();
        request
        .post("/saveshadow")
        .send({faceone: shadow1, facetwo: shadow2, name: finalName})
        .end((err, resp) => {
            if (err) {
                reject(err);
            }
            resolve(resp);
        });
    })
};

// get avg transparancy every picture
export const getAvgTransparency = (pixel) => {

    let whitePixel = _.countBy(pixel)[0]; // count 0
    if(!whitePixel) whitePixel = 0; // make sure it wont return 0
    return whitePixel;

}

// sum/(using or operation) on two array
export const cumulation = (a1, a2) => {
    let res = []; // hasil or 2 subpiksel dari shadow
    res = a2.map((value, index) => {
        let temp = value + a1[index];
        if (temp <= 1) temp == 1;
        else temp == 0;
        return temp;
    });
    return res;
}

// get range from avg transparancy on one pixel
export const getRangeTransparancy = (T1, T2) => {
    const pE = constant.pixelExpansion
    const max = Math.max(0, (T1+T2-pE)) // max(0, 1/9+1/9-9/9) we only do the dividen (dividen/divider)
    const min = Math.min(T1, T2) // min(1/9, 1/9) we only do the dividen (dividen/divider)
    return [max, min]
}

// manage the shadow pixel based on the rules
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