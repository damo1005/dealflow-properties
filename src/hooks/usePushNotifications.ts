import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// VAPID public key - in production, this would come from environment
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

function getDeviceName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('iPhone')) return 'iPhone';
  if (ua.includes('iPad')) return 'iPad';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Mac')) return 'Mac';
  if (ua.includes('Windows')) return 'Windows PC';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown Device';
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        
        // Check if already subscribed
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (err) {
          console.error('Error checking subscription:', err);
        }
      }
      
      setIsLoading(false);
    };

    checkSupport();
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    if (!VAPID_PUBLIC_KEY) {
      toast.error('Push notifications not configured. Please add VAPID keys.');
      return false;
    }

    try {
      setIsLoading(true);

      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        toast.error('Notification permission denied');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to enable notifications');
        return false;
      }

      const subscriptionJson = subscription.toJSON();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscriptionJson.endpoint!,
          p256dh_key: subscriptionJson.keys?.p256dh || '',
          auth_key: subscriptionJson.keys?.auth || '',
          user_agent: navigator.userAgent,
          device_name: getDeviceName(),
        }, {
          onConflict: 'user_id,endpoint',
        });

      if (error) throw error;

      setIsSubscribed(true);
      toast.success('Push notifications enabled!');
      return true;

    } catch (err: any) {
      console.error('Subscribe error:', err);
      toast.error(err.message || 'Failed to enable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }
      }

      setIsSubscribed(false);
      toast.success('Push notifications disabled');
      return true;

    } catch (err: any) {
      console.error('Unsubscribe error:', err);
      toast.error(err.message || 'Failed to disable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      const response = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: user.id,
          title: '🔔 Test Notification',
          body: 'Push notifications are working correctly!',
          data: { url: '/insights/alerts' },
        },
      });

      if (response.error) throw response.error;
      
      toast.success('Test notification sent!');
    } catch (err: any) {
      console.error('Test notification error:', err);
      toast.error('Failed to send test notification');
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}
