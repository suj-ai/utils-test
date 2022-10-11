import mixpanel from 'mixpanel-browser';

let Analytics: any = {
  init: function(token: string, config: any) {
    return mixpanel.init(token, config);
  },
  track: function(data: string, config: any) {
    return mixpanel.track(data, config);
  },
};

export default Analytics;
