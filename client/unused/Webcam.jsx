import { Component, PropTypes } from "react";
// import Webcam from "react-webcam";
import Webcam from "./camera";
import * as actions from "az-client/store/action";

// Webcam component
class Cam extends Component {
	static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }

    constructor(props) {
		super(props);
		this.state = {
			screenshot: "",
		};
	}

	render() {
		return (
			<div>
				<Webcam width="300" height="300" ref="webcam" />
				<div className="controls">
					<button onClick={() => this.screenshot()}>capture</button>
					<button type="button" onClick={() => this.context.router.push("/")}>Dropzone</button>
				</div>
				{this.state.screenshot ? (
					<div>
						<img src={this.state.screenshot} />
						<button onClick={() => this.proceed()}>proceed</button>
					</div>
					) : null}
			</div>
		);
	}

	screenshot() {
        const screenshot = this.refs.webcam.getScreenshot();
        this.setState({ screenshot: screenshot });
    }

    proceed() {
        const file = [actions.convertToFile(this.state.screenshot, "face.png")];
		file[0].preview = this.refs.webcam.state.src;
		// file[0].preview = this.state.screenshot;
		actions.dropHandler(file[0]);
    }
}

export default Cam;
