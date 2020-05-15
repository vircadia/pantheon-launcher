<!--
//  FirstTimeUser.vue
//
//  Created by KasenVR on 13 April 2020.
//  Copyright 2020 Vircadia and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showFirstTimeUser"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-emoticon-excited-outline</v-icon>
                Are you new?
            </v-card-title>
    
            <v-card-text>
                Hello there! If you're new to Vircadia, you'll probably want to get the Interface.
                The Interface is what you use to navigate and enjoy the virtual worlds in desktop or VR!            
            </v-card-text>
    
            <v-divider></v-divider>
            
            <v-card-actions>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
                >
                    Close
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    @click="downloadInterface(); $emit('hideDialog')"
                >
                    Download
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'FirstTimeUser',
	methods: {
        downloadInterface: function () {
            ipcRenderer.send('download-vircadia');
        },
     },
    data: () => ({
        showFirstTimeUser: true,
    }),
};
</script>
