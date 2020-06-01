<!--
//  ReportAnIssue.vue
//
//  Created by KasenVR on 19 May 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showReportAnIssue"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-comment-question</v-icon>
                Report an Issue
            </v-card-title>
    
            <v-card-text>
                Which are you reporting an issue for?
            </v-card-text>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    color="red"
                    @click="$emit('hideDialog')"
                >
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="reportAnIssue('https://github.com/kasenvr/pantheon-launcher/issues'); $emit('hideDialog')"
                >
                    Launcher
                </v-btn>
                <v-btn
                    color="primary"
                    @click="reportAnIssue('https://github.com/kasenvr/project-athena/issues'); $emit('hideDialog')"
                >
                    Interface
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');

export default {
    name: 'ReportAnIssue',
    methods: {
        reportAnIssue: function (url) {
            const { shell } = require('electron');
            shell.openExternal(url);
        }
    },
    data: () => ({
        showReportAnIssue: true,
    }),
    created: function () {}
};
</script>
