var webpack = require("webpack"),
    pkg = require('./package.json'),
    src = __dirname;
var path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "vendor.css",
    disable: false
});

function isExternal(module) {
    // var context = module.context;
    if (typeof module.userRequest !== 'string')
        return false;
    return !!module.userRequest.split('!').pop().match(/\.scss$/) ||
        !!module.userRequest.split('!').pop().match(/(node_modules|bower_components|libraries)/);
}

module.exports = {
    context: src,
    entry: {
        "list": "./js_src/list.js",
        "users": "./js_src/users.js"
    },
    // devtool: "source-map",
    output: {
        path: __dirname + "/js/",
        filename: "[name].js"
    },
    resolve: {
        alias: {
            'jquery': path.join(__dirname, './node_modules/jquery')
        }
    },
    module: {
        loaders: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                query: {
                    "knownHelpers": [
                        "ifCond", 'get_status_style', "format_date", "format_datetime", "format_pars", 'select',
                        "eq", "eeq", "ne", "nee", "lt", "gt", "lte", "gte", "and", "or", "formatDate"
                    ]
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jpe?g|gif|png|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader?jQuery!expose-loader?$'
            },
            {
                test: /\.css$/,
                loaders: ["style-loader","css-loader"]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery',
            "window.$": 'jquery',
            "ajax": 'jquery.aiire.ajax.js',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return isExternal(module);
            }
        }),
        extractSass,
        // new webpack.optimize.UglifyJsPlugin({
        //     // include: /\.min\.js$/,
        //     minimize: true,
        //     compress: true,
        //     extractComments: false,
        //     parallel: 4
        // })
    ]
};
