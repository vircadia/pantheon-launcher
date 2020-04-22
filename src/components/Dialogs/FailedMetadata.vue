<!--
//  FailedMetadata.vue
//
//  Created by KasenVR on 17 Apr 2020.
//  Copyright 2020 Vircadia and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showFailedMetadata"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                Failed to Retrieve Metadata
            </v-card-title>
    
            <v-card-text>
                {{currentNotice}}
            </v-card-text>
    
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="$emit('hideDialog')"
                >
                    Okay
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'FailedMetadata',
	methods: {
        
    },
    data: () => ({
        showFailedMetadata: true,
        currentNotice: "",
    }),
    created: function () {
        this.currentNotice = this.$store.state.currentNotice;
    }
};
</script>
