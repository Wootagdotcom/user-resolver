'use strict';
const config = require('./config');
const logger = require('./logger')(module);
const express = require('express');
const app = express();
const webService = require('./helper/web-service');
app.get('/', function (req, res) {
    res.send('This is ua parser server');
});

app.get('/users/:video', function (req, res) {
    logger.info('finding owner for video: ' + req.params.video);
    webService.findUser(req.params.video, function (err, result) {
        if (err) {
            res.status(404).send('Not Found');
        }
        else {
            res.send(`${result}`);
        }
    });
});

app.get('/engagements/:videoId/:engagementId', function (req, res) {
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

app.all('/*', function (req, res) {
    res.status(404).send('Not Found');
});

app.set('port', config.port);

let server = app.listen(app.get('port'), function () {
    logger.info(`Express server listening on port ${server.address().port}`);
});
