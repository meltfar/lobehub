// Entry component
import { App } from 'antd';
import { type MessageInstance } from 'antd/es/message/interface';
import { type ModalStaticFunctions } from 'antd/es/modal/confirm';
import { type NotificationInstance } from 'antd/es/notification/interface';
import { memo } from 'react';

let _message: MessageInstance | undefined;
let _notification: NotificationInstance | undefined;
let _modal: Omit<ModalStaticFunctions, 'warn'> | undefined;

export default memo(() => {
  const staticFunction = App.useApp();
  _message = staticFunction.message;
  _modal = staticFunction.modal;
  _notification = staticFunction.notification;
  return null;
});

export const message = new Proxy<MessageInstance>({} as MessageInstance, {
  get: (_, prop) => _message?.[prop as keyof MessageInstance],
});

export const modal = new Proxy<Omit<ModalStaticFunctions, 'warn'>>(
  {} as Omit<ModalStaticFunctions, 'warn'>,
  {
    get: (_, prop) => _modal?.[prop as keyof ModalStaticFunctions],
  },
);

export const notification = new Proxy<NotificationInstance>({} as NotificationInstance, {
  get: (_, prop) => _notification?.[prop as keyof NotificationInstance],
});
