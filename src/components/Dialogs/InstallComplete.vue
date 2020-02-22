<!--
//  InstallComplete.vue
//
//  Created by Kalila L. on 19 Feb 2020.
//  Copyright 2020 Project Athena and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showInstallComplete"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="success" class="mr-2">mdi-check</v-icon>
                Installation Complete
            </v-card-title>
    
            <v-card-text>
                The latest version of Interface is done installing! You can now launch it.
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
    name: 'showInstallComplete',

    data: () => ({
        showInstallComplete: true,
    }),
};
</script>