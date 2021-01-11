<!--
//  Metaverse.vue
//
//  Created by Kalila L. on Dec 11 2021.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->

<template>
    <v-app id="">
        <v-main class="mainContentContainer">
            <v-container
                id=""
                class="fill-container"
                fluid
            >
                <iframe id="mainIframe" :src="getDashboardSource" style="width: 100%; height: 100%;"></iframe> 
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {	
	name: 'Metaverse',
    methods: { },
    data: () => ({ 
        dashboardSource: 'https://dashboard.vircadia.com/'
    }),
    computed: {
        getDashboardSource () {
            if (this.$store.state.metaverseServer !== '') {
                return this.dashboardSource + '?metaverse=' + this.$store.state.metaverseServer;
            } else {
                return this.dashboardSource;
            }
        }
    },
    watch: { },
    created: function () {
        
    }
};
</script>
