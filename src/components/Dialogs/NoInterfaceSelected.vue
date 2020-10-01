<!--
//  NoInterfaceSelected.vue
//
//  Created by Kalila L. on 15 Dec 2019.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showNoInterfaceSelected"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                No Interface Selected
            </v-card-title>
    
            <v-card-text>
                Please select an Interface to use from the "Versions" menu, or download it now.
            </v-card-text>
    
            <v-divider></v-divider>
            
            <v-card-actions>
                <v-btn
                    color="success"
                    @click="downloadInterface(); $emit('hideDialog')"
                >
                    Download
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
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
    name: 'NoInterfaceSelected',

    data: () => ({
        showNoInterfaceSelected: true,
    }),
    methods: {
        downloadInterface: function () {
            ipcRenderer.send('download-vircadia');
        }
    },
    created: function () {

    },
};
</script>