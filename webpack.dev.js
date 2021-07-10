const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/index.ts"),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, "./src/index.html") })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
                include: path.resolve(__dirname, "./src"),
                sideEffects: true
            },
            {
                test: /\.(ttf|glb)$/,
                type: "asset/resource",
            }
        ],

    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "public"),
        port: 4000,
    },
};