export const ACTReceive = "RECEIVE";
export const salt = "MAR0901";

export const imgDimention = {
    height: 300, //300
	width: 300 //300
};

export const graylevel = 4; //4
export const pixelExpansion = 9; //9

//with square root of pixel expansion because you we need to arrange the expansion pixel some how. 
//example pixelexpansion = 9, that means we need to make it 3x3 so the output won't look funny
export const canvas = {
	height: imgDimention.height * Math.sqrt(pixelExpansion), 
	width: imgDimention.width * Math.sqrt(pixelExpansion)
}

export const black = 0;
export const white = 1;

//pixel deferences between two or more pixel expansion
export const pixelDiff = () => {
    return (Number(pixelExpansion)/(Number(graylevel)-1));
};

export const randomize = (item) => {
    return Math.floor(Math.random()*item.length);
};

export const dropzonestyle = {
	width: '100%',
	height: 200,
	borderWidth: 2,
	borderColor: '#666',
	borderStyle: 'dashed',
	borderRadius: 5
};