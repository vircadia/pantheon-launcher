/*
    privileges.js

    Created by Kalila L. on Mar 5 2021.
    Copyright 2021 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const isAdmin = require('is-admin');

async function isRunningAsAdministrator () {
    var requestIsAdmin = await isAdmin();
    
    if (requestIsAdmin) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    'isRunningAsAdministrator': isRunningAsAdministrator
}
