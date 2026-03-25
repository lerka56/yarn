const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[contenthash].js',
        clean: true,
        // Уберите publicPath для GitHub Pages или оставьте пустым
        publicPath: './'  // Используйте './' вместо '/yarn/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // Уберите base, если он вызывает проблемы
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        port: 3000,
        open: true,
        historyApiFallback: true
    }
};