/*
    pantheon.config.js

    Created by Kalila L. on Jan 10 2021.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

module.exports = {
    'cdn': {
        'root': 'https://api.github.com/repos/vircadia/vircadia/releases',
        'eventsFilename': 'vircadiaEvents.json',
        'metadataFilename': 'vircadiaMeta.json'
    },
    'app': {
        'name': 'Vircadia Launcher',
        'width': 1000,
        'height': 800,
        'developmentMode': false
    },
    'manager': {
        'preInstallerName': 'Vircadia_Setup_Latest.exe',
        'postInstallerName': 'Vircadia_Setup_Latest_READY.exe'
    }
}