var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    console.log(JSON.stringify(files) + "xiaojie");
    return files;
}

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/js/"),
        publicPath: "dist/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/js/lib/jquery.min.js",
            // core: srcDir + "/js/core",
            ui: srcDir + "/js/ui",
            biz: srcDir + "/js/biz",
            paginator : srcDir + '/js/lib/jqPaginator.js',
            artTemplate : srcDir + '/js/lib/artTemplate.js',
            bootstrap : srcDir + '/js/lib/bootstrap.min.js',
            ueditor_config : srcDir + '/js/lib/ueditor/ueditor.config.js',
            ueditor: srcDir + '/js/lib/ueditor/ueditor.all.min.js',
            metisMenu: srcDir + '/js/lib/metisMenu.min.js',
            datepicker: srcDir + '/js/lib/bootstrap-datepicker.js',
            startmin: srcDir + '/js/lib/startmin.js'
        }
    },
    plugins: [
        new CommonsChunkPlugin('common.js',['ui']),
        new CommonsChunkPlugin('util.js',['biz']),
        // new uglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};