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
		actions.checkImage(files.preview)
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
				files.preview = actions.grayScale(img);
				return files;
			}
			alert(response);
		})
		.then((grayimage) => {
			// const img = new Image();
			// img.src = grayimage.preview;
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
					<button type="button" onClick={() => this.context.router.push("/cam")}>Photo</button>
					<button type="button" onClick={() => this.onOpenClick()}>
						Click to add
					</button>
				</div>
				{this.state.files ? (
					<div>
						<div>
							<img src={this.state.files.preview} />
							<button onClick={() => this.proceed(this.state.files, "next")}>proceed</button>
							<button onClick={() => this.proceed(this.state.files, "saved")}>save to DB</button>
						</div>
					</div>
				) : null}
			</div>
		);
	}

	proceed(files, status) {
		const grey = actions.convertToFile(files.preview, "grayScale");
		grey.preview = this.state.files.preview;
		let face = {};
		actions.dropHandler(grey)
		.then((temp) => {
			temp.body.preview = this.state.files.preview;
			face = temp;
			this.props.receiveTarget(face);
		})
		.then(() => {
			return actions.checkFace(this.props.target.path);
		})
		.then((response) => {
			if (status === "saved" && response.text !== "error is not a face") {
				actions.saveFaceToDB(face);
			}
			else {
				this.context.router.push("/GEVCS");
			}
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
      receiveTarget: (face) => dispatch(actions.receiveTarget(face))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Drop);
