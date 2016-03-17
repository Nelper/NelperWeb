import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import {Dialog, NumericInput, TaskPictureSlider, PriceTag} from 'components/index';
import UserStore from 'stores/UserStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';
import {MIN_PRICE, MAX_PRICE} from 'utils/constants';

import styles from './MakeOfferDialogView.scss';

@cssModules(styles)
export default class MakeOfferDialogView extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    task: PropTypes.object,
    onClose: PropTypes.func,
    onMakeOffer: PropTypes.func,
  };

  static defaultProps = {
    onClose: () => {},
    onMakeOffer: () => {},
  };

  state = {
    makeOfferValue: 0,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.task) {
      this.setState({
        makeOfferValue: newProps.task.priceOffered,
      });
    }
  }

  _onMakeOfferValueChange(value) {
    this.setState({makeOfferValue: value});
  }

  _onMakeOfferConfirm() {
    this.props.onMakeOffer(this.state.makeOfferValue);
  }

  render() {
    const {task} = this.props;

    let dialogContent = null;
    if (task) {
      const distance = UserStore.isLogged() ?
        Math.round(LocationUtils.kilometersBetween(task.location, UserStore.state.user.location)) :
        null;

      dialogContent = (
        <div styleName="dialog-content">
          <div styleName="title-row">
            <div
              styleName="category-icon"
              style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}}
            />
            <h2 styleName="task-title">{task.title}</h2>
          </div>
          <div styleName="task-info">
            <div styleName="desc-col">
              <div styleName="desc">{task.desc}</div>
              <div styleName="price-row">
                <div styleName="price"><PriceTag price={task.priceOffered} /></div>
                <div styleName="location">
                  <div styleName="location-icon" />
                  <div>
                    <div styleName="city">{task.city}</div>
                      {
                        distance !== null ?
                        <div styleName="distance">
                          <FormattedMessage id="nelpcenter.main.awayFrom" values={{
                            distance: distance || 0,
                          }}/>
                        </div> :
                        null
                      }
                  </div>
                </div>
              </div>
            </div>
            {
              task.pictures.length ?
              <div styleName="picture-col">
                <TaskPictureSlider task={task} />
              </div> :
              null
            }
          </div>
          <div styleName="offer">
            <div styleName="offer-text"><FormattedMessage id="browse.myOffer" /></div>
            <NumericInput
              unit="$"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={this.state.makeOfferValue}
              onChange={::this._onMakeOfferValueChange}
            />
          </div>
          <div styleName="buttons">
            <button onClick={this.props.onClose}>Cancel</button>
            <button onClick={::this._onMakeOfferConfirm} className="primary">Apply</button>
          </div>
        </div>
      );
    }

    return (
      <Dialog
        fill
        opened={this.props.opened}
        onClose={this.props.onClose}
        className="pad-all"
      >
        {dialogContent}
      </Dialog>
    );
  }
}
