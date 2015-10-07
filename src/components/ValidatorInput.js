import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './ValidatorInput.scss';

@cssModules(styles, {allowMultiple: true})
export default class ValidatorInput extends Component {

  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    styleName: PropTypes.string,
    style: PropTypes.string,
    type: PropTypes.string,
  }

  getInput() {
    return this.refs.input;
  }

  render() {
    const {
      error,
      className,
      styleName,
      style,
      type,
      ...others,
    } = this.props;
    const isTextArea = type === 'textarea';

    return (
      <div
        styleName={classNames(
          'input-container',
          {'invalid': !!error},
          styleName
        )}
        className={className}
        style={style}
      >
        {
          React.createElement(isTextArea ? 'textarea' : 'input', {
            ref: 'input',
            type: !isTextArea ? type : undefined,
            ...others,
          })
        }
        {
          error ?
          <div styleName="error">{error}</div> :
          null
        }
      </div>
    );
  }
}
