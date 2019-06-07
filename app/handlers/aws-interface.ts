import db from "../db/db";
let AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
    region: 'ap-south-1',
    accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

let sqs = new AWS.SQS({apiVersion: '2012-11-05'});
let queueURL = 'https://sqs.ap-southeast-1.amazonaws.com/949076315729/node-collector';

class AwsInterface {
    constructor() {

    }
    getAllMessages(req:Object, res:Object) {
       let params = {
            QueueUrl: queueURL, /* required */
            AttributeNames: [ 'SentTimestamp' ],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [ 'All' ],
            VisibilityTimeout: 0,
            WaitTimeSeconds: 0
        };
        sqs.receiveMessage(params, function (err, data) {
            if(err){
                return res.status(500).send({
                    success: 'true',
                    message: 'Error',
                    err: err,
                });
            } else {
                return res.status(200).send({
                        success: 'true',
                        message: 'messages retrieved successfully',
                        messages: data.Messages,
                });
            }
        })
    }

    getMessage(req:Object, res:Object) {
        const id = parseInt(req.params.id, 10);
        db.map((message) => {
            if (message.id === id) {
                return res.status(200).send({
                    success: 'true',
                    message: 'message retrieved successfully',
                    messages: message
                });
            }
        });
        return res.status(404).send({
            success: 'false',
            message: 'message does not exist',
        });
    }

    createMessage(req:Object, res:Object) {
        if(!req.body.message) {
            return res.status(400).send({
                success: 'false',
                message: 'Message is required'
            });
        }
       let qwertessageBody = JSON.stringify(req.body);
       console.log(qwertessageBody);
        let params = {
            QueueUrl: queueURL, /* required */
            DelaySeconds: 0,
            MessageAttributes: {
                "Title": {
                    DataType: "String",
                    StringValue: "Harshal Chaudhari"
                },
                "Author": {
                    DataType: "String",
                    StringValue: "Harshal Chaudhari"
                }
            },
            MessageBody: req.body.mesage
        };

        sqs.sendMessage(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                return res.status(500).send({
                    success: 'false',
                    err: err,
                    stack: err.stack,
                });
            } else {
                return res.status(201).send({
                    success: 'true',
                    message: 'Message added successfully',
                    messages: data
                })
            }
        });
    }

    updateMessage(req:Object, res:Object) {
        return res.status(201).send({
            success: 'true',
            message: 'message added successfully',
            newMessage: "Updated"
        });
    }

    deleteMessage(req:Object, res:Object) {


        const id = parseInt(req.params.id, 10);
        let messageFound;
        let itemIndex;

        req.Messages.forEach(function (message) {
            var params = {
                QueueUrl: queueURL, /* required */
                ReceiptHandle: message.ReceiptHandle /* required */
            };
            sqs.deleteMessage(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        });

        

        return res.status(200).send({
            success: 'true',
            message: 'Message deleted successfuly',
        });
    }
}
export default AwsInterface;