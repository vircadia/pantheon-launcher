<!--
//  News.vue
//
//  Created by Kalila L. on 11 May 2020.
//  Copyright 2020 Vircadia and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-app id="">
        <v-content class="mainContentContainer">
            <v-container
                id=""
                class="fill-container"
                fluid
            >
                <iframe id="mainIframe" src="https://vircadia.com/launcher-news/" style="width: 100%; height: 100%;"></iframe> 
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
var store_p;
var vue_this;

const { ipcRenderer } = require('electron');

export default {	
	name: 'News',
	methods: {
	},
	data: () => ({
	}),
    computed: {
    },
    watch: {
    },
	created: function () {
        store_p = this.$store;
        vue_this = this;
        const { ipcRenderer } = require('electron');
	}
};
</script>
