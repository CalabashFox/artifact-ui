import path from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const SRC = path.resolve(__dirname, 'src/main/js');

const config: Configuration = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },{
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.[(png)|(obj)|(json)|(mp3)]$/,
                loader: 'file-loader'
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.less'],
        alias: {
            models: path.resolve(__dirname, 'src/models/'),
            actions: path.resolve(__dirname, 'src/actions/'),
            reducers: path.resolve(__dirname, 'src/reducers/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            components: path.resolve(__dirname, 'src/components/'),
            containers: path.resolve(__dirname, 'src/containers/'),
            assets: path.resolve(__dirname, 'src/assets/'),
            i18n: path.resolve(__dirname, 'src/i18n/'),
            react: path.resolve('./node_modules/react')
        }
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        hot: true,
        https: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 4000,
        historyApiFallback: true
    },
    devtool: 'inline-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            eslint: {
                files: './src/**/*.tsx'
            }
        })
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};

export default config;
