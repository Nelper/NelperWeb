import React, {Component} from 'react';

export default class GetNelpHandler extends Component {
  render() {
    return (
      <div className="container">
        <h2>Get Nelp</h2>
        <h3>My Nelp requests</h3>
        <div style={styles.cardRow}>
          <NelpRequestCard title="Yolo" />
          <NelpRequestCard title="Weed" />
          <NelpRequestCard title="Boyz" />
        </div>
        <h3>Recommended Nelpers</h3>
      </div>
    );
  }
}

class NelpRequestCard extends Component {
  render() {
    return (
      <div style={styles.card}>
        <div>
          {this.props.title}
        </div>
        <div>
          {this.props.desc}
        </div>
      </div>
    );
  }
}

const styles = {
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  card: {
    height: 250,
    minWidth: 200,
    flex: 1,
    backgroundColor: '#333',
    margin: 8,
  },
}
