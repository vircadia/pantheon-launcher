<!--
//  InstallFailed.vue
//
//  Created by Kalila L. on 22 Feb 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showInstallFailed"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                Installation Failed
            </v-card-title>
    
            <v-card-text>
                {{installFailedMessage}}<br />
                <v-expansion-panels
                    v-model="panel"
                    v-if="this.installFailedCode && this.installFailedCode !== -1"
                >
                    <v-expansion-panel>
                        <v-expansion-panel-header>Error Information</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            Error code <pre>{{installFailedCode}}</pre> <br />
                            The full error is shown below: <br />
                            <pre>{{installFailedError}}</pre>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer
                    v-if="!this.installFailedCode"
                ></v-spacer>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
                >
                    Dismiss
                </v-btn>
                <v-spacer
                    v-if="this.installFailedCode === -1"
                ></v-spacer>
                <v-btn
                    color="primary"
                    v-if="this.installFailedCode === -1"
                    @click="requestLauncherAdmin(); $emit('hideDialog')"
                >
                    Run As Admin
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'InstallFailed',

    data: () => ({
        showInstallFailed: true,
        panel: false
    }),
    methods: {
        requestLauncherAdmin: function () {
            ipcRenderer.send('request-launcher-as-admin');
        }
    },
    created: function () {
        var vue_this = this;
        this.installFailedMessage = this.$store.state.currentNotice.message;
        this.installFailedCode = this.$store.state.currentNotice.code;
        this.installFailedError = this.$store.state.currentNotice.fullerr;
    }
};
</script>