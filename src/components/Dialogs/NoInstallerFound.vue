<!--
//  NoInstallerFound.vue
//
//  Created by Kalila L. on 15 Dec 2019.
//  Copyright 2020 Project Athena and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showNoInstallerFound"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                No Installer Found
            </v-card-title>
    
            <v-card-text>
                An installer for interface was not found. Try downloading it by pressing the "Download Interface" button.
            </v-card-text>
    
            <v-divider></v-divider>
    
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="$emit('hideDialog')"
                >
                    Dismiss
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
export default {
    name: 'NoInstallerFound',

    data: () => ({
        showNoInstallerFound: true,
    }),
    created: function () {
        
    },
};
</script>