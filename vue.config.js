/*
    vue.config.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Project Athena and contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

module.exports = {
	"transpileDependencies": [
		"vuetify"
	],
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				"nsis": {
					"artifactName": "VircadiaLauncherSetup.${ext}",
					"installerIcon": "src/assets/logo_256_256.ico",
					"uninstallerIcon": "src/assets/logo_256_256.ico",
					"uninstallDisplayName": "Vircadia Launcher",
                    "createStartMenuShortcut": true,
				},
				"win": {
					"target": "nsis",
					"icon": "src/assets/logo_256_256.ico",
					"publisherName": "https://vircadia.com/",
					"requestedExecutionLevel": "requireAdministrator",
				},
				"linux": {
					"target": [
    					"AppImage",
    					"deb"
					]
				},
				// "extraFiles": [
				//   "settings.json"
				// ],
				"appId": "com.vircadia.pantheon",
				"productName": "Vircadia Launcher",
			},
		},
	},
	runtimeCompiler: true
}