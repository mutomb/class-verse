//CommonJS module require
const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack'); //only expose environment variables that are explicitly referenced in your code to your final bundle
//ECMA module import
// import path from 'path'
// import webpack from 'webpack'
// import Dotenv from 'dotenv-webpack'
// import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true', /**Send client notifications to update bundle */
        path.join(CURRENT_WORKING_DIR, 'client', 'main.tsx')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR ,'dist','js'),
        filename: 'bundle.js',
        publicPath: '/dist/js/', //Prefix bundle.js with /dist/js in <script> tag, so that to download bundle.js from server at URL /dist/js/bundle.js
    },
    devServer: { 
        inline: false, 
        contentBase: "./dist",
        hot: true,
    },
    module: {
        rules: [
            // `.ts` or `.tsx` are parsed using `ts-loader`
            {
                test: /\.(ts|tsx)?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            },
            // `js` and `jsx` files are parsed using `babel`
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: require.resolve('babel-loader'),
                    options: {
                      plugins: [require.resolve('react-refresh/babel')],
                    },
                  },
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png|ico|pdf)(\?[\s\S]+)?$/,
                use: [{
                    loader:'file-loader',
                        options: {
                            name:'../images/[name].[ext]'
                        }
                    }],
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'] //css-loader parse @import in CSS files. style-loader inject CSS into bundle DOM
            },
            {
                test: /\.(js|jsx)?$/,
                include: path.join(CURRENT_WORKING_DIR, 'node_modules', 'react-typed'),
                use: [{
                    loader:'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }]
            },
        ],
    },  
    plugins: [
          new webpack.HotModuleReplacementPlugin(), //Enables HMR for on the fly CSS/JS exchange
          new webpack.NoEmitOnErrorsPlugin(),
          new ReactRefreshWebpackPlugin(),
          new Dotenv()
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],       
    }
}

module.exports = config
