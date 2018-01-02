/**
 * Created by rahul on 15/8/17.
 */
'use strict';

const logger = require('../logger')(module);
const _ = require('lodash');
const util = require('util');
const https = require('https');

function findInfoFromWingApi(video, cb) {
    logger.info(`Fetching video details for ${video} from wings api `);
    let options = {
        host: 'wootag.com',
        port: 443,
        path: `/mobile.php/wings/getJsonViz/${video}`,
        method: 'GET',
    };

    let request = https.request(options, function (res) {
        let message = '';
        res.on('data', function (chunk) {
            message += chunk;
        });
        res.on('end', function () {
            if (res.statusCode !== 200) {
                return cb('Not Found');
            }
            message = JSON.parse(message);
            if (!message) {
                return cb('Not Found');
            }
            cb(null, message);
        });
    });
    request.end();
}

exports.findEngagementType = function (videoId, engagementId, cb) {
    findInfoFromWingApi(videoId, function (err, result) {
        if (err) {
            cb('NotFound');
        }
        else {
            let engagements = [];
            _.forEach(result.tags, (t) => {
                _.forEach(t.engagement, (e) => {
                    if (e.id === engagementId) {
                        return engagements.push(e);
                    }
                });
            });
            if (engagements.length === 0) {
                cb('Not Found');
            } else {
                cb(null, engagements[0].type);
            }

        }
    });
};

exports.findPollQuestion = function (videoId, engagementId, cb) {
    findInfoFromWingApi(videoId, function (err, result) {
        if (err) {
            cb('NotFound');
        }
        else {
            let engagements = [];
            _.forEach(result.tags, (t) => {
                _.forEach(t.engagement, (e) => {
                    if (e.id === engagementId) {
                        return engagements.push(e);
                    }
                });
            });
            if (engagements.length === 0) {
                cb('Not Found');
            } else {
                cb(null, engagements[0].poll_question);
            }

        }
    });
};

exports.findPoll = function (videoId, engagementId, cb) {
    findInfoFromWingApi(videoId, function (err, result) {
        if (err) {
            cb('NotFound');
        }
        else {
            let engagements = [];
            _.forEach(result.tags, (t) => {
                _.forEach(t.engagement, (e) => {
                    if (e.id === engagementId) {
                        return engagements.push(e);
                    }
                });
            });
            if (engagements.length === 0) {
                cb('Not Found');
            } else {
                cb(null, engagements[0].poll_question);
            }

        }
    });
};

exports.findUser = function (video, cb) {
    findInfoFromWingApi(video, function (error, info) {
        if (error) {
            cb('NotFound');
        }
        else {
            cb(null, info.user_id);
        }
    });
};

exports.findDuration = function (video, cb) {
    findInfoFromWingApi(video, function (error, info) {
        if (error) {
            cb('NotFound');
        }
        else {
            cb(null, info.duration);
        }
    });
};