const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
   lintOnSave:false,   //关闭eslint校验
  //  devServer: {
  //   https: {
  //     key: fs.readFileSync('./certs/localhost+3-key.pem'),
  //     cert: fs.readFileSync('./certs/localhost+3.pem'),
  //   },
  // },
})

