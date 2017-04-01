import { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as actions from "az-client/store/action";
import * as constant from "az-client/store/action/const";
import _ from "lodash";

// Home component
class GEVCS extends Component {
	static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }

	constructor(props) {
		super(props);
		this.state = {
			images: [],
			targetExpansion: [],
			shadowAExpansion: [],
			shadowBExpansion: []
		};
	}

	componentWillMount() {
		console.log('target ', this.props.target);
		const temp = [];
		actions.receiveFaceDB()
		.then((object) => {
			console.log("object ", object);
			const randIdx1 = constant.randomize(object); // random index for first shadow
			let randIdx2 = constant.randomize(object); // random index for second shadow

			while (randIdx2 === randIdx1) {
				randIdx2 = constant.randomize(object);
			}

			temp.push(this.props.target); // target image
			temp.push(object[randIdx1].face); // first shadow
			temp.push(object[randIdx2].face); // second shadow
			console.log(`key selected: ${object[randIdx1].id} & ${object[randIdx2].id}`);
			console.log('temp ', temp);
			this.setState({
				images: temp
			});
		})
		.then(() => {
			this.expansion();
		})
		.catch((err) => {
			console.log(err);
		});
	}

	render() {
		if (this.state.images.length > 0) {
			return (<div>
						<img className="col-3" src={this.state.images[0].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[1].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[2].preview} />
						<h1>GEVCS</h1>
						<canvas id="myCanvas" width="300" height="150"></canvas>
					</div>);
		}
		return (<div> Loading .. </div>);
	}

	expansion() {
		// expanse all three image pixel
		const ex = [];
		const img = new Image();
		this.state.images.map((val, index) => {
			img.src = val.preview;
			if (index === 1) this.setState({ targetExpansion: actions.expansion });
			if (index === 2) this.setState({ shadowAExpansion: actions.expansion });
			else this.setState({ shadowBExpansion: actions.expansion });
			// console.log("list expansion pixel: ", actions.expansion(img));
			ex.push(actions.expansion(img));
		});
		console.log("list expansion pixels: ", ex[0]);

		// draw the
		const chunk = _.chunk(ex[0], img.width);
		console.log("chunk ", chunk.length);
		chunk.map((value, index) => {
			actions.drawPixel(value, index); // value = chunk[index]
		});
	}
}

const mapStateToProps = (state) => {
	return {
		target: state.target
	};
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GEVCS);
