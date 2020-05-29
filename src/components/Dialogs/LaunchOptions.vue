<!--
//  LaunchOptions.vue
//
//  Created by KasenVR on 19 May 2020.
//  Copyright 2020 Vircadia and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="550"
        persistent
        v-model="showLaunchOptions"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-settings-outline</v-icon>
                Launch Options
            </v-card-title>
    
            <v-divider></v-divider>

            <v-list-item @click="allowMultipleInstancesStore = !allowMultipleInstancesStore">
                <template>
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            :true-value="allowMultipleInstancesStore"
                            :input-value="allowMultipleInstancesStore"
                            v-model="allowMultipleInstancesStore"
                        ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Simultaneous Interfaces</v-list-item-title>
                        <v-list-item-subtitle>Allow multiple interfaces to be run simultaneously.</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>
            <v-list-item @click="noOculusStore = !noOculusStore">
                <template>
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            :true-value="noOculusStore"
                            :input-value="noOculusStore"
                            v-model="noOculusStore"
                        ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Disable Oculus</v-list-item-title>
                        <v-list-item-subtitle>Disable launching and attaching Oculus to the interface.</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>
            <v-list-item @click="noSteamVRStore = !noSteamVRStore">
                <template>
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            :true-value="noSteamVRStore"
                            :input-value="noSteamVRStore"
                            v-model="noSteamVRStore"
                        ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Disable SteamVR</v-list-item-title>
                        <v-list-item-subtitle>Disable launching and attaching SteamVR to the interface.</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>
            <v-list-item @click="autoRestartInterfaceStore = !autoRestartInterfaceStore">
                <template>
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            :true-value="autoRestartInterfaceStore"
                            :input-value="autoRestartInterfaceStore"
                            v-model="autoRestartInterfaceStore"
                        ></v-checkbox>
                    </v-list-item-action>
            
                    <v-list-item-content>
                        <v-list-item-title>Auto Restart Interface</v-list-item-title>
                        <v-list-item-subtitle>The launcher will auto-restart Interface if it closes with an exit code.</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>
            <v-list-item @click="dontPromptForLoginStore = !dontPromptForLoginStore">
                <template>
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            :true-value="dontPromptForLoginStore"
                            :input-value="dontPromptForLoginStore"
                            v-model="dontPromptForLoginStore"
                        ></v-checkbox>
                    </v-list-item-action>
            
                    <v-list-item-content>
                        <v-list-item-title>Don't Prompt for Login</v-list-item-title>
                        <v-list-item-subtitle>Do not show the login screen when opening Interface.</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list-item>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
                >
                    Done
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'LaunchOptions',
	methods: {
        LaunchOptions: function (url) {
            const { shell } = require('electron');
			shell.openExternal(url);
        }
     },
    data: () => ({
        showLaunchOptions: true,
        launchOptions: [],
    }),
    computed: {
        noSteamVRStore: {
            get() {
                return this.$store.state.noSteamVR;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'noSteamVR', 
                    with: value
                });
            },
        },
        noOculusStore: {
            get() {
                return this.$store.state.noOculus;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'noOculus', 
                    with: value
                });
            },
        },
        allowMultipleInstancesStore: {
            get() {
                return this.$store.state.allowMultipleInstances;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'allowMultipleInstances', 
                    with: value
                });
            },
        },
        autoRestartInterfaceStore: {
            get() {
                return this.$store.state.autoRestartInterface;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'autoRestartInterface', 
                    with: value
                });
            },
        },
        dontPromptForLoginStore: {
            get() {
                return this.$store.state.dontPromptForLogin;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'dontPromptForLogin', 
                    with: value
                });
            },
        },
    },
    created: function () {
        
    }
};
</script>
