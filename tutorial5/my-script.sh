#To receive all the logs:
node receive_logs_topic.js "#"

#To receive all logs from the facility "kern":
node receive_logs_topic.js "kern.*"

#Or if you want to hear only about "critical" logs:
node receive_logs_topic.js "*.critical"

#You can create multiple bindings:
node receive_logs_topic.js "kern.*" "*.critical"

#And to emit a log with a routing key "kern.critical" type:
node emit_log_topic.js "kern.critical" "A critical kernel error"