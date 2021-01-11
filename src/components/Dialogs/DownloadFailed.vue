<!--
//  DownloadFailed.vue
//
//  Created by David Rowe on 14 Feb 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showDownloadFailed"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                Download Failed
            </v-card-title>

            <v-card-text>
                {{downloadFailedMessage}}<br />
                <v-expansion-panels
                    v-model="panel"
                    v-if="this.downloadFailedCode && this.downloadFailedCode !== -1"
                >
                    <v-expansion-panel>
                        <v-expansion-panel-header>Error Information</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            Error code <pre>{{downloadFailedCode}}</pre><br />
                            The full error is shown below:<br />
                            <pre>{{downloadFailedError}}</pre>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer
                    v-if="!this.downloadFailedCode"
                ></v-spacer>
                <v-btn
                    color="red"
                    @click="$emit('hideDialog')"
                >
                    Dismiss
                </v-btn>
                <v-spacer
                    v-if="this.downloadFailedCode === -1"
                ></v-spacer>
                <v-btn
                    color="primary"
                    v-if="this.downloadFailedCode === -1"
                    @click="requestLauncherAdmin(); $emit('hideDialog')"
                >
                    Run As Admin
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from '../../plugins/event-bus.js';

export default {
    name: 'DownloadFailed',

    data: () => ({
        showDownloadFailed: true,
        panel: false
    }),
    methods: {
        requestLauncherAdmin: function () {
            this.$store.commit('mutate', {
                property: 'downloadOnNextLaunch', 
                with: true
            });
            EventBus.$emit('request-launcher-as-admin');
        }
    },
    created: function () {
        this.downloadFailedMessage = this.$store.state.currentNotice.message;
        this.downloadFailedCode = this.$store.state.currentNotice.code;
        this.downloadFailedError = this.$store.state.currentNotice.fullerr;
    }
};
</script>