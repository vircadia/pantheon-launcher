/*
    store.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/* eslint no-redeclare: 0 */  // --> OFF

import Vue from 'vue';
import Vuex from 'vuex';

const { ipcRenderer } = require('electron');

Vue.use(Vuex);

export const store = new Vuex.Store({
    devtools: true,
    state: {
        appVersion: process.env.VUE_APP_VERSION,
        darkMode: true,
        sentryEnabled: false,
        selectedInterface: null,
        interfaceSelectionRequired: true,
        metaverseServer: 'https://metaverse.vircadia.com/live',
        populatedInterfaceList: [],
        pendingGoto: null,
        downloadOnNextLaunch: false,
        hideOnLaunch: false,
        // Launch Parameters
        customLaunchParameters: '',
        allowMultipleInstances: false,
        noSteamVR: false,
        noOculus: false,
        dontPromptForLogin: false,
        launchAsChild: false,
        autoRestartInterface: false,
        shouldCheckForUpdates: true,
        // End Launch Parameters
        currentLibraryFolder: 'No library folder selected.',
        currentNotice: null
    },
    mutations: {
        mutate (state, payload) {
            // This means we're trying to update a specific set of items.
            if (payload.property) {
                if (!payload.update) {
                    state[payload.property] = payload.with;
                } else {
                    for (var item in payload.with) {
                        if (Object.prototype.hasOwnProperty.call(state[payload.property], item)) {
                            state[payload.property][item] = payload.with[item];
                        }
                    }
                }

                console.info('Updated:', payload.property, 'with:', payload.with, 'state is now:', this.state);
            } else {
            // This means we're trying to update the entire store.
                if (!payload.update) {
                    state = payload.with;
                } else {
                    for (var item in payload.with) {
                        if (Object.prototype.hasOwnProperty.call(state, item)) {
                            state[item] = payload.with[item];
                        }
                    }
                }

                console.info('Updated:', state, 'with:', payload.with, 'state is now:', this.state);
            }

            ipcRenderer.send('save-state', this.state);
        }
    }
})