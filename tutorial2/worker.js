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

    // This makes sure the queue is declared before attempting to consume from it
    // This 'durable' option change needs to be applied to both the producer and consumer code.
    // At this point we're sure that the task_queue queue won't be lost even if RabbitMQ restarts.

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);
    // Use the prefetch method with the value of 1. This tells RabbitMQ not to give more than one message
    // to a worker at a time. Or, in other words, don't dispatch a new message to a worker until it has
    // processed and acknowledged the previous one.
    // Instead, it will dispatch it to the next worker that is not still busy.
    // Without prefetch(1); worker works in sequence , not parallel

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      // This function will run in parallel after a new message come in,
      // NO waiting for previous worker complete
      function (msg) {
        var secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function () {
          console.log(" [x] Done"); // Make sure call that to send ACK back
          channel.ack(msg);
        }, secs * 1000);
      },
      {
        // To make sure that even if the consumer dies, the task isn't lost:
        // Sending back ACK to confirm that message delivered and processed successfully,
        // If no ACK sent back or worker dead or TCP connection was closed => message will be
        // redelivered to another worker.
        // If no worker active at that moment, message will be temporarily stored in RabbitMQ to wait
        // worker start up again
        noAck: false,
      }
    );
  });
});
