//CommonJS module import/require
const path = require('path')
const Dotenv = require('dotenv-webpack');
//ECMA module import
// import path from 'path'
// import Dotenv from 'dotenv-webpack'
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client', 'main.tsx')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , 'dist','js'),
        filename: 'bundle.js',
        publicPath: "/dist/js/", //static file route path by webpack middleware for serving bundle.js from filesystem
    },
    module: {
        rules: [
            // `js` and `jsx` files are parsed using `babel`
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
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
                include: path.resolve(__dirname, './'),
                use: [
                    'babel-loader'
                ]
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
        ]
    },
    plugins: [
        new Dotenv()
    ],
    resolve: {
        extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    }
}

module.exports = config
