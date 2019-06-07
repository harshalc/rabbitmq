import db from "../db/db";
var amqp = require('amqplib/callback_api');
class AwsInterface {
    constructor() {

    }
    getAllMessages(req:Object, res:any) {
        res.status(200).send({
            success: 'true',
            message: 'todos retrieved successfully',
            todos: db
        })
    }

    getMessage(req:Object, res:Object) {

    }

    createMessage(req:any, res:any) {
        if(!req.body.message) {
            return res.status(400).send({
                success: 'false',
                message: 'Message is required',
                body :req.body
            });
        }
       let msg = req.body.message.toJSONString().getBytes();
      //  msg = JSON.loads(req.body.message)
        let response:any;
        amqp.connect('amqp://localhost', function(error0 :any, connection: any) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1:any, channel:any) {
                if (error1) {
                    throw error1;
                }
                var queue = 'sqs';
                response = channel.sendToQueue(queue, Buffer.allocUnsafe(msg), {
                    contentType: 'application/json',
                    });
            });
            setTimeout(function() {
                res.status(200).send({
                    success: 'true',
                    message: 'Message sent successfully',
                    response: response
                });
                connection.close();
                process.exit(0);
            }, 500);
        });
    }
}
export default AwsInterface;