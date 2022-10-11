import mixpanel from 'mixpanel-browser';

let Analytics: any = {
  token: '',
  init: function(config: any) {
    return mixpanel.init(this.token, config);
  },
  track: function(data: string, config: any) {
    return mixpanel.track(data, config);
  },
};

export default Analytics;
