/*
    download.js

    Created by Kalila L. on Jan 13 2021.
    Copyright 2021 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

const electronDlMeta = require('electron-dl');
const electronDlEvents = require('electron-dl');
electronDlMeta();
electronDlEvents();

var electronDlItemMeta = null;
var electronDlItemEvents = null;

async function getCDNMetaJSON() {
	var metaURL = DEFAULT_CDN_URL;
		
	await electronDlMeta.download(win, metaURL, {
		directory: storagePath.main,
		showBadge: false,
		filename: DEFAULT_CDN_METADATA_FILENAME,
        // onStarted etc. event listeners are added to the downloader, not replaced in the downloader, so we need to use the 
        // downloadItem to check which download is progressing.
        onStarted: downloadItem => {
            electronDlItemMeta = downloadItem;
        },
		onProgress: currentProgress => {
			var percent = currentProgress.percent;
            if (electronDlItemMeta && electronDlItemMeta.getURL() === metaURL) {
                if (percent === 1) {
                    electronDlItemMeta = null;
                }
                // console.info("DLing meta:", percent);
            }
		},
        onCancel: downloadItem => {
            electronDlItemMeta = null;
        }
	});
	
	var vircadiaMetaFile = storagePath.main + '/' + DEFAULT_CDN_METADATA_FILENAME;
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

async function getCDNEventsJSON() {
	var eventsURL = DEFAULT_CDN_URL + '/dist/launcher/' + DEFAULT_CDN_EVENTS_FILENAME;
		
	await electronDlEvents.download(win, eventsURL, {
		directory: storagePath.main,
		showBadge: false,
		filename: DEFAULT_CDN_EVENTS_FILENAME,
        // onStarted etc. event listeners are added to the downloader, not replaced in the downloader, so we need to use the 
        // downloadItem to check which download is progressing.
        onStarted: downloadItem => {
            electronDlItemEvents = downloadItem;
        },
		onProgress: currentProgress => {
			var percent = currentProgress.percent;
            if (electronDlItemEvents && electronDlItemEvents.getURL() === eventsURL) {
                if (percent === 1) {
                    electronDlItemEvents = null;
                }
                // console.info("DLing events:", percent);
            }
		},
        onCancel: downloadItem => {
            electronDlItemEvents = null;
        }
	});
	
	var vircadiaEventsFile = storagePath.main + '/' + DEFAULT_CDN_EVENTS_FILENAME;
	let rawdata = fs.readFileSync(vircadiaEventsFile);
	let vircadiaEventsJSON = JSON.parse(rawdata);
	
	if (vircadiaEventsJSON) {
		console.info("Vircadia Events JSON:", vircadiaEventsJSON);
		return vircadiaEventsJSON;
	} else {
        console.error("Failed to download Vircadia Events JSON.");
		return false;
	}
}

module.exports = {
    'cdn': {
        'meta': getCDNMetaJSON,
        'events': getCDNEventsJSON
    }
}
