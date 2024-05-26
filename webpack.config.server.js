//CommonJS module import/require
const path = require('path')
const nodeExternals = require('webpack-node-externals')
//ECMA module import
// import path from 'path'
// import nodeExternals from 'webpack-node-externals'
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    name: "server",
    entry: [ path.join(CURRENT_WORKING_DIR , 'server', 'server.ts') ],
    target: "node",
    output: {
        path: path.join(CURRENT_WORKING_DIR , 'dist','js'),
        filename: "server.generated.js",
        publicPath: '/dist/js/',
        libraryTarget: "commonjs2",
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            // `.ts` or `.tsx` files are parsed using `ts-loader` for TS to JS
            {
                test: /\.(ts|tsx)?$/,
                loader: "ts-loader",
                options: {
                        transpileOnly: true
                }
            },
	       // `js` and `jsx` files are parsed using `babel` for ES6+ to lower ES6-
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
                use: [{
                    loader:'css-loader',
                        options: {
                            sourceMap:false,
                        }
                    }],
            },
            // { // To extract CSS
            //     test: /\.css$/,
            //     use: [{
            //         loader:'file-loader',
            //             options: {
            //                 name:'../css/[name].[ext]',
            //                 sourceMap:false,
            //                 exportType:"string"
            //             }
            //         }],
            // }
            
        ]
    },
    resolve: {
    	extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    }
}

module.exports = config
