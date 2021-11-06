var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "task_queue";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true, // After MQ crashed or restarted message still in queue (Not 100% still in queue, 80% see docs for answer)
    });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});