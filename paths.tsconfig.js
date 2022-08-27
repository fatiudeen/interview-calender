export default {
  baseUrl: './',
  paths: {
    '@config': ['src/config/index'],
    '@app': ['src/api/v1/app'],
    '@interface/*': ['src/api/v1/interface/*'],
    '@routes/*': ['src/api/v1/routes/*'],
    '@middlewares/*': ['src/api/v1/middlewares/*'],
    '@helpers/*': ['src/api/v1/helpers/*'],
    '@services/*': ['src/api/v1/services/*'],
    '@controllers/*': ['src/api/v1/controllers/*'],
    '@dtos/*': ['src/api/v1/dtos/*'],
    '@database': ['src/api/v1/utils/DB'],
  },
};
