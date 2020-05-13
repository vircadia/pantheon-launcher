<!--
//  CheckForUpdatesFailed.vue
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
        v-model="showCheckForUpdatesFailed"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                Cannot Update
            </v-card-title>
    
            <v-card-text>
                {{CheckForUpdatesFailedMessage}}<br />
                <v-expansion-panels
                    v-model="panel"
                    v-if="this.CheckForUpdatesFailedCode"
                >
                    <v-expansion-panel>
                        <v-expansion-panel-header>Error Information</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            Error code <pre>{{CheckForUpdatesFailedCode}}</pre> <br />
                            The full error is shown below: <br />
                            <pre>{{CheckForUpdatesFailedError}}</pre>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
    name: 'CheckForUpdatesFailed',

    data: () => ({
        showCheckForUpdatesFailed: true,
        panel: false,
    }),
    created: function () {
        var vue_this = this;
        this.CheckForUpdatesFailedMessage = this.$store.state.currentNotice.message;
        this.CheckForUpdatesFailedCode = this.$store.state.currentNotice.code;
        this.CheckForUpdatesFailedError = this.$store.state.currentNotice.fullerr;
    }
};
</script>