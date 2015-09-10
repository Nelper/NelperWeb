import React, {Component, PropTypes} from 'react';
import Slider from 'react-slick';

export default class TaskPictureSlider extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    height: PropTypes.number,
  }

  static defaultProps = {
    height: 200,
  }

  render() {
    const {task, height} = this.props;
    const pictures = task.pictures && task.pictures.map((p, i) => {
      return (
        <div
          className="task-picture"
          style={{
            backgroundImage: `url('${p.url}')`,
            height,
          }}
          key={i}
        />
      );
    });

    return (
      <div className="task-picture-slider-component">
        <Slider
          dots
          arrows
          infinite={false}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {pictures}
        </Slider>
      </div>
    );
  }
}
