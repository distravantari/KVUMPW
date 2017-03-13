import { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as actions from "az-client/store/action";
import * as constant from "az-client/store/action/const";

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
		};
	}

	componentDidMount() {
		const temp = [];
		actions.receiveFaceDB()
		.then((object) => {
			const randIdx1 = constant.randomize(object); // random index for first shadow
			let randIdx2 = constant.randomize(object); // random index for first shadow

			while (randIdx2 === randIdx1) {
				randIdx2 = constant.randomize(object);
			}

			temp.push(this.props.target); // target image
			temp.push(object[randIdx1].face); // first shadow
			temp.push(object[randIdx2].face); // second shadow
			console.log(`key selected: ${object[randIdx1].id} & ${object[randIdx2].id}`);
			this.setState({
				images: temp
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}

	render() {
		// console.log('state: ', this.state.images);
		let show = (<div> Loading .. </div>);
		if (this.state.images.length > 0) {
			show = (<div>
						<img className="col-3" src={this.state.images[0].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[1].preview} />
						<div className="col-1"> &nbsp; </div>
						<img className="col-3" src={this.state.images[2].preview} />
						<h1>GEVCS</h1>
					</div>);
		}
		this.expansion();
		return (show);
	}

	expansion() {
		this.state.images.map((val) => {
			const img = new Image();
			img.src = val.preview;
			console.log("list expansion pixel: ", actions.expansion(img));
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
