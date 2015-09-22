import Relay, {Mutation} from 'react-relay';

export default class UpdateNotificationSettingsMutation extends Mutation {
  static fragments = {
    privateData: () => Relay.QL`
      fragment on UserPrivate {
        id,
        notifications {
          posterApplication {
            email,
          },
          posterRequestPayment {
            email,
          },
          nelperApplicationStatus {
            email,
          },
          nelperReceivedPayment {
            email,
          },
          newsletter {
            email,
          },
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{updateNotificationSettings}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateNotificationSettingsPayload {
        privateData {
          notifications,
        }
      }
    `;
  }
  getOptimisticResponse() {
    const {privateData, settingId, settingValue} = this.props;
    privateData.notifications[settingId] = settingValue;
    return {
      privateData,
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        privateData: this.props.privateData.id,
      },
    }];
  }
  getVariables() {
    return {
      settingId: this.props.settingId,
      settingValue: this.props.settingValue,
    };
  }
}
