/*
    vue.config.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "nsis": {
                    "artifactName": "VircadiaLauncherSetup.${ext}",
                    "installerIcon": "src/assets/logo_launcher_256_256.ico",
                    "uninstallerIcon": "src/assets/logo_launcher_256_256.ico",
                    "uninstallDisplayName": "Vircadia Launcher",
                    "allowElevation": true,
                    "perMachine": true,
                    "createStartMenuShortcut": true,
                },
                "publish": [
                    {
                        "provider": "generic",
                        "url": "https://cdn.vircadia.com/dist/launcher/updater/"
                    }
                ],
                "win": {
                    "target": "nsis",
                    "icon": "src/assets/logo_launcher_256_256.ico",
                    "publisherName": "Vircadia",
                    "rfc3161TimeStampServer": "http://timestamp.comodoca.com/",
                },
                "linux": {
                    "target": [
                        "AppImage",
                        "deb"
                    ]
                },
                "extraFiles": [
                    {
                        "from": "./bat/launcher.bat",
                        "to": "./bat/launcher.bat"
                    }
                ],
                "appId": "com.vircadia.pantheon",
                "productName": "Vircadia Launcher",
                "copyright": "Vircadia"
            },
        },
    },
    runtimeCompiler: true
}