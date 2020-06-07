<!--
//  Settings.vue
//
//  Created by Kalila L. on 15 Dec 2019.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->
<template>
	<v-app>
		<v-content class="mainContentContainer">
			<v-container
				class="pt-8"
				fluid
			>
				<v-row
					align="center"
					justify="center"
				>
					<v-card class="elevation-12" style="width: 80%;">
						<v-toolbar
							color="primary"
							dark
							flat
						>
							<v-toolbar-title>Settings</v-toolbar-title>
							<v-spacer />	
						</v-toolbar>
                        
                        <h3 class="mx-7 mt-5">Style</h3>
                        
                        <v-switch v-model="$vuetify.theme.dark" class="mx-7" label="Use dark mode."></v-switch>
                        
                        <h3 class="mx-7 mt-5">Error Reporting</h3>
                        
                        <v-checkbox
                            class="mx-7"
                            color="primary"
                            v-model="sentryEnabled"
                            :disabled="true"
                            label="Error Reporting for the launcher (Currently Disabled)"
                        ></v-checkbox>
                        
                        <h3 class="mx-7 mt-5">Installation Path</h3>
                        
                        <p class="mx-7 mt-3 bodyText">The installs folder is the directory that your Vircadia installations are located in.<br />
                            The launcher will detect the installations.
                        </p>
                        
						<v-layout row pr-5 pt-5 pl-12>
							<v-flex md6 style="text-align: center;">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            v-on:click.native="setLibrary()"
                                            :right=true
                                            class=""
                                            :tile=true
                                            v-on="on"
                                        >
                                            <span class="mr-2">Set Installs Folder</span>
                                            <v-icon>folder</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ currentFolder }}</span>
                                </v-tooltip>
							</v-flex>
                            <v-flex md6 style="text-align: center;">
                                <v-btn
                                    v-on:click.native="setLibraryDefault()"
                                    :right=true
                                    class=""
                                    :tile=true
                                >
                                    <span class="mr-2">Default</span>
                                    <v-icon>folder</v-icon>
                                </v-btn>
                            </v-flex>
						</v-layout> 
                        
                        <h3 class="mx-7 mt-5">Current Installation Path</h3>
                        
                        <pre style="width: 100%; margin-left: 0px;">{{ currentFolder }}</pre>
						
                        <v-toolbar
                            color="primary"
                            dark
                            flat
                            class="mt-7"
                        >
                            <v-toolbar-title>Interface Settings</v-toolbar-title>
                            <v-spacer />
                            <span class="mr-2">{{interfaceListLength}} Interfaces Found</span>
                            <v-btn
                                color="purple"
                                :tile=true
                                v-on:click.native="populateInterfaceList()"
                            >
                                <span class="mr-2">Refresh List</span>
                                <v-icon>mdi-refresh</v-icon>
                            </v-btn>
                        </v-toolbar>
                        
						<h2 class="ml-3 mt-3">Interface List</h2>
                        
                        <v-list style="max-height: 300px" class="overflow-y-auto">
                            <v-subheader>
                                Select an Interface to use. Scroll down for more.<br/>
                            </v-subheader>
                            <v-banner double-line>
                                <v-icon
                                    slot="icon"
                                    size="36"
                                >
                                    mdi-cube
                                </v-icon>
                                <p class="font-weight-thin">Currently selected:</p>
                                {{ selectedInterface }}
                            </v-banner>
                            <v-divider
                                class="mx-3"
                            ></v-divider>
                            
                            <v-list-item-group v-if="interfaceFolders.length > 0" color="primary">
                                <v-list-item
                                    v-for="(item, i) in interfaceFolders"
                                    :key="i"
                                >
                                    <v-list-item-content @click="selectInterface(item)">
                                        <v-list-item-title v-html="item.name"></v-list-item-title>
                                        <v-list-item-subtitle v-html="item.version"></v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon @click="uninstallInterface(item)">
                                            <v-icon large color="red">mdi-delete-circle</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-item-group>
                            
                            <v-list-item-group v-else v-model="interfaceFoldersIndex" color="primary">
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>No Interfaces found.</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>

                        </v-list>
                        
                        <v-divider
                            class="mx-3"
                        ></v-divider>
						
                        <h3 v-show="false" class="mx-7 mt-5">Settings for {{ selectedInterface }}</h3>
                        
                        <v-layout v-show="false" row pr-5 pt-5 pl-12>
                            <v-flex md6>
                                <v-btn 
                                    v-on:click.native="selectInterfaceExe()"
                                    :right=true
                                    class=""
                                    :tile=true
                                >
                                    <span class="mr-2">Locate Interface .exe</span>
                                    <v-icon>settings_applications</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
						
                        <v-toolbar
                            color="primary"
                            dark
                            flat
                            class="mt-7"
                        >
                            <v-toolbar-title>Metaverse Settings</v-toolbar-title>

                        </v-toolbar>
						
						<v-card-text>
							<v-form>
								<!-- <v-text-field
									label="Username"
									name="username"
									prepend-icon="person"
									type="text"
									disabled
								/>

								<v-text-field
									id="password"
									label="Password"
									name="password"
									prepend-icon="lock"
									type="password"
									disabled
								/> -->
								
								<v-text-field
									label="Metaverse Server"
									name="metaverse"
									prepend-icon="mdi-earth"
									type="text"
									v-model="metaverseServer"
                                    disabled
								/>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-spacer />
							<v-btn disabled @click="setMetaverseServer()" color="accent">Save Metaverse Settings</v-btn>
						</v-card-actions>
                        
                        <v-toolbar
                            color="purple"
                            dark
                            flat
                            class="mt-7"
                        >
                            <v-toolbar-title>Developer</v-toolbar-title>
                        </v-toolbar>
                        
                        <v-card-text>
                            <v-text-field
                                label="Custom Launch Parameters, comma separated, no spaces in-between"
                                name="customLaunchParameters"
                                prepend-icon="mdi-tools"
                                type="text"
                                v-model="customLaunchParametersStore"
                            />
                        </v-card-text>
                        
					</v-card>
				</v-row>
			</v-container>
		</v-content>
		<v-dialog
			width="500"
			v-model="showRequireInterface"
		>
			<v-card>
				<v-card-title
					class="headline"
					primary-title
					dark
				>
					Notice
				</v-card-title>
		
				<v-card-text>
					Please select an interface by clicking "Select Interface". If the list is empty, then click the download button in the bottom right.
				</v-card-text>
		
				<v-divider></v-divider>
		
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						text
						@click="showRequireInterface = false"
					>
						Okay
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-app>
</template>

<script>
var store_p;
var vue_this;

const { ipcRenderer } = require('electron');
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

ipcRenderer.on('interface-selection-required', (event, arg) => {
	console.info(arg);
});

export default {	
	name: 'Settings',
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
        uninstallInterface: function(selected) {
            ipcRenderer.send('uninstall-interface', selected.folder);
        },
		selectInterfaceExe: function() {
			if(this.$store.state.interfaceSelectionRequired) {
				this.showRequireInterface = true;
			} else {
				ipcRenderer.send('set-vircadia-location');
			}
		},
		setLibrary: function() {
			ipcRenderer.send('set-library-folder');
		},
        setLibraryDefault: function() {
            ipcRenderer.send('set-library-folder-default');
        },
        getLibraryFolder: function() {
            ipcRenderer.send('get-library-folder');
        },
		populateInterfaceList: function() {
            if(this.debounce()) {
                ipcRenderer.invoke('populateInterfaceList');
            }
		},
		setMetaverseServer: function() {
			this.$store.commit('mutate', {
				property: 'metaverseServer', 
				with: this.metaverseServer
			});
			ipcRenderer.send('set-metaverse-server', this.$store.state.metaverseServer);
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
	data: () => ({
		show: false,
		showRequireInterface: false,
		interfaceFolders: [],
        interfaceFoldersIndex: 0,
        currentFolder: "",
		metaverseServer: "https://metaverse.highfidelity.com", // Default metaverse API URL
        readyToUseAgain: true,
        selectedInterface: "[No Interface Selected]",
        sentryEnabled: false,
        inactive: false,
	}),
    computed: {
        customLaunchParametersStore: {
            get() {
                return this.$store.state.customLaunchParameters;
            },
            set(value) {
                this.$store.commit('mutate', {
                    property: 'customLaunchParameters', 
                    with: value
                });
            },
        },
        librarySelected () {
            return this.$store.state.currentLibraryFolder;
        },
        interfaceSelected () {
            return this.$store.state.selectedInterface;
        },
        sentryEnabledToggled () {
            return this.sentryEnabled;
        },
        darkModeToggled () {
            return this.$vuetify.theme.dark;
        },
        interfaceListLength () {
            return this.interfaceFolders.length;
        }
    },
    watch: {
        librarySelected (newVal, oldVal) {
            this.currentFolder = newVal;
        },
        interfaceSelected (newVal, oldVal) {
            this.selectedInterface = newVal.name;
            console.info("Set selected interface to...", this.selectedInterface, "from...", newVal.name);
        },
        sentryEnabledToggled () {
            this.$store.commit('mutate', {
                property: 'sentryEnabled', 
                with: this.sentryEnabled
            });
        },
        darkModeToggled () {
            this.$store.commit('mutate', {
                property: 'darkMode', 
                with: this.$vuetify.theme.dark
            });
        }
    },
	created: function () {
        store_p = this.$store;
        vue_this = this;
        const { ipcRenderer } = require('electron');
        
		this.populateInterfaceList();
        
		if (this.$store.state.metaverseServer) {
			this.metaverseServer = this.$store.state.metaverseServer;
		}
        
        this.setMetaverseServer();
        
        if (this.$store.state.selectedInterface) {
            this.selectedInterface = this.$store.state.selectedInterface.name;
        }
        
        if (this.$store.state.sentryEnabled !== null) {
            this.sentryEnabled = this.$store.state.sentryEnabled;
        }
        
        if (this.$store.state.currentLibraryFolder) {
            this.currentFolder = this.$store.state.currentLibraryFolder;
        } else {
            this.setLibraryDefault();
        }
	}
};
</script>
