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
		temp.push(this.props.target);
		this.setState({
			images: temp
		});
	}

	render() {
		// console.log('stateee ', this.state);
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
						<canvas id="target" width="900" height="765"></canvas>
						<canvas id="shadow1" width="900" height="765"></canvas>
						<canvas id="shadow2" width="900" height="765"></canvas>
					</div>
					<div className="col-12">
						<br /> <hr/><h1>Shadow Transform</h1> <hr/> <br />
						<canvas className="col-5" id="st1" width="900" height="765"></canvas>
						<canvas className="col-5" id="st2" width="900" height="765"></canvas>
						<div>
							<p> insert your name</p> <br />
							<input type="text" ref={(ref) => this.nameRef = ref}/>
							<br />
							<button onClick={() => this.proceed()}> proceed </button>
						</div>
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
		this.state.images.map((val, index) => {
			img.src = val.preview;
			if (index === 1) this.setState({ targetExpansion: actions.expansion });
			if (index === 2) this.setState({ shadowAExpansion: actions.expansion });
			else this.setState({ shadowBExpansion: actions.expansion });
			// console.log("list expansion pixel: ", actions.expansion(img));
			ex.push(actions.expansion(img));
		});
		console.log("list expansion pixels1: ", ex);

		// draw the image with pixel expansion
		for (let i = 0; i < ex.length; i++) {
			const chunk = _.chunk(ex[i], img.width);
			// _.chunk(['a', 'b', 'c', 'd'], 3);
			// => [['a', 'b', 'c'], ['d']]

			let canvasName = "target";

			if (i === 1) canvasName = "shadow1";
			else if (i === 2) canvasName = "shadow2";

			console.log("chunk ", chunk.length);
			this.draw(chunk, canvasName);
		}

		// manage pixel based on rules
		// pixel expansion that already been transform/ manage
		const extrans = actions.managePixel(ex);

		// draw the image with pixel expansion
		for (let i = 0; i < extrans.length; i++) {

			const chunk = _.chunk(extrans[i], img.width);

			let canvasName = "st1";
			if (i === 1) canvasName = "st2";

			console.log("chunk ", chunk.length);
			this.draw(chunk, canvasName);
		}

	}

	proceed() {
		// convert canvas (shadow) to image
		const imgshadow1 = actions.convertCanvasToImage(document.getElementById("st1"));
		const imgshadow2 = actions.convertCanvasToImage(document.getElementById("st2"));
		// convert image (shadow) to file
		const fileshadow1 = actions.convertToFile(imgshadow1.src, "shadow1");
		fileshadow1.preview = imgshadow1.src;
		const fileshadow2 = actions.convertToFile(imgshadow2.src, "shadow2");
		fileshadow2.preview = imgshadow2.src;
		// set name with hash(name+salt)
		const name = this.nameRef.value;
		actions.saveShadowToDB(fileshadow1, fileshadow2, name);
		// back to main page
		alert("successfully add shadow to database");
		this.context.router.push("/");
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
			.then((test) => {
				console.log("distra ", test);
				this.expansion();
			});
		}
	}

	setShadow(temp) {
		console.log("shadow");
		return new Promise((resolve) => {
			resolve(
				this.setState({
					images: temp,
					shadowCandidate: []
				})
			);
		});
	}

	draw(chunk, canvasName) {
		console.log("chunk check ", chunk);
		chunk.map((value, index) => {
			actions.drawPixel(value, index, canvasName); // value = chunk[index]
		});
	}

	getShadowManually() {
		actions.receiveFaceDB()
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
		actions.receiveFaceDB()
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
