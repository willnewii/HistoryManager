var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var config = require('../config');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

let webpackConfig = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test'), resolve('node_modules/vue-lib')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                publicPath: '../../',
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};


if (process.env.ENV_DLL && fs.existsSync(resolve('static/dll/core-mainfest.json'))) {
    console.log('build with DllReferencePlugin');
    webpackConfig.plugins.push(new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../static/dll/core-mainfest.json') // 指向这个json
    }));
} else {
    console.log('build without DllReferencePlugin');
}

module.exports = webpackConfig;
