const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

let localCanisters, prodCanisters, canisters;

function initCanisterEnv() {

  if (process.env.CANISTER_ID_BACKEND && process.env.CANISTER_ID_FRONTEND) {
    return {
      CANISTER_ID_BACKEND: process.env.CANISTER_ID_BACKEND,
      CANISTER_ID_FRONTEND: process.env.CANISTER_ID_FRONTEND,
      CANISTER_ID_INTERNET_IDENTITY: process.env.CANISTER_ID_INTERNET_IDENTITY,
    };
  }

  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  canisters = network === "local" ? localCanisters : prodCanisters;
  return Object.entries(canisters).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev["CANISTER_ID_" + canisterName.toUpperCase()] =
      canisterDetails[network];
    return prev;
  }, {});
}

const canisterEnvVariables = initCanisterEnv();
const isDevelopment = process.env.NODE_ENV !== "production";
const frontend_entry = path.join("src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    index: path.join(__dirname, "src", "index.html").replace(/\.html$/, ".tsx"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
    alias: {
      unity: path.resolve(__dirname, 'dist/unity')
    }
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },

  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  module: {
    rules: [
    { 
      test: /\.(ts|tsx|jsx)$/, 
      exclude: [/node_modules/], 
      loader: "ts-loader" 
    },
    { 
      test: /\.(css|scss)$/, 
      use: ['style-loader','css-loader'] 
    },
    { 
      test: /\.(png|jpg|jpeg|gif)$/i, 
      type: "asset/resource", 
    }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, frontend_entry),
      cache: false,
    }),
	  new webpack.EnvironmentPlugin({
      CANISTER_ID_BACKEND: canisterEnvVariables["CANISTER_ID_BACKEND"],
      CANISTER_ID_FRONTEND: canisterEnvVariables["CANISTER_ID_FRONTEND"],
      CANISTER_ID_INTERNET_IDENTITY: canisterEnvVariables["CANISTER_ID_INTERNET_IDENTITY"] || "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai"
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "src", "assets"), to: path.join(__dirname, "dist") },
      ],
    }),
  ],
  // proxy /api to port 4943 during development
  devServer: {
    proxy: [
      {
        context: ["/api"],
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    ],
    static: path.resolve(__dirname, "src", "assets"),
    hot: true,
    watchFiles: [path.resolve(__dirname, "src")],
    liveReload: true,
  },
};
