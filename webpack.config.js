const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    plugins: [
        new NodePolyfillPlugin(),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            const mod = resource.request.replace(/^node:/, "");
            // console.log(mod)
            switch (mod) {
                case "util":
                case "stream":
                case "events":
                    resource.request = mod
                    break
            }
        }),
    ],
    // ... other webpack config
    resolve: {
        fallback: {
            // Use can only include required modules. Also install the package.
            // for example: npm install --save-dev assert
            fs: false,
            stream: false,
            util: false,
            diagnostics_channel: false,
            worker_threads: false,
            perf_hooks: false,
            http2: false,
            child_process: false,
            net: false,
            tls: false,
            async_hooks: false
        }
    },
    stats: {
        errorDetails: true
    }
}