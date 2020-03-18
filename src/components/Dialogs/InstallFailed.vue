<!--
//  InstallFailed.vue
//
//  Created by Kalila L. on 22 Feb 2020.
//  Copyright 2020 Project Athena and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showInstallFailed"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                Installation Failed
            </v-card-title>
    
            <v-card-text>
                {{installFailedMessage}}
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
    name: 'InstallFailed',

    data: () => ({
        showInstallFailed: true,
        installFailedMessage: ""
    }),
    created: function () {
        var vue_this = this;
        this.installFailedMessage = this.$store.state.currentError;
    }
};
</script>