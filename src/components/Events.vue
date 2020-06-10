<!--
//  Events.vue
//
//  Created by Kalila L. on 10 Jun 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-app id="">
        <v-content class="mainContentContainer" id="eventsContainer">
            <v-container
                id=""
                class="fill-container"
                fluid
            >
                <v-data-iterator
                    :items="events"
                    hide-default-footer
                >
					<template v-slot:header>
						<v-toolbar
                            color="primary"
                            dark
                            flat
                            class="mb-2"
						>
						<v-toolbar-title>Featured Events</v-toolbar-title>
						</v-toolbar>
					</template>

                    <template v-slot:default="props">
                        <v-row>
                            <v-col
                                v-for="item in props.items"
                                :key="item.name"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="3"
                            >

                                <v-card class="world-cards" width="230">
                                    <v-img
                                        :src="item.img"
                                        height="200px"
                                    ></v-img>

                                    <v-card-title>
                                        {{ item.name }}
                                    </v-card-title>

                                    <v-card-actions>

                                        <v-spacer></v-spacer>

                                        <v-btn color="purple" text v-on:click="openURL(item.url)">
                                            Explore
                                        </v-btn>

                                    </v-card-actions>

                                </v-card>

                            </v-col>
                        </v-row>
                    </template>

				</v-data-iterator>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

var vue_this;

require('electron').ipcRenderer.on('events-list', (event, message) => {
    console.info("Before:", vue_this.events);
    vue_this.events = message.eventsList;
    console.info("After:", vue_this.events);
})

export default {
    name: 'Events',
    methods: {
        openURL: function(url) {
            const { shell } = require('electron');
            shell.openExternal(url);
        },
    },
    created: function () { 
        vue_this = this;
        const { ipcRenderer } = require('electron');
        
        ipcRenderer.send('check-for-events');
    },
    data: () => ({
        // Data like this is a default, it will be replaced once a function replaces it.
        events: [
            {
                name: 'The-Spot',
                url: 'hifi://the-spot.projectathena.dev',
                img: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
            },
            {
                name: 'Franny',
                url: 'hifi://franny.projectathena.dev',
                img: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
            },
        ]
    }),
};
</script>
