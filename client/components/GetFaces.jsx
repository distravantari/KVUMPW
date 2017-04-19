import { Component, PropTypes } from "react";
import * as actions from "az-client/store/action";
import * as constant from "az-client/store/action/const";
import _ from "lodash";

// Home component
class GetFaces extends Component {
	static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }

	constructor(props) {
		super(props);
		this.state = {
			shadow1: "",
			shadow2: ""
		};
	}

	render() {
		return (
			<div>
				<p> please insert your name</p> <br />
				<input type="text" ref={(ref) => this.nameRef = ref}/>
				<br />
				<button onClick={() => this.findFace()}> proceed </button>
				<div className="col-12">
					{this.state.shadow1 ? (
					<div>
						<br /> <hr/><h1>Your Shadows</h1> <hr/> <br />
						<div>
							<img src={this.state.shadow1.src} className="col-6"/>
							<img src={this.state.shadow2.src} className="col-6"/>
						</div>
						<br /> <hr/><h1>Face Target</h1> <hr/> <br />
						<canvas id="target" width="900" height="900"></canvas>
					</div>
				) : null}
				</div>
			</div>
		);
	}

	findFace() {
		actions.helper.gevcs.receiveShadow(this.nameRef.value)
		.then((response) => {
			if (response.shadow1.length === 0) {
				alert("no shadow found, please insert the correct name");
			}
			else {
				const shadow1 = new Image();
				const shadow2 = new Image();
				console.log("response ", response);
				const y = response.shadow1[0].face.image;
				const x = response.shadow2[0].face.image;
				// shadow1.src = actions.helper.image.arrayBufferToString(y);
				// shadow2.src = actions.helper.image.arrayBufferToString(x);
				shadow1.src = y;
				shadow2.src = x;
				this.setState({
					shadow1: shadow1,
					shadow2: shadow2
				});

				const shadow = [response.shadow1[0].face.piksel, response.shadow2[0].face.piksel];
				return shadow;
			}
		})
		.then((shadow) => {
			const result = [];
			shadow[0].map((shadow1, index) => {
				const shadow2 = shadow[1][index];
				result.push(actions.helper.gevcs.cumulation(shadow1, shadow2));
			});
			const chunk = _.chunk(result, constant.imgDimention.width);
			actions.helper.image.draw(chunk, "target");
		})
		.catch((err) => {
			alert("error getting shadow..");
			console.log("err ..", err);
		});
	}
}

export default GetFaces;
