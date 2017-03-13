export const ACTReceive = "RECEIVE";
export const salt = "MAR0901";

export const imgDimention = {
    height: 255,
	width: 300
};

export const graylevel = 4;
export const pixelExpansion = 9;

//pixel deferences between two or more pixel expansion
export const pixelDiff = () => {
    return (Number(pixelExpansion)/(Number(graylevel)-1));
};

export const randomize = (item) => {
    return Math.floor(Math.random()*item.length);
}