import React, {Component} from 'react';
import Radium from 'radium';

@Radium
export default class NelperCard extends Component {

  static propTypes = {
    onClick: React.PropTypes.func,
  }

  render() {
    return (
      <div
        style={[styles.card, this.props.style]}
        onClick={this.props.onClick}>
        <div style={styles.hover} />
        {
          this.props.image ?
          <div style={[styles.image, {backgroundImage: `url('${this.props.image}')`}]} /> :
          null
        }
        <div style={styles.content}>
          <div style={styles.title}>
            {this.props.title}
          </div>
          <div style={styles.desc}>
            {this.props.desc}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  card: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    height: 250,
    minWidth: 200,
    maxWidth: 300,
    flex: '1',
    backgroundColor: '#f1f1f1',
    margin: 8,
  },
  hover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0,
    ':hover': {
      opacity: 0.1,
    },
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 18,
  },
  desc: {
    color: '#333',
    wordWrap: 'break-word',
  },
  image: {
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};
