const path = require('path')
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/"
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
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    }
}

module.exports = config
