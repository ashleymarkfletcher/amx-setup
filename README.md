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
const setupAMX = require('setupAMX')

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

##### --host


##### --name


##### --type


##### --ip


##### --sub


##### --gate


##### --username


##### --password


##### --device


##### --pin


##### --master


##### --mode


##### --system


##### --masterPass


##### --masterUser


##### --masterPort
