const path = require('path')
const webpack = require('webpack')
const CURRENT_WORKING_DIR = process.cwd()
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist/js'),
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
            // `.ts` or `.tsx` files are parsed using `ts-loader`
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {
                     transpileOnly: true
                }
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
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
            }
        ]
    },  
    plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new ReactRefreshWebpackPlugin(),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],       
    }
}

module.exports = config
