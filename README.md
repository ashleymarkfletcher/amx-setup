# amx-setup
A simple command line tool and Node.js module to setup **[AMX Netlinx](http://www.amx.com)** touch panels and processors.

A connection is made to the device over **telnet** and commands are sent to configure the device.

## Installation

```bash
$ npm install amx-setup
```

## Features

  * Set network configuration
  * Set device number
  * Set master connection (for touch panels)

## Example Usage CLI
connect to a device and change it's ip address
```bash
$ amx-setup --host 192.168.1.10 --ip 10.10.201.20
```

## Example Usage Node.js
connect to a device and change it's ip address
```js
const setupAMX = require('amx-setup')

const device = new setupAMX({
    host: '192.168.1.20',
    ip: '10.10.201.20'
})

device.connectAMX()
```

## CLI API Reference
arguements available with CLI usage:

##### --host
The device to connect to

##### --ip
IP address to set

##### --name
new host name for the device

##### --type
's' for static or 'd' for dhcp

##### --sub
subnet mask

##### --gate
gateway

##### --username
telent username

##### --password
telent password

##### --device
device ID for touch panels

##### --pin
pin password for touch panels

##### --master
master connection ip address for touch panels

##### --mode
master connection mode. 'u' for url

##### --system
system number for master connection from touch panel

##### --masterPass
password for master from touch panel

##### --masterUser
username for master from touch panel

##### --masterPort
port to connect to from touch panel to master
