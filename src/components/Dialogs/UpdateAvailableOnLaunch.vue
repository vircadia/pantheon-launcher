<!--
//  UpdateAvailableOnLaunch.vue
//
//  Created by Kalila L. on Jan 11 2021.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showUpdateAvailable"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-comment-question</v-icon>
                Update Available
            </v-card-title>
    
            <v-card-text>
                An update is available. <br />
                <pre>Latest Version: {{ this.$store.state.currentNotice }}</pre>
                Would you like to download and install it?
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    color="primary"
                    @click="rejectUpdate(); $emit('hideDialog')"
                >
                    No
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="continueUpdate(); $emit('hideDialog')"
                >
                    Yes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');
import { EventBus } from '../../plugins/event-bus.js';

export default {
    name: 'UpdateAvailableOnLaunch',
	methods: {
        continueUpdate: function () {
            ipcRenderer.send('download-vircadia');
        },
        rejectUpdate: function () {
            EventBus.$emit('reject-update-continue-launch');
        }
     },
    data: () => ({
        showUpdateAvailable: true
    }),
};
</script>
