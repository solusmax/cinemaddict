import NotificationPresenter from '../presenter/notification.js';
import {
  NotificationMessage,
  NotificationType
} from '../constants.js';

export const reportOffline = () => {
  document.title = `[offline] ${document.title}`;
  NotificationPresenter.renderNotification(NotificationMessage.OFFLINE_ON, NotificationType.WARNING);
};

export const reportOnline = () => {
  document.title = document.title.replace('[offline] ', '');
  NotificationPresenter.renderNotification(NotificationMessage.ONLINE_ON, NotificationType.SUCCESS);
};
