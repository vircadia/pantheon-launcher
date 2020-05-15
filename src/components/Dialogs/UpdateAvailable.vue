<!--
//  UpdateAvailable.vue
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
                Would you like to download and install it?
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    color="primary"
                    @click="cancelUpdate(); $emit('hideDialog')"
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

export default {
    name: 'UpdateAvailable',
	methods: {
        continueUpdate: function () {
            ipcRenderer.send('download-vircadia');
        },
        cancelUpdate: function () {
            // Nothing to do.
        },
     },
    data: () => ({
        showUpdateAvailable: true,
    }),
};
</script>
