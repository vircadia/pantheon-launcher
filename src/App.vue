<!--
//  App.vue
//
//  Created by Kalila L. on 15 Dec 2019.
//  Copyright 2020 Vircadia contributors.
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
            color="mainbg"
            :top=true
            :fixed=true
            style="top: initial !important;"
            id="topMenuBar"
        >    
            <span v-if="interfaceSelected != null">Current interface version: <b>{{ interfaceSelected.name }}</b></span>
            <span v-else>No selected interface.</span>
        </v-system-bar>
        
        <v-bottom-navigation id="navBar">
            <v-btn-toggle dense tile borderless v-model="showTab">
                <v-btn disabled value="Recent">
                    <span>Recent</span>
                    <v-icon>mdi-history</v-icon>
                </v-btn>

                <v-btn disabled value="Favorites">
                    <span>Favorites</span>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>

                <v-btn disabled value="Nearby">
                    <span>Worlds</span>
                    <v-icon>mdi-map-search-outline</v-icon>
                </v-btn>
                
                <v-btn disabled value="News">
                    <span>News</span>
                    <v-icon>mdi-newspaper-variant</v-icon>
                </v-btn>
                
                <v-btn value="Events" :disabled="disableEventsTab">
                    <span>Events</span>
                    <v-icon>mdi-calendar-star</v-icon>
                </v-btn>
                
                <v-btn value="Settings">
                    <span>Settings</span>
                    <v-icon>mdi-cog-outline</v-icon>
                </v-btn>
                
            </v-btn-toggle>
        </v-bottom-navigation>
        
    <v-snackbar
        v-model="interfaceBusyLaunching"
        app
        color="colors.grey.darken4"
        :timeout="interfaceBusyLaunchingTimeout"
    >
        Interface is starting.
        <v-btn
            color="white"
            text
            @click="interfaceBusyLaunching = false; disableLaunchButton = false;"
        >
            Close
        </v-btn>
    </v-snackbar>
		
    <v-app-bar
        app
        dark
        :bottom=true
        :fixed=true
        style="top: initial !important;"
        id="bottomAppBar"
        color="mainbg"
    >
        <div class="d-flex align-center">
            <v-hover
                v-model="titleHover"
            >
                <v-img
                    alt="Vircadia Logo"
                    id="titleIMG"
                    class="shrink mr-2"
                    v-on:click="openURL('https://vircadia.com/')"
                    contain
                    src="./assets/logo_256_256.png"
                    transition="scale-transition"
                    width="40"
                />
            </v-hover>
            
            <v-slide-x-transition
                :hide-on-leave=true
            >
                <h2 class="titleURL" v-show="!titleHover" v-on:click="openURL('https://vircadia.com/')">Alpha</h2>
            </v-slide-x-transition>
            <v-slide-x-reverse-transition
                :hide-on-leave=true
            >
                <h2 class="titleURL alternateTitle" v-show="titleHover" v-on:click="openURL('https://vircadia.com/')">Vircadia</h2>
            </v-slide-x-reverse-transition>

            <v-btn
                v-on:click="openDialog('ReportAnIssue', true)"
                target="_blank"
                text
                absolute
                style="margin-left: 140px;"
            >
                <span class="mr-2">Report an issue</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </div>

        <v-spacer></v-spacer>
        
            <v-btn
                v-if="showDownloadButton"
                v-on:click.native="downloadInterface();"
                :right=true
                color="primary"
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
                <v-progress-circular
                    :size="25"
                    :width="5"
                    indeterminate
                    color="purple"
                    v-if="isSilentInstalling"
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
                color="primary"
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
            
            <div class="text-center mx-2">
                <v-btn
                    color="primary"
                    dark
                    :tile=true
                    @click="openDialog('SelectVersion', true)"
                >
                    Versions
                </v-btn>
            </div>

            <div class="text-center mr-2">
                <v-btn
                    color="primary"
                    dark
                    :tile=true
                    @click="openDialog('LaunchOptions', true)"
                >
                    Options
                </v-btn>
            </div>

            <v-btn
                v-on:click.native="attemptLaunchInterface()"
                :disabled="disableLaunchButton"
                :right=true
                class=""
                color="purple darken-3"
                :tile=true
            >
                <span class="mr-2">
                    Launch
                    <v-progress-linear
                        v-show="interfaceBusyLaunching"
                        indeterminate
                        color="green"
                    ></v-progress-linear>
                </span>
                <v-icon>mdi-play</v-icon>
            </v-btn>

        </v-app-bar>
	
    <div id="background">
        <v-main class="" id="mainContent">
            <transition name="fade" mode="out-in">
                <component v-bind:is="showTab" id=""></component>
            </transition>
            <pre id="development-output" v-if="isDevelopment">
            
            </pre>
        </v-main>
    </div>
    
    <v-main id="dialogContent">
        <transition name="fade" mode="out-in">
            <component @hideDialog="shouldShowDialog = false" v-if="shouldShowDialog" v-bind:is="showDialog" @open-url="openURL"></component>
        </transition>
    </v-main>
		
    </v-app>
</template>

<script>
var vue_this;
const { ipcRenderer } = require('electron');
import { EventBus } from './plugins/event-bus.js';

EventBus.$on('open-url', url => {
    vue_this.openURL(url);
});

EventBus.$on('open-interface-url', url => {
    vue_this.openInterfaceURL(url);
});

EventBus.$on('no-events-found', data => {
    // FIXME: We want to pull from the calendar eventually, interim would be loading a custom web page for the GCal just like the News tab.
    // vue_this.defaultTab = "News";
    // vue_this.showTab = "News";
    // vue_this.disableEventsTab = true;
});

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
            vue_this.closeDialog(); // "Cancel Download" dialog may be open.
        }
        // vue_this.openDialog('DownloadComplete', true);
    }
    console.info("Installer Download Progress:", downloadProgress);
});

ipcRenderer.on('download-cancelled', (event) => {
    vue_this.showCloudDownloadProgress = false;
    if (vue_this.store.state.selectedInterface == null || "No Interface Selected") {
        vue_this.resetDownloadButton();
    } else {
        vue_this.resetUpdateButton();
    }
})

ipcRenderer.on('download-installer-failed', (event, arg) => {
    vue_this.showCloudDownloadProgress = false;
    vue_this.resetDownloadButton();
    
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg
    });
    
    vue_this.openDialog('DownloadFailed', true);
});

ipcRenderer.on('state-loaded', (event, arg) => {
	console.info("STATE LOADED:", arg);
	
    if (arg.results.noSteamVR) {
        vue_this.$store.commit('mutate', {
            property: 'noSteamVR', 
            with: arg.results.noSteamVR
        });
    }
    
    if (arg.results.noOculus) {
        vue_this.$store.commit('mutate', {
            property: 'noOculus', 
            with: arg.results.noOculus
        });
    }
    
    if (arg.results.customLaunchParameters) {
        vue_this.$store.commit('mutate', {
            property: 'customLaunchParameters', 
            with: arg.results.customLaunchParameters
        });
    }
    
    if (arg.results.sentryEnabled !== null) {
        vue_this.$store.commit('mutate', {
            property: 'sentryEnabled', 
            with: arg.results.sentryEnabled
        });
    }
    
    if (arg.results.darkMode !== null) {
        vue_this.$store.commit('mutate', {
            property: 'darkMode', 
            with: arg.results.darkMode
        });
        vue_this.$vuetify.theme.dark = arg.results.darkMode;
    }
    
    if (arg.results.launchAsChild) {
        vue_this.$store.commit('mutate', {
            property: 'launchAsChild', 
            with: arg.results.launchAsChild
        });
    }
    
    if (arg.results.allowMultipleInstances) {
        vue_this.$store.commit('mutate', {
            property: 'allowMultipleInstances', 
            with: arg.results.allowMultipleInstances
        });
    }
    
    if (arg.results.autoRestartInterface) {
        vue_this.$store.commit('mutate', {
            property: 'autoRestartInterface', 
            with: arg.results.autoRestartInterface
        });
    }
    
    if (arg.results.dontPromptForLogin) {
        vue_this.$store.commit('mutate', {
            property: 'dontPromptForLogin', 
            with: arg.results.dontPromptForLogin
        });
    }
    
	if (arg.results.selectedInterface) {
		vue_this.$store.commit('mutate', {
			property: 'selectedInterface', 
			with: arg.results.selectedInterface
		});
        ipcRenderer.send('set-current-interface', vue_this.$store.state.selectedInterface.folder);
	}
    
	if (arg.results.metaverseServer) {
		vue_this.$store.commit('mutate', {
			property: 'metaverseServer', 
			with: arg.results.metaverseServer
		});
		ipcRenderer.send('set-metaverse-server', arg.results.metaverseServer);
	}
    
    if (arg.results.currentLibraryFolder) {
        vue_this.$store.commit('mutate', {
			property: 'currentLibraryFolder', 
			with: arg.results.currentLibraryFolder
		});
	} else {
        ipcRenderer.send('set-library-folder-default');
    }
});

ipcRenderer.on('development-mode', (event, arg) => {
    vue_this.isDevelopment = arg;
});

ipcRenderer.on('launching-interface', (event, arg) => {
    vue_this.disableLaunchButton = true;
    clearTimeout(vue_this.interfaceBusyLaunching);
    vue_this.interfaceBusyLaunching = setTimeout(function() { 
        vue_this.interfaceBusyLaunching = false;
        vue_this.disableLaunchButton = false;
    }, vue_this.interfaceBusyLaunchingTimeout);
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

ipcRenderer.on('request-close-interface-running', (event, arg) => {
    vue_this.openDialog('WantToClose', true);
});

ipcRenderer.on('launch-interface-already-running', (event, arg) => {
    // This only happens if allowMultipleInstances == false and if an instance 
    // of interface is already running.
    vue_this.openDialog('LaunchFailedInterfaceRunning', true);
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
    vue_this.showUpdateButton = true;
    vue_this.resetDownloadButton();
    
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
    vue_this.showUpdateButton = false;
    vue_this.resetDownloadButton();
    
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg
    });
    vue_this.openDialog('InstallFailed', true);
});

ipcRenderer.on('check-for-updates-failed', (event, arg) => {
    vue_this.disableUpdateButton = false;
    vue_this.resetUpdateButton();
    
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg
    });
    vue_this.openDialog('CheckForUpdatesFailed', true);
});

ipcRenderer.on('checked-for-updates', (event, arg) => {
    vue_this.disableUpdateButton = false;
    vue_this.disableLaunchButton = false;
    vue_this.$store.commit('mutate', {
        property: 'currentNotice', 
        with: arg.checkForUpdates.latestVersion
    });
    
    if (arg.checkForUpdates.updateAvailable === true) {
        vue_this.openDialog('UpdateAvailable', true);
    } else {
        vue_this.openDialog('NoUpdateAvailable', true);
    }
});

/* Debug COMMANDS */

function clearSelectedInterface() {
    this.$store.commit('mutate', {
        property: 'selectedInterface', 
        with: null
    });
}

/* END Debug COMMANDS */

import Events from './components/Events';
import FavoriteWorlds from './components/FavoriteWorlds';
import Settings from './components/Settings';
import News from './components/News';
// Dialogs
import CancelDownload from './components/Dialogs/CancelDownload'
import CheckForUpdatesFailed from './components/Dialogs/CheckForUpdatesFailed'
import DownloadComplete from './components/Dialogs/DownloadComplete'
import DownloadFailed from './components/Dialogs/DownloadFailed'
import FailedMetadata from './components/Dialogs/FailedMetadata'
import FirstTimeUser from './components/Dialogs/FirstTimeUser'
import InstallComplete from './components/Dialogs/InstallComplete'
import InstallFailed from './components/Dialogs/InstallFailed'
import LaunchFailedInterfaceRunning from './components/Dialogs/LaunchFailedInterfaceRunning'
import LaunchOptions from './components/Dialogs/LaunchOptions'
import NoInstallerFound from './components/Dialogs/NoInstallerFound'
import NoInterfaceFound from './components/Dialogs/NoInterfaceFound'
import NoUpdateAvailable from './components/Dialogs/NoUpdateAvailable'
import ReportAnIssue from './components/Dialogs/ReportAnIssue'
import SelectVersion from './components/Dialogs/SelectVersion'
import UpdateAvailable from './components/Dialogs/UpdateAvailable'
import WantToClose from './components/Dialogs/WantToClose'

export default {
    name: 'App',
    components: {
        Events,
        FavoriteWorlds,
        Settings,
        News,
        // Dialogs
        CancelDownload,
        DownloadComplete,
        DownloadFailed,
        LaunchFailedInterfaceRunning,
        LaunchOptions,
        NoInstallerFound,
        NoInterfaceFound,
        InstallComplete,
        InstallFailed,
        WantToClose,
        CheckForUpdatesFailed,
        NoUpdateAvailable,
        ReportAnIssue,
        SelectVersion,
        UpdateAvailable,
        FirstTimeUser,
        FailedMetadata
    },
    methods: {
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
		attemptLaunchInterface: function(goto) {
			// var exeLoc = ipcRenderer.sendSync('get-vircadia-location'); // todo: check if that location exists first when using that, we need to default to using folder path + /interface.exe otherwise.
            var exeLoc;
            
            if (this.$store.state.selectedInterface) {
                exeLoc = this.$store.state.selectedInterface.folder + "interface.exe";
            }
            
            console.info("Attempting to launch interface, found exeLoc:", exeLoc);
            
            if (exeLoc) {
                this.launchInterface(exeLoc, goto);
            } else {
                // this.selectInterfaceExe();
                // No, no more... we'll just default to selecting the first interface we find. You can select on your own time. UX baby.
                ipcRenderer.invoke('get-interface-list-for-launch');
            }
		},
        launchInterface: function(exeLoc, goto) {
            ipcRenderer.send('launch-interface', { 
                "exec": exeLoc, 
                "customPath": goto, 
                "customLaunchParameters": this.$store.state.customLaunchParameters, 
                "noSteamVR": this.$store.state.noSteamVR, 
                "noOculus": this.$store.state.noOculus, 
                "allowMultipleInstances": this.$store.state.allowMultipleInstances, 
                "autoRestartInterface": this.$store.state.autoRestartInterface, 
                "dontPromptForLogin": this.$store.state.dontPromptForLogin,
                "launchAsChild": this.$store.state.launchAsChild
            });
        },
        openURL: function(url) {
            const { shell } = require('electron');
            shell.openExternal(url);    
        },
        openInterfaceURL: function(url) {
            this.attemptLaunchInterface(url);
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
        },
        resetDownloadButton: function () {
            this.downloadText = "Download Interface";
            this.isDownloading = false;
            this.isSilentInstalling = false;
            this.disableDownloadButton = false;
            this.showDownloadButton = true;
            this.showUpdateButton = false;
            this.showCloudIcon = true;
            this.disableLaunchButton = false;
        },
        resetUpdateButton: function() {
            this.downloadText = "Download Interface";
            this.isDownloading = false;
            this.isSilentInstalling = false;
            this.disableDownloadButton = false;
            this.showDownloadButton = false;
            this.showUpdateButton = true;
            this.showCloudIcon = true;
            this.disableLaunchButton = false;
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
        },
        watchStoreAndData() {
            return JSON.stringify(Object.assign({}, this.$data, this.$store.state), 0, 2);
        }
    },
	watch: {
        interfaceSelected (newVal, oldVal) {
            console.info("Interface selected:", newVal);
            if (newVal) {
                this.showDownloadButton = false;
                this.showUpdateButton = true;
            }
        },
        watchStoreAndData (newVal, oldVal) {
            document.querySelector("#development-output").innerText = newVal;
        },
        showTab (newVal, oldVal) {
            if (newVal == null) {
                this.showTab = this.defaultTab;
            }
        }
    },
    data: () => ({
        showTab: 'Events', // Filling this in sets the default tab to show on startup.
        defaultTab: 'Events', // The default tab to go to when a user toggles off another.
        disableEventsTab: false,
        titleHover: false,
        isDevelopment: false,
        // Dialog Data
        showDialog: '',
        shouldShowDialog: false,
        // Launch Data
        launchOptions: [],
        disableLaunchButton: false,
        interfaceBusyLaunching: false,
        interfaceBusyLaunchingTimeout: 12000, // 12 seconds
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
