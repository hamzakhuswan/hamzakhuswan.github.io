const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "./src/index.ts"),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, "./src/index.html") }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'font',
            include: 'allAssets',
            fileWhitelist: [/\.ttf$/i],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new CopyPlugin({
            patterns: [
                { from: "./public/**", to: "." },
            ],
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
                sideEffects: true
            },
            {
                test: /\.(ttf|glb)$/,
                type: "asset/resource",
            }
        ],
    }
};