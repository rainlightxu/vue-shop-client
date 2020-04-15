// 发布模式下移除console
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
//babel配置文件，向外暴露一个对象，对象属性包括：presets,plugins,
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}