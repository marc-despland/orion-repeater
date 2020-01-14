# Orion Repeater

This small component just can be used as a endpoint for Orion subscription, and then it pushed to another Orion each entities it received.

## Configuration

* LISTEN_PORT (default 8080)
* LISTEN_IP (default 0.0.0.0)
* TARGET_ORION_URL (default http://127.0.0.1:1026)
* TARGET_SERVICE (default not set)
* TARGET_SERVICE_PATH (default not set)
* TARGET_AUTH_TOKEN (default not set, don't use it for production)
* TARGET_AUTH_TOKEN_FILE (default not set, used to pass the token using a secret)