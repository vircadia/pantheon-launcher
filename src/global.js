/*
    global.js

    Created by Kalila L. on Jan 13 2021.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

import path from 'path';
const storage = require('electron-json-storage');
const fs = require('fs');

// Load pantheon.config.js
global.pantheonConfig = require('../pantheon.config.js');
// Load package.json to grab values from it.
global.packageJSON = require('../package.json');

global.fs = fs;
global.storage = storage;

// Universal Variables
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.win = null;
global.tray = null;
global.APPLICATION_NAME = pantheonConfig.app.name;
global.APPLICATION_VERSION = packageJSON.version;
global.PRODUCT_NAME = packageJSON.productName + '.exe';
global.LAUNCHER_ICON = path.join(__static, '/resources/logo_launcher_256_256.ico');
global.DEFAULT_CDN_URL = pantheonConfig.cdn.root;
global.DEFAULT_CDN_EVENTS_FILENAME = pantheonConfig.cdn.eventsFilename;
global.DEFAULT_CDN_METADATA_FILENAME = pantheonConfig.cdn.metadataFilename;
global.developmentMode = process.env.NODE_ENV !== 'production';
global.electronDlItemMain = null;
global.storagePath = {
	main: storage.getDefaultDataPath(),
	interface: null,
	interfaceSettings: null,
	currentLibrary: null,
};

if (pantheonConfig.app.developmentMode === true) {
    developmentMode = true;
}