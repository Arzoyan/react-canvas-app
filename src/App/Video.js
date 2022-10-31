import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./player.css";

const getSources = (source = {}) =>
  Object.keys(source).map((key) => (
    <source key={key} src={source[key]} type={`video/${key}`} />
  ));

const Video = React.forwardRef((props, ref) => {
  useEffect(() => {
    props.onMounted();
  }, []);

  return (
    <video
      ref={ref}
      className={"video"}
      style={{}}
      duration={"true"}
      autoPlay="autoplay"
      controls
      name={props.source.id}
      autoplay
    >
      {getSources(props.source)}
    </video>
  );
});

Video.propTypes = {
  source: PropTypes.object,
  forwardedRef: PropTypes.func,
  onMounted: PropTypes.func,
  name: PropTypes.string,
};

Video.defaultProps = {
  source: null,
  forwardedRef: () => null,
  onMounted: () => null,
  name: "",
};

export default Video;
