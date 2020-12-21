<!--
//  LaunchFailedInterfaceRunning.vue
//
//  Created by Kalila L. on 15 May 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showLaunchFailedInterfaceRunning"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-message-alert</v-icon>
                Interface Instance Detected
            </v-card-title>
    
            <v-card-text>
                Interface appears to be already running. <br />
                Check "Allow Multiple Instances" in the launch Options to open another instance.
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
                >
                    Dismiss
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'LaunchFailedInterfaceRunning',
	methods: {
    },
    data: () => ({
        showLaunchFailedInterfaceRunning: true,
    }),
};
</script>
