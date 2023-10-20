# Issue reproduction steps

- Initialize an empty repo and create `package.json` with `npm init`
- Execute `npm create vite` to start Vite prompt
- Choose `React` an `Typescript` when prompted
- Once the project is created, install the latest Storybook 7 - `npx storybook@latest init`
- Create `.babelrc` file in the root of the project to make typescript work. The file contents are the following:

```json
{
  "sourceType": "unambiguous",
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 100
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  "plugins": []
}
```

- Install the webpack builder - `@storybook/react-webpack5`
- Change the `main.ts` config to work with the webpack builder
- Add the following code to the webpack config that processes the `?raw` files (it used to work in Storybook 6!)
```ts
  webpackFinal: async (config) => {
    return {
      ...config,
      module: {
        // This section allows to support ?raw syntax
        // more info https://github.com/webpack/webpack/issues/12900#issuecomment-1479392726
        ...config.module,
        rules: [
          ...(config?.module?.rules as any).map((rule) => ({
            ...rule,
            resourceQuery: { not: [/raw/] },
          })),
          {
            resourceQuery: /raw/,
            type: 'asset/source',
          },
        ],
      },
    }
  },
```
- Run Storybook and observe a result
- Additionally, build storybook locally and check the contents of the `iframe.html` file. They'll look like this:
```html
var _ = eval("require")("/Users/dimafirsov/Boom/Git/storybook7-webpack-raw-files-issue/node_modules/lodash/lodash.js");module.exports = function (templateParams) { with(templateParams) {return (function(data) { var __t, __p = '', __j = Array.prototype.join; function print() { __p += __j.call(arguments, '') } __p += '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>' + ((__t = ( htmlWebpackPlugin.options.title || 'Storybook')) == null ? '' : __t) + '</title>\n\n '; if (htmlWebpackPlugin.files.favicon) { ; __p += '\n<link rel="shortcut icon" href="' +
((__t = ( htmlWebpackPlugin.files.favicon)) == null ? '' : __t) +
'">\n '; } ; __p += '\n\n<meta name="viewport" content="width=device-width,initial-scale=1">\n\n<link rel="prefetch" href="./sb-common-assets/nunito-sans-regular.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="prefetch" href="./sb-common-assets/nunito-sans-italic.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="prefetch" href="./sb-common-assets/nunito-sans-bold.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="prefetch" href="./sb-common-assets/nunito-sans-bold-italic.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="./sb-common-assets/fonts.css">\n \n '; if (typeof headHtmlSnippet !== 'undefined') { ; __p += ' ' + ((__t = ( headHtmlSnippet )) == null ? '' : __t) + ' '; } ; __p += ' '; htmlWebpackPlugin.files.css.forEach(file => { ; __p += '\n<link href="' +
((__t = ( file )) == null ? '' : __t) +
'" rel="stylesheet">\n '; }); ; __p += '\n\n<style>\n      #storybook-root[hidden],\n      #storybook-docs[hidden] {\n        display: none !important;\n      }\n</style>\n</head>\n<body>\n '; if (typeof bodyHtmlSnippet !== 'undefined') { ; __p += ' ' + ((__t = ( bodyHtmlSnippet )) == null ? '' : __t) + ' '; } ; __p += '\n\n<div id="storybook-root"></div>\n<div id="storybook-docs"></div>\n\n '; if (typeof globals !== 'undefined' && Object.keys(globals).length) { ; __p += '\n<script>\n      ';
 for (var varName in globals) { ;
__p += '\n          ';
 if (globals[varName] != undefined) { ;
__p += '\n            window[\'' +
((__t = (varName)) == null ? '' : __t) +
'\'] = ' +
((__t = ( JSON.stringify(globals[varName]) )) == null ? '' : __t) +
';\n          ';
 } ;
__p += '\n      ';
 } ;
__p += '\n</script>\n '; } ; __p += '\n<script type="module">\n      import \'./sb-preview/runtime.js\';\n\n      ';
 htmlWebpackPlugin.files.js.forEach(file => { ;
__p += '\n      import \'./' +
((__t = ( file )) == null ? '' : __t) +
'\';\n      ';
 }); ;
__p += '\n</script>\n</body>\n</html>\n'; return __p })();}}
```
