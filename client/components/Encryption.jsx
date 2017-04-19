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
			shadowCandidate: [],
			targetExpansion: [],
			shadowAExpansion: [],
			shadowBExpansion: []
		};
	}

	componentWillMount() {
		const temp = [];
		// console.log("target ", this.props.target);
		temp.push(this.props.target);
		this.setState({
			images: temp
		});
	}

	render() {
		if (this.state.shadowCandidate.length <= 0) {
			if (this.state.images.length > 1) {
				return (<div>
					<div className="col-12">
						<img className="col-3" src={this.state.images[0].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[1].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[2].preview} />
					</div>
					<div className="col-12">
						<br /> <hr/><h1>Image Expansion</h1> <hr/> <br />
						<canvas id="target" width="900" height="900"></canvas>
						<canvas id="shadow1" width="900" height="900"></canvas>
						<canvas id="shadow2" width="900" height="900"></canvas>
					</div>
					<div className="col-12">
						<br /> <hr/><h1>Shadow Transform</h1> <hr/> <br />
						<canvas className="col-5" id="st1" width="900" height="900"></canvas>
						<canvas className="col-5" id="st2" width="900" height="900"></canvas>
						<div>
							<p> insert your name</p> <br />
							<input type="text" ref={(ref) => this.nameRef = ref}/>
							<br />
							<button onClick={() => this.proceed()}> proceed </button>
						</div>
					</div>
					<div className="col-12">
						<br /> <hr/><h1>Cummulation of the two shadow above</h1> <hr/> <br />
						<canvas className="col-5" id="cumulation" width="900" height="900"></canvas>
					</div>
				</div>);
			}
			return (
				<div>
					<button onClick={() => this.getShadowManually()}> choose shadow manually </button>
					<button onClick={() => this.getMostSimilarShadow()}> get the most similar </button>
				</div>);
		}
		return (
			<div>
				{
				this.state.shadowCandidate ? (
					this.state.shadowCandidate.map((shadowC, index) => (
						<img className="col-3" src={shadowC.face.preview} key={index} style={ { "cursor": "pointer" } } onClick={ (val) => this.choose(val, index)}/>
					))
				) : <div> loading .. </div>
				}
			</div>);
		// NB: canvas width: 300x3 amd height: 255x3
	}

	expansion() {
		// expanse all three image pixel
		const ex = [];
		const img = new Image();
		this.state.images.map((val) => {
			img.src = val.preview;
			// if (index === 1) this.setState({ targetExpansion: actions.helper.image.expansion(img) });
			// if (index === 2) this.setState({ shadowAExpansion: actions.helper.image.expansion(img) });
			// else this.setState({ shadowBExpansion: actions.helper.image.expansion(img) });
			ex.push(actions.helper.image.expansion(img));
		});
		console.log("loading ... ", this.state.images);

		// draw the image with pixel expansion
		for (let i = 0; i < ex.length; i++) {
			const chunk = _.chunk(ex[i], img.width);
			// _.chunk(['a', 'b', 'c', 'd'], 3);
			// => [['a', 'b', 'c'], ['d']]

			let canvasName = "target";

			if (i === 1) canvasName = "shadow1";
			else if (i === 2) canvasName = "shadow2";

			// console.log("chunk ", chunk.length);
			actions.helper.image.draw(chunk, canvasName);
		}

		// manage pixel based on rules
		// pixel expansion that already been transform/ manage
		let extrans = actions.helper.gevcs.managePixel(ex);
		const extrans2 = [];
		const extrans3 = [];
		ex[0].map((target, index) => {
			const shadow1 = extrans[0][index];
			const shadow2 = extrans[1][index];
			extrans2.push(actions.helper.gevcs.cumulation(shadow1, target));
			extrans3.push(actions.helper.gevcs.cumulation(shadow2, target));
		});
		extrans = [extrans2, extrans3];
		// console.log("extrans ", extrans);

		this.setState({ shadowAExpansion: extrans2 });
		this.setState({ shadowBExpansion: extrans3 });

		// draw the image with pixel expansion
		for (let i = 0; i < extrans.length; i++) {

			const chunk = _.chunk(extrans[i], img.width);

			let canvasName = "st1";
			if (i === 1) canvasName = "st2";

			console.log("chunk ", chunk.length);
			actions.helper.image.draw(chunk, canvasName);
		}

		// draw cumulation between the two shadow
		const result = [];
		extrans[0].map((shadow1, index) => {
			const shadow2 = extrans[1][index];
			result.push(actions.helper.gevcs.cumulation(shadow1, shadow2));
		});
		const chunk = _.chunk(result, img.width);
		actions.helper.image.draw2(chunk, "cumulation");
	}

	proceed() {
		console.log("will you?? ", this.state);
		// convert canvas (shadow) to image
		const imgshadow1 = actions.helper.image.convertCanvasToImage(document.getElementById("st1"));
		const imgshadow2 = actions.helper.image.convertCanvasToImage(document.getElementById("st2"));
		// set name with hash(name+salt)
		const name = this.nameRef.value;
		const test1 = {
			image: imgshadow1.src,
			piksel: this.state.shadowAExpansion
		};
		const test2 = {
			image: imgshadow2.src,
			piksel: this.state.shadowBExpansion
		};
		// this.state.shadowAExpansion;
		// this.state.shadowBExpansion;
		actions.helper.gevcs.saveShadowToDB(test1, test2, name);
		// back to main page
		// alert("successfully add shadow to database");
		// this.context.router.push("/");
	}

	choose(val, idx) {
		val.preventDefault();
		console.log("index ", this.state.shadowCandidate[idx]);
		const temp = this.state.images;
		temp.push(this.state.shadowCandidate[idx].face);
		this.setState({
			images: temp
		});

		const length = 3; // batasan
		if (temp.length === length) {
			this.setShadow(temp)
			.then(() => {
				this.expansion();
			});
		}
	}

	setShadow(temp) {
		console.log("shadow: ", temp);
		return new Promise((resolve) => {
			resolve(
				this.setState({
					images: temp,
					shadowCandidate: []
				})
			);
		});
	}

	getShadowManually() {
		actions.helper.face.receiveFaceDB()
		.then((object) => {
			this.setState({
				shadowCandidate: object
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}

	getMostSimilarShadow() {
		const temp = this.state.images;
		actions.helper.face.receiveFaceDB()
		.then((object) => {
			const randIdx1 = constant.randomize(object); // random index for first shadow
			let randIdx2 = constant.randomize(object); // random index for second shadow

			while (randIdx2 === randIdx1) {
				randIdx2 = constant.randomize(object);
			}

			// temp.push(this.props.target); // target image
			temp.push(object[randIdx1].face); // first shadow
			temp.push(object[randIdx2].face); // second shadow
			console.log(`key selected: ${object[randIdx1].id} & ${object[randIdx2].id}`);
			return this.setShadow(temp);
		})
		.then(() => {
			this.expansion();
		})
		.catch((err) => {
			console.log(err);
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
