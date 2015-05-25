var Q = require('q');
var _ = require('lodash');
var WebTorrent = require('webtorrent');
var uuid = require('uuid');
function torrentService(socketService) {
	var service = {};
	var uploads = {};
	var downloads = {};

	service.uploadStarted = function(files) {
		var uploadId = uuid.v4();

		var name = files[0].name;
		if (files.length > 1){
			name += ' and ' + (files.length - 1) + ' other file(s)';
		}

		uploads[uploadId] = {
			name: name,
			isCompleted: false,
		};

		return uploadId;
	};

	service.uploadCompleted = function(id, torrent) {
		uploads[id].infoHash = torrent.infoHash;
		uploads[id].isComplete = true;
		socketService.emit('setTorrents', uploads);
	};

	service.getUploads = function() {
		return uploads;
	};

	service.downloadStarted = function(torrent, name) {
		downloads[torrent.infoHash] = {
			obj: torrent,
			name: name,
			progress: 0,
			isCompleted: false,
		};
	};

	service.downloadCompleted = function(torrent, files) {
		downloads[torrent.infoHash].files = files;
	};

	service.getDownloads = function() {
		return downloads;
	};

	service.getFileUrl = function(file) {
		return Q.Promise(function(resolve, reject) {
			file.getBlobURL(function(err, url) {
				if (err) {
					reject(err);
				}
				resolve({
					name: file.name,
					url: url,
				});
			});
		});
	};

	service.getFileUrls = function(torrent) {
		var promises = torrent.files.map(service.getFileUrl);
		return Q.all(promises);
	};

	service.getProgress = function(torrent) {
		try {
			return Math.round(torrent.downloaded / torrent.parsedTorrent.length * 100) || 0;
		} catch (e) {
			return 0;
		}
	};

	service.seed = function(files) {
		var client = new WebTorrent();
		return Q.promise(function(resolve, reject) {
			client.seed(files, resolve);
			client.on('warning', function(msg) {
				console.log('msg', msg);
			});
			client.on('error', reject);
		});
	};

	return service;
}

module.exports = ['socketService', torrentService];
