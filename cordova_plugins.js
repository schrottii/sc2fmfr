cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "nl.madebymark.share.Share",
      "file": "plugins/nl.madebymark.share/www/share.js",
      "pluginId": "nl.madebymark.share",
      "clobbers": [
        "window.navigator.share"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.3",
    "nl.madebymark.share": "0.1.1"
  };
});