/*
    store.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Project Athena and contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    devtools: true,
    state: {
        sentryEnabled: false,
        selectedInterface: null,
        interfaceSelectionRequired: true,
        allowMultipleInstances: false,
        metaverseServer: "",
        populatedInterfaceList: [],
        noSteamVR: false,
        currentLibraryFolder: "No library folder selected.",
        currentNotice: null,
        darkMode: true
    },
    mutations: {
        mutate(state, payload) {
            state[payload.property] = payload.with;
            console.info("Payload:", payload.property, "with:", payload.with, "state is now:", this.state);
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('save-state', this.state);
        }
    }
})