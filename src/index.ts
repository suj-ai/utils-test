import MixpanelBrowser, { Mixpanel } from 'mixpanel-browser';
import { isNil } from 'lodash';

let MIXPANEL_TOKEN: string = '';

class Analytics {
  private static _instance: Analytics;
  private mixpanelApi: Mixpanel;
  private _skipAnalytics: boolean = false;

  private constructor() {
    this.mixpanelApi = MixpanelBrowser;
    this.mixpanelApi.init(MIXPANEL_TOKEN, {}, '');
  }

  public static get Instance(): Analytics {
    return this._instance || (this._instance = new this());
  }

  async setToken(Token: string) {
    MIXPANEL_TOKEN = Token;
  }
  async trackEvent(EventName: string, data?: object) {
    return new Promise((resolve, reject) => {
      try {
        if (this._skipAnalytics) {
          return resolve(true);
        }
        this.mixpanelApi.track(EventName, data, () => {
          resolve(true);
        });
      } catch (error) {
        reject(false);
      }
    });
  }

  async trackAnonymousEvent(eventName: string, data?: object) {
    if (this._skipAnalytics) {
      return;
    }

    try {
      const properties = isNil(data) ? { token: MIXPANEL_TOKEN } : { token: MIXPANEL_TOKEN, ...data };
      const reqData = {
        event: eventName,
        properties: properties,
      };
      const body: any = new URLSearchParams();
      body.append('data', JSON.stringify(reqData));
      const options = {
        method: 'POST',
        body: body,
      };
      await fetch('https://api.mixpanel.com/track', options);
    } catch (err) {
      console.error('Error tracking anonymous mixpanel event', err);
    }
  }

  reset() {
    this.mixpanelApi.reset();
  }
}

export default Analytics.Instance;
