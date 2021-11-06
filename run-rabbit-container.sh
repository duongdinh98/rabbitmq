sudo docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq


# sudo docker exec -it rabbitmq /bin/bash
# sudo rabbitmqctl list_queues name messages_ready messages_unacknowledged
# rabbitmq-plugins enable rabbitmq_management