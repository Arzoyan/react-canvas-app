import React from "react";
import PropTypes from "prop-types";
import { BACKWARD, FORWARD } from "./constants";
import "./player.css";


class VideoCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playButtonText: "play" };
  }

  componentDidMount() {
    this.cx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight / this.props.itemCount;
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.attachListener();
    this.setState({ playButtonText: this.props.player.paused ? "play" : "pause" });
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._frameId);
  }

  attachListener() {
    const { player } = this.props;

    player.addEventListener("play", this.handlePlay);
    player.addEventListener("pause", this.handlePause);
  }

  handlePlay = () => {
    this.timerCallback();
  };

  handlePause = () => {
    window.cancelAnimationFrame(this._frameId);
  };

  timerCallback() {
    const { player } = this.props;

    if (player.paused || player.ended) {
      return;
    }

    this.computeFrame();
    this._frameId = window.requestAnimationFrame(() => this.timerCallback());
  }

  getRatio() {
    const { player } = this.props;
    const ratio = player.videoWidth / player.videoHeight;
    const canvasRatio = this.canvas.width / this.canvas.height;
    if (canvasRatio > ratio) {
      const width = this.canvas.height * ratio;
      return {
        width,
        height: this.canvas.height,
        x: (this.canvas.width - width) / 2,
        y: 0,
      };
    } else {
      const height = this.canvas.width / ratio;
      return {
        width: this.canvas.width,
        height,
        x: 0,
        y: (this.canvas.height - height) / 2,
      };
    }
  }

  computeFrame() {
    const { player } = this.props;
    const { x, y, width, height } = this.getRatio();
    this.cx.drawImage(player, x, y, width, height);
  }

  setCanvasRef(ref) {
    this.canvas = ref;
  }

  render() {
    return (
      <div className="player">
        <div>
          <h3>Player: {this.props.videoNumber}</h3>
        </div>
        <canvas ref={(ref) => this.setCanvasRef(ref)} />
        <div className="player-buttons">
          <button
            onClick={() => {
              const { player } = this.props;
              player.currentTime -= 10;
            }}
          >
            {BACKWARD}
          </button>
          <button
            onClick={() => {
              const { player } = this.props;
              player.paused ? player.play() : player.pause();
              this.setState({ playButtonText: player.paused ? "play" : "pause" });
            }}
          >
            {this.state.playButtonText}
          </button>
          <button
            onClick={() => {
              const { player } = this.props;
              player.currentTime += 10;
            }}
          >
            {FORWARD}
          </button>
        </div>
      </div>
    );
  }
}

VideoCanvas.propTypes = {
  player: PropTypes.instanceOf(HTMLVideoElement),
  itemCount: PropTypes.number,
  videoNumber: PropTypes.number,
};

VideoCanvas.defaultProps = {
  player: null,
  itemCount: 1,
  videoNumber: 1,
};

export default VideoCanvas;
