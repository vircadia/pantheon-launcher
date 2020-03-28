<!--
//  NoUpdateAvailable.vue
//
//  Created by KasenVR on 28 Mar 2020.
//  Copyright 2020 Vircadia and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showNoUpdateAvailable"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-comment-question</v-icon>
                No Update Available
            </v-card-title>
    
            <v-card-text>
                There is currently no update available. Would you like to reinstall your Interface?
            </v-card-text>
    
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="reinstallInterface(); $emit('hideDialog')"
                >
                    Reinstall
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="doNothing(); $emit('hideDialog')"
                >
                    No
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'NoUpdateAvailable',
	methods: {
        reinstallInterface: function() {
            ipcRenderer.send('download-vircadia');
        },
        doNothing: function () {
            // Nothing to do.
        }
     },
    data: () => ({
        showNoUpdateAvailable: true,
    }),
};
</script>
