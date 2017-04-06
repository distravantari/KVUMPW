import { Component, PropTypes } from "react";
// import { connect } from "react-redux";
import * as actions from "az-client/store/action";
// import * as constant from "az-client/store/action/const";

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
						<div>
							<img src={this.state.shadow1} className="col-6"/>
							<img src={this.state.shadow2} className="col-6"/>
						</div>
					</div>
				) : null}
				</div>
			</div>
		);
	}

	findFace() {
		actions.receiveShadow(this.nameRef.value)
		.then((response) => {
			if (response.shadow1.length === 0) {
				alert("no shadow found, please insert the correct name");
			}
			else {
				const shadow1 = response.shadow1[0].face.preview;
				const shadow2 = response.shadow2[0].face.preview;
				this.setState({
					shadow1: shadow1,
					shadow2: shadow2
				});
			}
		})
		.catch((err) => {
			alert("error getting shadow..");
			console.log("err ..", err);
		});
	}
}

// const mapStateToProps = (state) => {
// 	return {
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//     };
// };

export default GetFaces;
