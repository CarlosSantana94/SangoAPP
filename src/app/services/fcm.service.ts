import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Router} from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PermissionStatus
} from '@capacitor/push-notifications';
import {RESTService} from "../rest.service";

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private rest: RESTService) {
  }

  async initPushNotifications(userId: string) {
    try {
      if (Capacitor.getPlatform() === 'android') {
        await PushNotifications.createChannel({
          id: 'sango-channel',
          name: 'Sango Tintorería',
          description: 'Notificaciones de pedidos',
          importance: 5,
          sound: 'sango_notif',   // nombre sin extensión → res/raw/sango_notif.mp3
          visibility: 1,
          vibration: true,
        });
      }

      const permissionStatus = await PushNotifications.requestPermissions();

      if (permissionStatus.receive === 'granted') {
        await PushNotifications.register();
        this.setupListeners(userId);
      }
    } catch (error) {
      console.error('Error initializing push notifications', error);
    }
  }

  private setupListeners(userId: string) {
    PushNotifications.addListener('registration', (token: Token) => {
      this.updateUserToken(userId, token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ', notification);
        // Handle notification received (show toast, etc.)
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ', notification);
        // Handle notification tap (navigate to specific page, etc.)
      }
    );
  }

  private updateUserToken(userId: string, token: string) {
    this.rest.getUsuarioV2(userId).subscribe(data => {
      if (data && data.id) {
        data.tokenNotificaciones = token;
        this.rest.updateUsuarioV2(data).subscribe(() => {
          console.log('User token updated successfully');
        }, error => {
          console.error('Error updating token:', error);
        });
      }
    });
  }
}
