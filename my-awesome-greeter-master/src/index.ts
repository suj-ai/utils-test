import MixpanelBrowser, { Mixpanel } from 'mixpanel-browser';
import { isNil } from 'lodash';

// import { MIXPANEL_TOKEN } from 'constants/analytics.constants';

let token = '';
class Analytics {
  private static _instance: Analytics;
  private mixpanelApi: Mixpanel;
  private _skipAnalytics: boolean = false;

  private constructor() {
    this.mixpanelApi = MixpanelBrowser;
    this.mixpanelApi.init(token, {}, '');
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
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
      const properties = isNil(data) ? { token: token } : { token: token, ...data };
      const reqData = {
        event: eventName,
        properties: properties,
      };
      const body = new URLSearchParams();
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
}

export default Analytics.Instance;
