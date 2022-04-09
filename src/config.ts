function installConfig(Vue, options = {}) {
  Vue.prototype.$CaEditor = {
    config: {
      BASE_CMS_URL: 'https://cms.communityanalytics.com.au/',
      BASE_API_URL: 'https://caapp.com.au',
      API_MEDIA_SERVICE_DOMAIN: 'media.caapp.com.au',
      ...options,
    },
  }
}

export default installConfig
