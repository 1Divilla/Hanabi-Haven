export default () => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 50 * 1024 * 1024,
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
    },
  },
});