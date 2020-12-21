<!--
//  WantToClose.vue
//
//  Created by Kalila L. on 19 Mar 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showWantToClose"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-comment-question</v-icon>
                Interface Instance Detected
            </v-card-title>
    
            <v-card-text>
                Are you sure you want to quit? <br />
                Closing the launcher may close your Interface.
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    color="primary"
                    @click="cancelClose(); $emit('hideDialog')"
                >
                    No
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="red"
                    @click="continueClose(); $emit('hideDialog')"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'WantToClose',
	methods: {
        continueClose: function () {
            ipcRenderer.send('close-launcher');
        },
        cancelClose: function () {
            // Nothing to do.
        },
     },
    data: () => ({
        showWantToClose: true,
    }),
};
</script>
