
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


var server_port = process.env.LISTEN_PORT || 8080;
var server_ip_address = process.env.LISTEN_IP || '0.0.0.0';
var target_orion_url = process.env.TARGET_ORION_URL || 'http://127.0.0.1:1026';
var target_service = process.env.TARGET_SERVICE || undefined;
var target_service_path = process.env.TARGET_SERVICE_PATH|| undefined;
var target_auth_token = process.env.TARGET_AUTH_TOKEN|| undefined;

if (process.env.TARGET_AUTH_TOKEN_FILE!==undefined) {
    try {
        target_auth_token = fs.readFileSync(process.env.TARGET_AUTH_TOKEN_FILE);
    } catch (exceptio) {
        console.log("Failed to read secret "+process.env.TARGET_AUTH_TOKEN_FILE);
        target_auth_token=undefined
    }
}

app.all('*', intercept);

async function intercept(req, res) {
    var nberror=0;
    var nbsuccess=0;
    if (req.body != undefined) {
        if ((req.body.hasOwnProperty("subscriptionId")) && req.body.hasOwnProperty("data") && req.body.data.hasOwnProperty("length")) {
            for (var i=0;i<req.body.data.length;i++) { 
                var request = {
                    maxRedirects: 0,
                    method: "POST",
                    url: target_orion_url+"/v2/entities?options=upsert",
                    data: JSON.stringify(req.body.data[i]),
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                if (target_service!==undefined) request.headers["Fiware-Service"]=target_service;
                if (target_service_path!==undefined) request.headers["Fiware-ServicePath"]=target_service_path;
                if (target_auth_token!==undefined) request.headers["X-Auth-Token"]=target_auth_token;
                try {
                    var response= await axios.request(request);
                    nbsuccess++;
                }catch(error) {
                    nberror++;
                }
            }
            console.log(new Date().toISOString() + " Nb entity : "+req.body.data.length +"   success: "+nbsuccess+"   error: "+nberror)
        }
    }
    res.statusCode = 204;
    res.end();
}

app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port + " 1.0");
});

