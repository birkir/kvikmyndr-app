const upstreamTransformer = require('metro/src/reactNativeTransformer');
const typescriptTransformer = require('react-native-typescript-transformer');
const uenoCssModulesTransformer = require('react-native-ueno-css-modules/transformer');
const gqlLoader = require('graphql-tag/loader');

const gqlTransform = gqlLoader.bind({
  cacheable: () => null,
});

module.exports.transform = ({ src, filename, options }) => {

  if (filename.endsWith('.gql') || filename.endsWith('.graphql')) {
    return upstreamTransformer.transform({ src: gqlTransform(src), filename, options });
  }

  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
    return typescriptTransformer.transform({ src, filename, options });
  }

  if (filename.endsWith('.css') || filename.endsWith('.styl') || filename.endsWith('.scss') || filename.endsWith('.sass') || filename.endsWith('.less')) {
    return uenoCssModulesTransformer.transform({ src, filename, options });
  }

  return upstreamTransformer.transform({ src, filename, options });
};
