/*
    migrateLauncher.js

    Created by Kalila L. on June 30 2020.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const fs = require('fs');

function detectOldDataPath(oldName, newName, currentDataPath) {
    var checkingForPath = currentDataPath.replace(newName, oldName);
    
    if (fs.existsSync(checkingForPath)) {
        return checkingForPath;
    } else {
        return false;
    }
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function moveInstalls(fromDataPath, newDataPath) {
    var directories = getDirectories(fromDataPath);
    
    directories.forEach((installFound) => {
        var fullOldInstallPath = fromDataPath + '\\' + installFound;
        fs.rename(fullOldInstallPath, newDataPath, function (err) {
            if (err) {
                throw err
            } else {
                console.info("Successfully migrated", fullOldInstallPath, "!");
            }
        });
    });    
}

export { detectOldDataPath, moveInstalls };