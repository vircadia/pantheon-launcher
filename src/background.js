/*
    background.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Project Athena and contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

'use strict'

import { app, protocol, BrowserWindow, DownloadItem } from 'electron'
import {
	installVueDevtools,
	createProtocol,
} from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
const storage = require('electron-json-storage');
const { shell } = require('electron')
const electronDl = require('electron-dl');
const { readdirSync } = require('fs')
const { forEach } = require('p-iteration');
const fs = require('fs');
const compareVersions = require('compare-versions');
const tasklist = require('tasklist'); // This is specific to Windows.

var glob = require('glob');

const cp = require('child_process');
 
electronDl();
var electronDlItem = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({ 
		width: 1000, 
		height: 800, 
		icon: path.join(__static, '/resources/logo_256_256.ico'), 
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
		} 
	})

	// This line disables the default menu behavior on Windows.
    if (isDevelopment && !process.env.IS_TEST) {
        // Don't nullify the menu.
    } else {
        win.setMenu(null);
    }
	

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
	if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		// Load the index.html when not in development
		win.loadURL('app://./index.html')
	}

	win.on('closed', () => {
    	win = null
	})
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            // console.info("Installing VueDevTools, if this does not work, Electron will not generate an interface.");
            // await installVueDevtools()
        } catch (e) {
            // console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

// Settings.JSON bootstrapping
// storage.setDataPath(app.getAppPath() + "/settings");

console.log("Data Path: " + storage.getDataPath());

var storagePath = {
	default: storage.getDefaultDataPath(),
	interface: null,
	interfaceSettings: null,
	currentLibrary: null,
};

var installFolderName = "\\Vircadia_Interface_Latest_SILENT";

var currentInterface;
var requireInterfaceSelection;

// shell.openItem(storagePath.default);

async function generateInterfaceList(interfaces) {
    var interfacesArray = [];
    var dataPath;
    for (var i in interfaces) {
        var client = interfaces[i];
        dataPath = client + "launcher_settings";
        // dataPath = client;

        await getSetting('interface_package', dataPath).then(function(pkg){
            var appName = pkg.package.name;
            var appObject = { 
                [appName]: {
                    "location": client,
                }
            };
            interfacesArray.push(appObject);
        });

        // var appName = "Vircadia Interface";
        // var appObject = { 
        // 	[appName]: {
        // 		"location": client,
        // 	}
        // };
        // interfacesArray.push(appObject);
    }
    return interfacesArray;
}

async function getDirectories (src) {
	var interfacesToReturn = [];
	
	let getDirectoriesPromise = new Promise((res, rej) => {
		var res_p = res;
		var rej_p = rej;
        
        // THIS CODE ACTUALLY LOOKS FOR A PACKAGE.JSON TO REGISTER
		glob(src + '/*/launcher_settings/interface_package.json', function(err, folders) {
			console.log(folders);
			if(folders) {
				folders.forEach(function (folder) {
					var folderToReturn = folder.replace("launcher_settings/interface_package.json", "");
					interfacesToReturn.push(folderToReturn);
				});
				res_p();
			} else {
				rej_p("Failed to load directories.");
			}
		});
		
        // THIS CODE ONLY LOOKS FOR INTERFACE.EXE
        
		// glob(src + '/*/interface.exe', function(err, folders) {
		// 	console.log(folders);
		// 	if(folders) {
		// 		folders.forEach(function (folder) {
		// 			var folderToReturn = folder.replace("interface.exe", "");
		// 			interfacesToReturn.push(folderToReturn);
		// 		});
		// 		res_p();
		// 	} else {
		// 		rej_p("Failed to load directories.");
		// 	}
		// });
	});

	let result = await getDirectoriesPromise; 
	return interfacesToReturn;
}

async function getLibraryInterfaces() {
	var interfaces = [];

	let getLibraryPromise = new Promise((res, rej) => {
		var res_p = res;
		var rej_p = rej;
		getSetting('vircadia_interface.library', storagePath.default).then(async function(libraryPath){
			if(libraryPath) {
				await getDirectories(libraryPath).then(function(interfacesList){
					interfaces = interfacesList;
					res_p();
				});
				console.info("Nani Lib Path?", libraryPath);
			} else {
				interfaces = ["Select a library folder."];
				rej_p("Select a library folder.");
			}
		});
	});

	let result = await getLibraryPromise; 
	return interfaces;
}

function setLibrary(libPath) {
	storage.set('vircadia_interface.library', libPath, {dataPath: storagePath.default}, function(error) {
		if (error) {
			throw error;
		} else {
			win.webContents.send('current-library-folder', {
				"libraryPath": libPath
			});
			storagePath.currentLibrary = libPath;
			return true;
		}
	});
}

function setLibraryDialog() {
	const {dialog} = require('electron') 

	dialog.showOpenDialog(win, {
		title: "Select A Folder",
		properties: ['openDirectory'],
	}).then(result => {
		console.log("Cancelled set library dialog: " + result.canceled)
		console.log("Selected library: " + result.filePaths)
		if(!result.canceled && result.filePaths[0]) {
			setLibrary(result.filePaths[0]);
		} else {
			return false;
		}
	}).catch(err => {
		console.log(err)
		return false;
	})
}

async function getCurrentInterfaceJSON() {
    var interfacePackageJSON = storagePath.interfaceSettings + '/interface_package.json';
    let rawdata = fs.readFileSync(interfacePackageJSON);
    let interfaceJSON = JSON.parse(rawdata);
    
    if (interfaceJSON) {
        console.info("Interface Package JSON:", interfaceJSON);
        return interfaceJSON;
    } else {
        return false;
    }
}

async function getLatestMetaJSON() {
	var metaURL = 'https://cdn.vircadia.com/dist/launcher/vircadiaMeta.json';
		
	await electronDl.download(win, metaURL, {
		directory: storagePath.default,
		showBadge: false,
		filename: "vircadiaMeta.json",
        // onStarted etc. event listeners are added to the downloader, not replaced in the downloader, so we need to use the 
        // downloadItem to check which download is progressing.
        onStarted: downloadItem => {
            electronDlItem = downloadItem;
        },
		onProgress: currentProgress => {
			var percent = currentProgress.percent;
            if (electronDlItem && electronDlItem.getURL() === metaURL) {
                if (percent === 1) {
                    electronDlItem = null;
                }
                // console.info("DLing meta:", percent);
            }
		},
        onCancel: downloadItem => {
            electronDlItem = null;
        }
	});
	
	var vircadiaMetaFile = storagePath.default + '/vircadiaMeta.json';
	let rawdata = fs.readFileSync(vircadiaMetaFile);
	let vircadiaMetaJSON = JSON.parse(rawdata);
	
	if (vircadiaMetaJSON) {
		console.info("Vircadia Meta JSON:", vircadiaMetaJSON);
		return vircadiaMetaJSON;
	} else {
        console.error("Failed to download Vircadia Meta JSON");
		return false;
	}
}

async function checkForInterfaceUpdates() {
	var vircadiaMeta = await getLatestMetaJSON();
    var interfacePackage = await getCurrentInterfaceJSON();
    
    if (vircadiaMeta && vircadiaMeta.latest.version && interfacePackage && interfacePackage.package.version) {
        var versionCompare = compareVersions(vircadiaMeta.latest.version, interfacePackage.package.version);
        console.info("Compare Versions: ", versionCompare);
        if (versionCompare == 1) {
            return 1; // An update is available.
        } else {
            // Version check failed, interface is either equal to or above the server's version.
            return -1;
        }
    } else {
        // Failed to retrieve either or both the server meta and interface meta .JSON files.
        return -1;
    }
}

async function checkForUpdates() {
    if (storagePath.interfaceSettings) {
        // This means to update because an interface exists and is selected.
        console.info("Checking for updates.");
        var checkForUpdates = await checkForInterfaceUpdates();
        if (checkForUpdates != null) {
            // Return with the URL to download or false if not.
            win.webContents.send('checked-for-updates', { checkForUpdates }); 
        }
    }
}

async function getDownloadURL() {
    var metaJSON = await getLatestMetaJSON();
    if (metaJSON) {
        return metaJSON.latest.url;
    } else {
        return false;
    }
}

async function getSetting(setting, storageDataPath) {
	var returnValue;

	let storagePromise = new Promise((res, rej) => {
		storage.get(setting, {dataPath: storageDataPath}, function(error, data) {
			if (error) {
				returnValue = false;
				rej("Error: " + error);
				throw error;
			} else if (Object.entries(data).length==0) {
				// console.info("Requested:", setting, "Got data:", data, "Object.entries:", Object.entries(data).length);
				returnValue = false;
				rej("Not found.")
			} else {
				returnValue = data;
				res("Success!");
			}
		});
	}).catch(err => {
		console.info("Attempted to retrieve:", setting, "from:", storageDataPath, "but got:", err)
	})

	// because async won't work otherwise. 
	let result = await storagePromise; 
	console.info("getSetting Return Value:",returnValue)
	return returnValue;
}

const { ipcMain } = require('electron')

ipcMain.on('save-state', (event, arg) => {
	storage.set('vircadia_launcher.state', arg, {dataPath: storagePath.default}, function(error) {
		if (error) throw error;
	});
})

ipcMain.on('load-state', (event, arg) => {
	getSetting('vircadia_launcher.state', storagePath.default).then(function(results){
		if(results) {
			win.webContents.send('state-loaded', {
				results
			});
		}
	});
})

ipcMain.on('set-metaverse-server', (event, arg) => {
	if(arg != "") {
		process.env.HIFI_METAVERSE_URL = arg;
	} else {
		delete process.env.HIFI_METAVERSE_URL;
	}
	console.info("Current Metaverse Server:", process.env.HIFI_METAVERSE_URL)
})

ipcMain.on('launch-interface', (event, arg) => {
	var interface_exe = require('child_process').execFile;
	// var executablePath = "E:\\Development\\High_Fidelity\\v0860-kasen-VS-release+freshstart\\build\\interface\\Packaged_Release\\Release\\interface.exe";
	var executablePath = arg.exec;
	var parameters = [];

	// arg is expected to be true or false with regards to SteamVR being enabled or not, later on it may be an object or array and we will handle it accordingly.
	if (arg.steamVR) {
		parameters.push('--disable-displays="OpenVR (Vive)"');
		parameters.push('--disable-inputs="OpenVR (Vive)"');
	}
	
	if (arg.allowMultipleInstances) {
		parameters.push('--allowMultipleInstances');
	}
		
	console.info("Nani?", parameters, "type?", Array.isArray(parameters));

	interface_exe(executablePath, parameters, { windowsVerbatimArguments: true }, function(err, stdout, data) {
		console.log(err)
		console.log(stdout.toString());
	});
  
})

ipcMain.on('get-vircadia-location', async (event, arg) => {
    var vircadiaLocation = await getSetting('vircadia_interface.location', storagePath.interfaceSettings);
    var vircadiaLocationExe = vircadiaLocation.toString();
    console.info("VircadiaLocationExe:",vircadiaLocationExe);
    event.returnValue = vircadiaLocationExe;
})

ipcMain.on('set-vircadia-location', async (event, arg) => {
    const {dialog} = require('electron') 
  
    dialog.showOpenDialog(win, {
        title: "Select the Vircadia Interface executable",
        properties: ['openFile'],
        defaultPath: storage.getDataPath(),
        filters: [
            { name: 'Interface Executable', extensions: ['exe'] },
        ]
    }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
        if(!result.canceled && result.filePaths[0]) {
            var storageSavePath;
            if (storagePath.interfaceSettings) {
                storageSavePath = storagePath.interfaceSettings;
                storage.set('vircadia_interface.location', result.filePaths[0], {dataPath: storageSavePath}, function(error) {
                    if (error) throw error;
                });
            } else {
                win.webContents.send('need-interface-selection');
            }
        } else {
            return;
        }
    }).catch(err => {
        console.log(err)
        return;
    })
  
})

ipcMain.on('setLibraryFolder', (event, arg) => {
    setLibraryDialog();
})

ipcMain.on('set-library-folder-default', (event, arg) => {
    setLibrary(storagePath.default);
})

ipcMain.on('get-library-folder', (event, arg) => {
    getSetting('vircadia_interface.library', storagePath.default).then(async function(libraryPath){
        win.webContents.send('current-library-folder', {
            libraryPath
        });
        storagePath.currentLibrary = libraryPath;
    });
})

ipcMain.on('set-current-interface', (event, arg) => {
    if (arg) {
        storage.setDataPath(arg + "/launcher_settings");
        storagePath.interface = arg;
        storagePath.interfaceSettings = arg + "/launcher_settings";
        console.info("InterfaceSettings:", storagePath.interfaceSettings);
        console.info("storagePath:", JSON.stringify(storagePath));
    }
})

ipcMain.handle('isInterfaceSelectionRequired', (event, arg) => {
    if(storagePath.interface == null || storagePath.interfaceSettings == null) {
        event.sender.send('interface-selection-required', true);
    } else {
        event.sender.send('interface-selection-required', false);
    }
})

ipcMain.handle('populateInterfaceList', (event, arg) => {
    getLibraryInterfaces().then(async function(results) {
        var generatedList = await generateInterfaceList(results);
        console.info("Returning...", generatedList, "typeof", typeof generatedList, "results", results);
        event.sender.send('interface-list', generatedList);
    });
})

ipcMain.handle('get-interface-list-for-launch', (event, arg) => {
	getLibraryInterfaces().then(async function(results) {
		var generatedList = await generateInterfaceList(results);
		// console.info("Returning...", generatedList, "typeof", typeof generatedList, "results", results);
		event.sender.send('interface-list-for-launch', generatedList);
	});
})


var installer_exe = cp.execFile;

function launchInstaller() {
    getSetting('vircadia_interface.library', storagePath.default).then(function (libPath) {
        var executablePath = libPath + "/Vircadia_Setup_Latest.exe";
        var installPath = libPath + "/Vircadia_Interface_Latest";
        var parameters = [""];

        if (!fs.existsSync(executablePath)) {
            // Notify main window of the issue.
            win.webContents.send('no-installer-found');
            return;
        }

        console.info("Installing, params:", executablePath, installPath, parameters)

        installer_exe(executablePath, parameters, function (err, data) {
            console.log(err)
            console.log(data.toString());
        });
    });
}

async function silentInstall() {
    var executableLocation; // This is the downloaded installer.
    var installPath; // This is the location to install the application to.
    var executablePath; // This is the location that the installer exe is located in after being downloaded.
    var exeLocToInstall; // This is what gets installed.
    var list = await tasklist();
    var canInstall = true;
    
    list.forEach((task) => {
        if (task.imageName === "server-console.exe") {
            console.log("SANDBOX FOUND!");
            canInstall = false;
        }
    });
    
    if (!canInstall) {
        win.webContents.send('silent-installer-failed', 'Your server sandbox is running. Please close it before proceeding.');        
        return;
    }
    
    getSetting('vircadia_interface.library', storagePath.default).then(function (libPath) {    
        if (libPath) {
            executableLocation = libPath + "/Vircadia_Setup_Latest.exe";
            installPath = libPath + installFolderName;
            executablePath = libPath;
        } else {
            executableLocation = storagePath.default + "/Vircadia_Setup_Latest.exe";
            installPath = storagePath.default + installFolderName;
            executablePath = storagePath.default;
        }
        
        var parameters = [];
        
        parameters.push("/S");
        parameters.push("/D=" + installPath);

        if (!fs.existsSync(executableLocation)) {
            // Notify main window of the issue.
            win.webContents.send('no-installer-found');
            return;
        } else {
            console.info("exeLoc:", executableLocation);
            console.info("exePath:", executablePath);
            
            fs.copyFileSync(executableLocation, executablePath + "/Vircadia_Setup_Latest_READY.exe", (err) => {
                if (err) console.log('ERROR ON COPY: ' + err);
                console.log('Completed copy operation successfully.');
            });
            
            fs.unlink(executableLocation, (err) => {
                if (err) console.log('ERROR ON ORIGINAL INSTALLER DELETE: ' + err);
                console.info(executableLocation, 'was deleted after copying.');
            });
            
            exeLocToInstall = executablePath + "/Vircadia_Setup_Latest_READY.exe";
        }
        
        win.webContents.send('silent-installer-running');

        console.info("Installing silently, params:", exeLocToInstall, installPath, parameters)

        try { 
            installer_exe(exeLocToInstall, parameters, { windowsVerbatimArguments: true }, function (err, data) {
                console.log(err)
                console.log(data.toString());
                
                // On installer exit...
                if (err) {
                    console.info("Installation failed.");
                    win.webContents.send('silent-installer-failed');
                    // throw err;
                } else {
                    console.info("Installation complete.");
                    console.info("Running post-install.");
                    postInstall();
                }
            });
        } catch (e) {
            console.info("Try block: Silent installation failed.")
            win.webContents.send('silent-installer-failed');    
        }
        
    }).catch(function(e) {
        console.info("Failed to fetch library for silent install. Error:", e);
        win.webContents.send('silent-installer-failed');
    });
}

async function postInstall() {
    getSetting('vircadia_interface.library', storagePath.default).then(async function (libPath) {
        var installPath;
        var vircadiaMetaJSON = await getLatestMetaJSON();
        var vircadiaPackageJSON = 
        {
            "package": {
                "name": vircadiaMetaJSON.latest.name,
                "version": vircadiaMetaJSON.latest.version
            }
        };
        
        if (libPath) {
            installPath = libPath + installFolderName;
        } else {
            installPath = storagePath.default + installFolderName;
        }
        
        var packageJSONFilename = installPath + "/launcher_settings/interface_package.json";
        
        fs.writeFileSync(packageJSONFilename, JSON.stringify(vircadiaPackageJSON), err => {
            if (err) {
                console.error(err);
                win.webContents.send('silent-installer-failed', 'Failed to create Interface metadata post-install.');
                return
            }
            //file written successfully
        });
        
        win.webContents.send('silent-installer-complete');
    }).catch(function(e) {
        console.info("Failed to fetch library for post install. Error:", e);
    });
}

ipcMain.on('download-vircadia', async (event, arg) => {
    var libraryPath;
    var downloadURL = await getDownloadURL();
    var installerName = "Vircadia_Setup_Latest.exe";
    console.info("DLURL:", downloadURL);
    if (downloadURL) {
        getSetting('vircadia_interface.library', storagePath.default).then(function(results){
            if(results) {
                libraryPath = results;
            } else {
                libraryPath = storagePath.default;
            }
            
            fs.unlink(libraryPath + "/" + installerName, (err) => {
                if (err) console.log("No previous installation to delete.");
                console.info(installerName, 'was deleted prior to downloading.');
            });
            
			electronDl.download(win, downloadURL, {
				directory: libraryPath,
				showBadge: true,
				filename: installerName,
                // onStarted etc. event listeners are added to the downloader, not replaced in the downloader, so we need to
                // use the downloadItem to check which download is progressing.
                onStarted: downloadItem => {
                    electronDlItem = downloadItem;
                },
				onProgress: currentProgress => {
					console.info(currentProgress);
					var percent = currentProgress.percent;
                    if (electronDlItem && electronDlItem.getURL() === downloadURL) {
                        win.webContents.send('download-installer-progress', {
                            percent
                        });
                        if (percent === 1) { // When the setup download completes...
                            electronDlItem = null;
                            // launchInstaller();
                            silentInstall();
                        }
                    }
				},
                onCancel: downloadItem => {
                    electronDlItem = null;
                }
                // FIXME: electron-dl currently displays its own "download interrupted" message box if file not found or 
                // download interrupted. It would be nicer to display our own, download-installer-failed, message box.
                // https://github.com/sindresorhus/electron-dl/issues/105
			});
		});
	} else {
		console.info("Failed to download.");
        win.webContents.send('download-installer-failed');
	}
});

ipcMain.on('cancel-download', async (event) => {
    if (electronDlItem) {
        electronDlItem.cancel();
        win.webContents.send('download-cancelled');
    }
});

ipcMain.on('install-vircadia', (event, arg) => {
    launchInstaller();
});

ipcMain.on('check-for-updates', (event, arg) => {
    checkForUpdates();
});

ipcMain.on('request-close', async (event, arg) => {
    var list = await tasklist();
    var canClose = true;
    
    list.forEach((task) => {
        if (task.imageName === "interface.exe") {
            console.log("Interface.exe found.");
            canClose = false;
        }
    });
    
    if (!canClose) {
        win.webContents.send('interface-running');
    } else {
        app.exit();
    }
});

ipcMain.on('close-launcher', (event, arg) => {
    app.exit();
});