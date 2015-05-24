var Q = require('q');
var _ = require('lodash');
var WebTorrent = require('webtorrent');
function torrentService(socketService, userService) {
	var service = {};
	var uploads = {};
	var downloads = {};

	service.setUpload = function(torrent) {
		uploads[torrent.infoHash] = {
			name: torrent.name,
			infoHash: torrent.infoHash,
		};

		socketService.emit('setUploads', uploads);
	};

	service.setDownload = function(torrent, files) {
		downloads[torrent.infoHash] = {
			obj: torrent,
			name: torrent.name,
			infoHash: torrent.infoHash,
			files: files,
		};
	};

	service.getUploads = function() {
		return uploads;
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

module.exports = ['socketService', 'userService', torrentService];
