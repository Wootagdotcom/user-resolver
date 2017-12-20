'use strict';
const config = require('./config');
const logger = require('./logger')(module);
const express = require('express');
const app = express();
const apicache = require('apicache');
const webService = require('./helper/web-service');
const localCache = require('./config/video-user.json');
app.get('/', function (req, res) {
    res.send('This is ua parser server');
});
let cache = apicache.middleware;
app.get('/users/:video', cache('5 minutes'), function (req, res) {
    logger.info('finding owner for video: ' + req.params.video);
    if (!!localCache[req.params.video]) {
        logger.info('found in local cache');
        res.send(localCache[req.params.video]);
    } else {
        webService.findUser(req.params.video, function (err, result) {
            if (err) {
                res.status(404).send('Not Found');
            }
            else {
                res.send(`${result}`);
            }
        });
    }
});

app.get('/duration/:video', cache('5 minutes'), function (req, res) {
    logger.info('finding total duration for video: ' + req.params.video);
    webService.findDuration(req.params.video, function (err, result) {
        if (err) {
            res.status(404).send('Not Found');
        }
        else {
            res.send(`${result}`);
        }
    });
});

app.get('/engagements/:videoId/:engagementId', cache('5 minutes'), function (req, res) {
    logger.info(`finding engagement type for video: ${req.params.videoId} and engagement: ${req.params.engagementId}`);
    webService.findEngagementType(req.params.videoId, req.params.engagementId, function (err, result) {
        if (err) {
            res.status(404).send('Not Found');
        }
        else {
            res.send(`${result}`);
        }
    });
});

app.get('/pollquestion/:videoId/:engagementId', cache('5 minutes'), function (req, res) {
    logger.info(`fetching poll question type for video: ${req.params.videoId} and engagement: ${req.params.engagementId}`);
    webService.findPollQuestion(req.params.videoId, req.params.engagementId, function (err, result) {
        if (err) {
            res.status(404).send('Not Found');
        }
        else {
            res.send(`${result}`);
        }
    });
});

app.all('/*', function (req, res) {
    res.status(404).send('Not Found');
});

app.set('port', config.port);

let server = app.listen(app.get('port'), function () {
    logger.info(`Express server listening on port ${server.address().port}`);
});
