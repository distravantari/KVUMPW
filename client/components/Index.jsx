import { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import * as actions from "az-client/store/action";
import * as constant from "az-client/store/action/const";

// Home component
class Drop extends Component {
	static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }

	constructor(props) {
		super(props);
		this.state = {
			files: "",
		};
	}

	onDrop(files) {
		// console.log("holll ", actions.test);
		actions.helper.image.checkImage(files.preview)
		.then((img) => {
			let result = `image height/widht should be ${constant.imgDimention.height} and ${constant.imgDimention.width}`;
			if (img.height === constant.imgDimention.height) {
				if (img.width === constant.imgDimention.width) {
					result = "success";
				}
			}
			return result;
		})
		.then((response) => {
			if (response === "success") {
				const img = new Image();
				img.src = files.preview;
				// console.log("list expansion pixel sting: ", JSON.stringify(actions.expansion(img)));
				// console.log("list expansion pixel sting: ", actions.expansion(img));
				files.preview = actions.helper.image.grayScale(img);
				return files;
			}
			alert(response);
		})
		.then((grayimage) => {
			const img = new Image();
			img.src = grayimage.preview;
			// console.log("list expansion pixel: ", JSON.stringify(actions.expansion(img)));
			// console.log("list expansion pixel: ", actions.expansion(img));
			this.setState({
				files: grayimage
			});
		});
	}

	onOpenClick() {
		this.refs.dropzone.open();
	}

	render() {
		return (
			<div>
				<div style={ { cursor: "pointer" } }>
					<Dropzone ref="dropzone" multiple={false} accept={"image/*"} onDrop={(file) => this.onDrop(file[0])}>
						<div> Drop a photo, or click to add. </div>
					</Dropzone>
					<button type="button" onClick={() => this.onOpenClick()}>
						Click to add
					</button> <br />
					<button type="button" onClick={() => this.context.router.push("/Get")}>
						Get Face
					</button>
				</div>
				{this.state.files ? (
					<div>
						<div>
							<img src={this.state.files.preview} className="col-12"/>
							<button onClick={() => this.proceed(this.state.files, "next")}>proceed</button>
							<button onClick={() => this.proceed(this.state.files, "saved")}>save to DB</button>
						</div>
					</div>
				) : null}
			</div>
		);
	}

	proceed(files, status) {
		const grey = actions.helper.image.convertToFile(files.preview, "grayScale");
		grey.preview = this.state.files.preview;
		let face = {};
		actions.helper.upload.dropHandler(grey)
		.then((temp) => {
			temp.body.preview = this.state.files.preview;
			face = temp;
			this.props.receiveTarget(face);
		})
		.then(() => {
			// console.log("face ", face);
			return actions.helper.face.checkFace(this.props.target.path);
		})
		.then((response) => {
			if (response.text !== "error is not a face") {
				if (status === "saved") {
					actions.helper.face.saveFaceToDB(face);
				}
				else {
					this.context.router.push("/Encryption");
				}
			}
			// console.log('response');
			alert(response.text);
		})
		.catch((err) => {
			alert(`err .. ${err}`);
		});
    }
}

const mapStateToProps = (state) => {
	return {
		target: state.target
	};
};

const mapDispatchToProps = (dispatch) => {
    return {
      receiveTarget: (face) => dispatch(actions.helper.gevcs.receiveTarget(face))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Drop);
