<!--
//  App.vue
//
//  Created by Kalila L. on 15 Dec 2019.
//  Copyright 2020 Project Athena and contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->

<script>
import * as Sentry from '@sentry/electron';
</script>

<template>
    <v-app>
        <v-system-bar
            dark
            :top=true
            :fixed=true
            style="top: initial !important;"
            id="topMenuBar"
        >    
            
        </v-system-bar>
        
        <v-bottom-navigation id="navBar">
            <v-btn disabled value="recent">
                <span>Recent</span>
                <v-icon>mdi-history</v-icon>
            </v-btn>

            <v-btn disabled v-on:click="toggleTab('Settings')" value="favorites">
                <span>Favorites</span>
                <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn disabled v-on:click="toggleTab('Settings')" value="nearby">
                <span>Worlds</span>
                <v-icon>mdi-map-search-outline</v-icon>
            </v-btn>

            <v-btn v-on:click="toggleTab('Settings')" value="settings">
                <span>Settings</span>
                <v-icon>mdi-settings-outline</v-icon>
            </v-btn>
        </v-bottom-navigation>
		
    <v-app-bar
        app
        dark
        :bottom=true
        :fixed=true
        style="top: initial !important;"
        id="bottomAppBar"
    >
        <div class="d-flex align-center">
            <v-img
                alt="Vircadia Logo"
                id="titleIMG"
                class="shrink mr-2"
                v-on:click="launchBrowser('https://vircadia.com/')"
                contain
                src="./assets/logo_256_256.png"
                transition="scale-transition"
                width="40"
            />
            
            <h2 id="titleURL" v-on:click="launchBrowser('https://vircadia.com/')">Vircadia</h2>

            <v-btn
                v-on:click="launchBrowser('https://github.com/kasenvr/project-athena')"
                target="_blank"
                text
                :left=true
                class="ml-3"
            >
                <span class="mr-2">Github</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </div>

        <v-spacer></v-spacer>
        
            <v-btn
                v-if="showDownloadButton"
                v-on:click.native="downloadInterface();"
                :right=true
                color="blue"
                :tile=true
                :depressed="isDownloading"
                :disabled="isSilentInstalling || disableDownloadButton"
                id="downloadButton"
            >
                <span>{{downloadText}}</span>
                <v-progress-circular
                    :size="25"
                    :width="5"
                    :rotate="90"
                    :value="downloadProgress"
                    color="red"
                    v-if="showCloudDownloadProgress"
                    class="ml-2"
                >
                </v-progress-circular>
                <v-icon class="ml-2" v-if="showCloudIcon">cloud_download</v-icon>
            </v-btn>

            <v-btn
                v-if="showUpdateButton"
                :disabled="disableUpdateButton"
                v-on:click.native="checkForUpdates()"
                :right=true
                color="blue"
                :tile=true
                id="updateButton"
            >
                <span>Check for Updates</span>
                <v-icon class="ml-2" v-if="showCloudIcon">cloud_download</v-icon>
            </v-btn>
            
            <!-- <v-tooltip top>	
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-on:click.native="installInterface()"
                        v-on="on"
                        :right=true
                        class=""
                        color="green"
                        :tile=true
                        :disabled="disableInstallIcon"
                    >
                        <span style="font-size: 12px;">Install<br/>Interface</span>
                        <v-icon class="ml-2">unarchive</v-icon>
                    </v-btn>
                </template>
                <span>Install</span>
            </v-tooltip> -->

            <div class="text-center">
            <v-menu top offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                    <v-btn
                        color="primary"
                        dark
                        :tile=true
                        v-on="on"
                    >
                    Options
                    </v-btn>
                </template>
                <div style="background: rgba(255,255,255,0.8);">
                </div>
                <v-list
                    subheader
                    two-line
                    flat
                >
                    <v-subheader>Launch Options</v-subheader>

                    <v-list-item-group
                        multiple
                        v-model="launchOptions"
                    >
                        <v-list-item>
                            <template>
                                <v-list-item-action>
                                    <v-checkbox
                                        color="primary"
                                        :true-value="allowMultipleInstances"
                                        :input-value="allowMultipleInstances"
                                        v-model="allowMultipleInstances"
                                    ></v-checkbox>
                                </v-list-item-action>

                                <v-list-item-content @click="allowMultipleInstances = !allowMultipleInstances">
                                    <v-list-item-title>Simultaneous Interfaces</v-list-item-title>
                                    <v-list-item-subtitle>Allow multiple interfaces to be run simultaneously.</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                        <v-list-item>
                            <template>
                                <v-list-item-action>
                                    <v-checkbox
                                        color="primary"
                                        :true-value="noSteamVR"
                                        :input-value="noSteamVR"
                                        v-model="noSteamVR"
                                    ></v-checkbox>
                                </v-list-item-action>

                                <v-list-item-content @click="noSteamVR = !noSteamVR">
                                    <v-list-item-title>Disable SteamVR</v-list-item-title>
                                    <v-list-item-subtitle>Disable launching and attaching SteamVR with interface.</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>

                    </v-list-item-group>
                </v-list>
            </v-menu>
            </div>

            <v-btn
                v-on:click.native="attemptLaunchInterface()"
                :disabled="disableLaunchButton"
                :right=true
                class=""
                color="rgba(133, 0, 140, 0.8)"
                :tile=true
            >
                <span class="mr-2">Launch</span>
                <v-icon>mdi-play</v-icon>
            </v-btn>

        </v-app-bar>
		
    <v-content class="" id="mainContent">
			<!-- <iframe id="mainIframe" src="https://vircadia.com/" style="width: 100%; height: 100%;"></iframe>  -->
			<transition name="fade" mode="out-in">
				<component v-bind:is="showTab"></component>
			</transition>
    </v-content>
    
    <v-content class="">
        <transition name="fade" mode="out-in">
            <component @hideDialog="shouldShowDialog = false" v-if="shouldShowDialog" v-bind:is="showDialog"></component>
        </transition>
    </v-content>
		
    </v-app>
</template>

<script>
var vue_this;
const { ipcRenderer } = require('electron');

ipcRenderer.on('download-installer-progress', (event, arg) => {
    var downloadProgress = arg.percent;
    if (downloadProgress < 1 && downloadProgress > 0) { // If downloading...
        vue_this.disableDownloadButton = false; // Enable the download button again now that it has started.
        vue_this.disableLaunchButton = true;
        vue_this.showCloudIcon = false;
        vue_this.showCloudDownloadProgress = true;
        vue_this.showDownloadButton = true;
        vue_this.showUpdateButton = false;    
        vue_this.disableInstallIcon = true;
        vue_this.isDownloading = true;
        vue_this.downloadText = "Downloading";
        vue_this.downloadProgress = downloadProgress * 100;
    } else if (downloadProgress == 1) { // When done.
        vue_this.showCloudIcon = true;
        vue_this.showCloudDownloadProgress = false;
        vue_this.disableInstallIcon = false;
        vue_this.isDownloading = false;
        vue_this.disableDownloadButton = true;
        vue_this.downloadText = "Awaiting Install";
        if (vue_this.showDialog = "CancelDownload") {
            vue_this.closeDialog();  // "Cancel Download" dialog may be open.
        }
        // vue_this.openDialog('DownloadComplete', true);
    }
    console.info("Installer Download Progress:", downloadProgress);
});

ipcRenderer.on('download-cancelled', (event) => {
    vue_this.showCloudIcon = true;
    vue_this.showCloudDownloadProgress = false;
    vue_this.disableInstallIcon = false;
    vue_this.isDownloading = false;
    vue_this.disableLaunchButton = false;
    vue_this.downloadText = "Download Interface";
})

ipcRenderer.on('download-installer-failed', (event) => {
    vue_this.showCloudIcon = true;
    vue_this.showCloudDownloadProgress = false;
    vue_this.disableInstallIcon = false;
    vue_this.isDownloading = false;
    vue_this.disableLaunchButton = false;
    vue_this.downloadText = "Download Interface";
    vue_this.openDialog('DownloadFailed', true);
});

ipcRenderer.on('state-loaded', (event, arg) => {
	console.info("STATE LOADED:", arg);
	
	if(arg.results.noSteamVR) {
		vue_this.$store.commit('mutate', {
			property: 'noSteamVR', 
			with: arg.results.noSteamVR
		});
		vue_this.noSteamVR = arg.results.noSteamVR;
	}
    if(arg.results.sentryEnabled != null) {
		vue_this.$store.commit('mutate', {
			property: 'sentryEnabled', 
			with: arg.results.sentryEnabled
		});
	}
	if(arg.results.allowMultipleInstances) {
		vue_this.$store.commit('mutate', {
			property: 'allowMultipleInstances', 
			with: arg.results.allowMultipleInstances
		});
        vue_this.allowMultipleInstances = arg.results.allowMultipleInstances;
	}
	if(arg.results.selectedInterface) {
		vue_this.$store.commit('mutate', {
			property: 'selectedInterface', 
			with: arg.results.selectedInterface
		});
        ipcRenderer.send('set-current-interface', vue_this.$store.state.selectedInterface.folder);
	}
	if(arg.results.metaverseServer) {
		vue_this.$store.commit('mutate', {
			property: 'metaverseServer', 
			with: arg.results.metaverseServer
		});
		ipcRenderer.send('set-metaverse-server', arg.results.metaverseServer);
	}
    if(arg.results.currentLibraryFolder) {
        vue_this.$store.commit('mutate', {
			property: 'currentLibraryFolder', 
			with: arg.results.currentLibraryFolder
		});
	} else {
        ipcRenderer.send('set-library-folder-default');
    }
});

ipcRenderer.on('current-library-folder', (event, arg) => {
    vue_this.$store.commit('mutate', {
        property: 'currentLibraryFolder', 
        with: arg.libraryPath
    });
});

ipcRenderer.on('need-interface-selection', (event, arg) => {
    console.info("Need interface selection, nothing programmed yet.");
});

ipcRenderer.on('interface-list-for-launch', (event, arg) => {
    if(arg[0]) {
        var appName = Object.keys(arg[0])[0];
        var appLoc = arg[0][appName].location;
        var exeLoc = appLoc + "/interface.exe";
        vue_this.launchInterface(exeLoc);
        // console.info(arg[0]);
        // console.info(Object.keys(arg[0])[0]);
        // console.info(exeLoc);
    } else {
        vue_this.openDialog('NoInterfaceFound', true);
    }
});

ipcRenderer.on('no-installer-found', (event, arg) => {
    vue_this.openDialog('NoInstallerFound', true);
});

ipcRenderer.on('interface-running', (event, arg) => {
    vue_this.openDialog('WantToClose', true);
});

ipcRenderer.on('first-time-user', (event, arg) => {
    vue_this.openDialog('FirstTimeUser', true);
});

ipcRenderer.on('failed-to-retrieve-interface-metadata', (event, arg) => {
    
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg
    });
    
    vue_this.openDialog('FailedMetadata', true);
});

ipcRenderer.on('silent-installer-running', (event, arg) => {
    vue_this.downloadText = "Installing, please wait...";
    vue_this.isSilentInstalling = true;    
    vue_this.disableDownloadButton = true;
    vue_this.disableLaunchButton = true;
    
    vue_this.showCloudIcon = false;
    vue_this.showCloudDownloadProgress = false;
    
    vue_this.showDownloadButton = true;
    vue_this.showUpdateButton = false;
});

ipcRenderer.on('silent-installer-complete', (event, arg) => {
    vue_this.downloadText = "Download Interface";
    vue_this.isSilentInstalling = false;
    vue_this.disableDownloadButton = false;
    vue_this.showDownloadButton = false;
    vue_this.showUpdateButton = true;
    vue_this.showCloudIcon = true;
    vue_this.disableLaunchButton = false;
    vue_this.openDialog('InstallComplete', true);
    
    vue_this.$store.commit('mutate', {
        property: 'interfaceSelectionRequired', 
        with: false
    });
    vue_this.$store.commit('mutate', {
        property: 'selectedInterface', 
        with: { name: arg.name, folder: arg.folder }
    });
    
    ipcRenderer.send('set-current-interface', arg.folder);
});

ipcRenderer.on('silent-installer-failed', (event, arg) => {
    vue_this.downloadText = "Download Interface";
    vue_this.isSilentInstalling = false;
    vue_this.disableLaunchButton = false;
    vue_this.disableDownloadButton = false;
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg
    });
    vue_this.openDialog('InstallFailed', true);
});

ipcRenderer.on('checked-for-updates', (event, arg) => {
    vue_this.disableUpdateButton = false;
    vue_this.disableLaunchButton = false;
    
    if (arg.checkForUpdates > 0) {
        vue_this.openDialog('UpdateAvailable', true);
    } else {
        vue_this.openDialog('NoUpdateAvailable', true);
    }
});

import HelloWorld from './components/HelloWorld';
import FavoriteWorlds from './components/FavoriteWorlds';
import Settings from './components/Settings';
// Dialogs
import CancelDownload from './components/Dialogs/CancelDownload'
import DownloadComplete from './components/Dialogs/DownloadComplete'
import DownloadFailed from './components/Dialogs/DownloadFailed'
import NoInstallerFound from './components/Dialogs/NoInstallerFound'
import NoInterfaceFound from './components/Dialogs/NoInterfaceFound'
import InstallComplete from './components/Dialogs/InstallComplete'
import InstallFailed from './components/Dialogs/InstallFailed'
import WantToClose from './components/Dialogs/WantToClose'
import UpdateAvailable from './components/Dialogs/UpdateAvailable'
import NoUpdateAvailable from './components/Dialogs/NoUpdateAvailable'
import FirstTimeUser from './components/Dialogs/FirstTimeUser'
import FailedMetadata from './components/Dialogs/FailedMetadata'

export default {
    name: 'App',
    components: {
        HelloWorld,
        FavoriteWorlds,
        Settings,
        // Dialogs
        CancelDownload,
        DownloadComplete,
        DownloadFailed,
        NoInstallerFound,
        NoInterfaceFound,
        InstallComplete,
        InstallFailed,
        WantToClose,
        UpdateAvailable,
        NoUpdateAvailable,
        FirstTimeUser,
        FailedMetadata
    },
    methods: {
        toggleTab: function(tab) {
            if(this.showTab == tab) {
                this.showTab = "";
            } else {
                this.showTab = tab;
            }
        },
        openDialog: function(which, shouldShow) {
            // We want to reset the element first.
            this.showDialog = "";
            this.shouldShowDialog = false;
            // console.info(this.showDialog, this.shouldShowDialog);
            
            this.showDialog = which;
            this.shouldShowDialog = shouldShow;
            // console.info(this.showDialog, this.shouldShowDialog);
        },
        closeDialog: function () {
            this.showDialog = "";
            this.shouldShowDialog = false;
        },
		attemptLaunchInterface: function() {
			// var exeLoc = ipcRenderer.sendSync('get-vircadia-location'); // todo: check if that location exists first when using that, we need to default to using folder path + /interface.exe otherwise.
            var exeLoc;
            if (this.$store.state.selectedInterface) {
                exeLoc = this.$store.state.selectedInterface.folder + "interface.exe";
            }
            console.info("Attempting to launch interface, found exeLoc:",exeLoc);
            if(exeLoc) {
                this.launchInterface(exeLoc);
            } else {
                // this.selectInterfaceExe();
                // No, no more... we'll just default to selecting the first interface we find. You can select on your own time. UX baby.
                ipcRenderer.invoke('get-interface-list-for-launch');
            }
		},
        launchInterface: function(exeLoc) {
            ipcRenderer.send('launch-interface', { "exec": exeLoc, "steamVR": this.noSteamVR, "allowMultipleInstances": this.allowMultipleInstances });
        },
		launchBrowser: function(url) {
			const { shell } = require('electron');
			shell.openExternal(url);
		},
		downloadInterface: function() {
            this.disableDownloadButton = true;
            this.disableLaunchButton = true;
            
            // This function also auto-installs Interface.
            if (!this.isDownloading) {
                this.isDownloading = true;
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('download-vircadia');
            } else {
                vue_this.openDialog('CancelDownload', true);
            }
		},
        installInterface: function() {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('install-vircadia');
        },
        selectInterfaceExe: function() {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('set-vircadia-location');
        },
        checkForUpdates: function() {
            this.disableUpdateButton = true;
            this.disableLaunchButton = true;
            
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('check-for-updates');            
        }
	},
    created: function () {
        const { ipcRenderer } = require('electron');
        vue_this = this;
        
        if (this.$store.state.sentryEnabled === true) {
            Sentry.init({dsn: 'https://def94db0cce14e2180e054407e551220@sentry.vircadia.dev/3'});
        }

        window.onbeforeunload = (e) => {
            e.returnValue = false;
            ipcRenderer.send('request-close');
        }

        ipcRenderer.send('load-state');
        ipcRenderer.send('get-library-folder');
        },
        computed: {
            interfaceSelected() {
                return this.$store.state.selectedInterface;
            }
        },
	watch: {
        noSteamVR: function (newValue, oldValue) {
            if(newValue != oldValue) {
                this.$store.commit('mutate', {
                    property: 'noSteamVR', 
                    with: newValue
                });
            }
        },
        allowMultipleInstances: function (newValue, oldValue) {
            if(newValue != oldValue) {
                this.$store.commit('mutate', {
                    property: 'allowMultipleInstances', 
                    with: newValue
                });
            }
        },
        interfaceSelected (newVal, oldVal) {
            console.info("Interface selected:", newVal);
            if (newVal) {
                this.showDownloadButton = false;
                this.showUpdateButton = true;
            }
        }
    },
    data: () => ({
        showTab: '',
        // Dialog Data
        showDialog: '',
        shouldShowDialog: false,
        // Launch Data
        launchOptions: [],
        noSteamVR: false,
        allowMultipleInstances: false,
        disableLaunchButton: false,
        // Download & Install Data
        downloadProgress: 0,
        isDownloading: false,
        isSilentInstalling: false,
        downloadText: "Download Interface",
        showCloudIcon: true,
        showCloudDownloadProgress: false,
        disableInstallIcon: false,
        disableDownloadButton: false,
        disableUpdateButton: false,
        showDownloadButton: true,
        showUpdateButton: false,
    }),
};
</script>
