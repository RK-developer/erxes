import React, { PropTypes, Component } from 'react';
import { _ } from 'meteor/underscore';
import { NotificationListRow } from '../../containers';
import { Button } from 'react-bootstrap';
import { Wrapper } from '../';
import { EmptyState } from '/imports/react-ui/common';
import Sidebar from '/imports/react-ui/settings/Sidebar.jsx';


class NotificationList extends Component {
  constructor(props) {
    super(props);

    this.state = { bulk: [] };
    this.markAsRead = this.markAsRead.bind(this);
  }

  markAsRead() {
    const { bulk } = this.state;
    _.each(this.props.notifications, (notification) => {
      if (!notification.isRead) {
        bulk.push(notification._id);
      }
    });
    this.props.markAsRead(this.state.bulk);
    this.setState({ bulk: [] });
  }

  render() {
    const notifications = this.props.notifications;
    const notifCount = notifications.length;

    let content = (
      <ul className="conversations-list notif-list">
        {
          notifications.map((notif, key) =>
            <NotificationListRow
              notification={notif}
              key={key}
            />
          )
        }
      </ul>
    );

    if (notifCount === 0) {
      content = (
        <EmptyState
          text="No notifications"
          size="full"
          icon={<i className="ion-android-notifications" />}
        />
      );
    }

    const actionBarLeft = (
      <div>
        <Button bsStyle="link" onClick={this.markAsRead}>
          <i className="ion-checkmark-circled" /> Mark all Read
        </Button>
      </div>
    );
    const actionBar = <Wrapper.ActionBar left={actionBarLeft} />;

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={[{ title: 'Notifications' }]} />}
        leftSidebar={<Sidebar />}
        actionBar={actionBar}
        content={content}
      />
    );
  }

}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired,
};

export default NotificationList;