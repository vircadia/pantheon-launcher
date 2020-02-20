<!--
//  NoInterfaceFound.vue
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
        v-model="showNoInterfaceFound"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="red" class="mr-2">mdi-message-alert</v-icon>
                No Interface Found
            </v-card-title>
    
            <v-card-text>
                No Interface was found. Try downloading and installing it.
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
    name: 'NoInterfaceFound',

    data: () => ({
        showNoInterfaceFound: true,
    }),
    created: function () {

    },
};
</script>