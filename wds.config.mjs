import baseConfig from './wds.base.config.mjs';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  ...baseConfig,
  appIndex: 'index.html',
  open: false,
});
