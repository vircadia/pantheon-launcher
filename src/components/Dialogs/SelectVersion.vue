<!--
//  SelectVersion.vue
//
//  Created by KasenVR on 15 June 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
    <v-dialog
        width="500"
        persistent
        v-model="showSelectVersion"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
                dark
            >
                <v-icon color="green" class="mr-2">mdi-format-list-bulleted</v-icon>
                Select a version to use
            </v-card-title>
    
            <v-toolbar
                color="primary"
                dark
                flat
                class="mt-7"
            >
                <span class="mr-2">{{interfaceListLength}} Interfaces Found</span>
                <v-spacer></v-spacer>
                <v-btn
                    color="purple"
                    :tile=true
                    v-on:click.native="populateInterfaceList()"
                >
                    <span class="mr-2">Refresh List</span>
                    <v-icon>mdi-refresh</v-icon>
                </v-btn>
            </v-toolbar>
            
            <div style="max-height: 350px" class="overflow-y-auto">
                <!-- <v-subheader>
                    <pre style="width: 100%; margin-left: 0px;">{{ $store.state.currentLibraryFolder }}</pre>
                </v-subheader>

                <v-divider
                    class="mt-3"
                ></v-divider> -->

                <v-banner color="mainbg" double-line>
                    <v-icon
                        slot="icon"
                        size="36"
                    >
                        mdi-cube
                    </v-icon>
                    <p class="font-weight-thin">Currently selected</p>
                    {{ selectedInterface }}
                </v-banner>
                
                <v-list-item-group 
                    v-if="interfaceFolders.length > 0" 
                    style="background-color: red-darken-4"
                >
                    <v-list-item
                        v-for="(item, i) in interfaceFolders"
                        :key="i"
                    >
                        <v-list-item-content @click="selectInterface(item)">
                            <v-list-item-title v-html="item.name"></v-list-item-title>
                            <v-list-item-subtitle v-html="item.version"></v-list-item-subtitle>
                            
                        </v-list-item-content>
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="launchSandbox(item)">
                                    <v-icon large color="blue">mdi-cube</v-icon>
                                </v-btn>
                            </template>
                            <span>Server Sandbox</span>
                        </v-tooltip>
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="uninstallInterface(item)">
                                    <v-icon large color="red">mdi-delete-circle</v-icon>
                                </v-btn>
                            </template>
                            <span>Uninstall Vircadia</span>
                        </v-tooltip>
                    </v-list-item>
                </v-list-item-group>
                
                <v-list-item-group v-else v-model="interfaceFoldersIndex" color="primary">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>No Interfaces found.</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>

            </div>
    
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="$emit('hideDialog')"
                >
                    Done
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
const { ipcRenderer } = require('electron');
var store_p;
var vue_this;

ipcRenderer.on('interface-list', (event, arg) => {
    if (vue_this) { // Make sure this page is open!
        vue_this.interfaceFolders = [];
        store_p.commit('mutate', {
            property: 'populatedInterfaceList', 
            with: arg
        });
        var populatedList = store_p.state.populatedInterfaceList;
        populatedList.forEach(function(i){
            var appName = Object.keys(i)[0];
            var appLoc = i[appName].location;
            var appVersion = i[appName].version;
            var appObject = { "name": appName, "folder": appLoc, "version": appVersion };
            vue_this.interfaceFolders.push(appObject);
            // console.info(i);
            // console.info(Object.keys(i)[0]);
            // console.info(appLoc);
        });
    }
});

export default {
    name: 'SelectVersion',
    data: () => ({
        interfaceFolders: [],
        interfaceFoldersIndex: 0,
        selectedInterface: "No Interface Selected",
        readyToUseAgain: true,
        showSelectVersion: true
    }),
	methods: {
        selectInterface: function(selected) {
			this.$store.commit('mutate', {
				property: 'interfaceSelectionRequired', 
				with: false
			});
			this.$store.commit('mutate', {
				property: 'selectedInterface', 
				with: { name: selected.name, folder: selected.folder }
			});
            
			ipcRenderer.send('set-current-interface', selected.folder);
		},
        launchSandbox: function(selected) {
            ipcRenderer.send('launch-sandbox', selected.folder);
        },
        uninstallInterface: function(selected) {
            ipcRenderer.send('uninstall-interface', selected.folder);
        },
        populateInterfaceList: function() {
            if(this.debounce()) {
                ipcRenderer.invoke('populateInterfaceList');
            }
		},
        debounce: function() {
            if(this.readyToUseAgain) {
                console.log("Ready.");
                this.readyToUseAgain = false;
                setTimeout(function() {
                    vue_this.readyToUseAgain = true;
                }, 2000); // 2000ms before firing again.
                return true;
            } else {
                console.log("Not ready.");
                return false;
            }
        }
    },
    computed: {
        interfaceSelected() {
            return this.$store.state.selectedInterface;
        },
        interfaceListLength () {
            return this.interfaceFolders.length;
        }
    },
    watch: {
        interfaceSelected (newVal, oldVal) {
            this.selectedInterface = newVal.name;
        },
    },
    created: function() {
        vue_this = this;
        store_p = this.$store;
        
        this.populateInterfaceList();
        
        if (this.$store.state.selectedInterface) {
            this.selectedInterface = this.$store.state.selectedInterface.name;
        }
    }
};
</script>
