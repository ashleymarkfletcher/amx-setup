#!/usr/bin/env node
// above is needed to create npm link

// get the arguments passed in
// first in the array are always file paths so not needed
const telnet = require('telnet-client')
const stream = require('stream')
const doEcho = new Buffer([0xff, 0xfc, 0x01])
const echoConfirm = new Buffer([0xff, 0xfb, 0x01, 0x0d, 0x0a])
const startConfig = {
  host: '',  // processor to connect to
  name: '', // host name
  type: 's',
  ip: '',
  sub: '',
  gate: '',
  username: 'administrator',
  password: 'password',
  device: '',
  pin: '1988',
  master: '',
  mode: 'u',
  system: '0',
  masterPass: '',
  masterUser: '',
  masterPort: ''
}

const argv = require('minimist')(process.argv.slice(2),{default: startConfig})
let CLIInstance

const setupAMX = function (config) {

  // closure to keep scope
  let self = this
  self.connection = new telnet()
  self.shell = new stream
  self.config = config

  // stores either ip, device or connection
  self.currentCommand = ''

  // create telnet self.connection to amx device
  self.connectAMX = function () {
    // console.log('host:', args.host)
    let options = {
      host: self.config.host,
      timeout: 15000,
      username: 'administrator\r',
      password: 'password\r',
      passwordPrompt: /Password :/,
      // loginPrompt:'/Login :/i'
    }

    self.connection.connect(options)
  }

  self.connection.on('ready', function(prompt) {
    console.log('ready!');
  })

  self.connection.on('connect', function(prompt) {
    console.log('connected!');
    // single commands can be done with just exec like below
    // self.connection.exec('help\r\n', {execTimeout:15000})
    // .then((res) => {
    //   console.log('e', res);
    // }).catch((err) => {console.log('error', err);})

    self.connection.shell().then((shellInst) => {
      self.shell = shellInst

      // Handle stream events --> data, end, and error
      self.shell.on('data', self.processFeedback)

      self.shell.on('end', function() {
        // this never happens?
         console.log('data!!', data)
      })

      self.shell.on('error', function(err) {
         console.log(err.stack)
      })
    })
  })

  self.processFeedback = function (feedbackBuffer) {
    // console.log('arr', feedbackBuffer);

    let feedbackArray = feedbackBuffer.toString().split('\r\n')
    // console.log('arr', feedbackArray);

    let feedback = feedbackBuffer.toString().trim()
    console.log(feedback);

    // if echo response is needed
    if (Buffer.compare(feedbackBuffer, doEcho) == 0) {
      // negotiate echo

      self.shell.write(echoConfirm)

      // console.log('this?');
    } else if (feedback.substr(0,7) == 'Welcome') {
      if (self.config.device) {
        self.currentCommand = 'device'
        self.shell.write('set device\r\n')
      } else if (self.config.master) {
        self.currentCommand = 'connection'
          self.shell.write('set connection\r\n')
      }
      else {
        self.currentCommand = 'ip'
        self.shell.write('set ip\r\n')
      }
    }

    // loop through feedback lines
    feedbackArray.forEach((feed) => {
      let feedTrimmed = feed.trim()
      let toWrite = false

      // touch panel password
      if (feedTrimmed.includes('Enter protected')) {
        toWrite = self.config.pin
      }
      // set connection
      else if (feedTrimmed.includes('Enter Mode')) {
        toWrite = self.config.mode
      }
      else if (feedTrimmed.includes('Enter Master System')) {
        toWrite = self.config.system
      }
      else if (feedTrimmed.includes('Enter Master IP')) {
        toWrite = self.config.master
      }
      else if (feedTrimmed.includes('Enter Master Port')) {
        toWrite = self.config.masterPort
      }
      else if (feedTrimmed.includes('Enter Master User')) {
        toWrite = self.config.masterUser
      }
      else if (feedTrimmed.includes('Enter Master Password')) {
        toWrite = self.config.masterPass
      }
      // set device
      else if (feedTrimmed.includes('Enter new device number')) {
        toWrite = self.config.device
      }
      else if (feedTrimmed.includes('Setting device number')) {

        // if an ip has also been set start set ip
        if (self.config.master) {
          // then set connection
          self.currentCommand = 'connection'
          self.shell.write('set connection\r\n')
        } else if (self.config.ip){
          // then set ip
          self.currentCommand = 'ip'
          self.shell.write('set ip\r\n')
        }
      }
      // set ip
      else if (feedTrimmed.includes('Enter Host')) {
        toWrite = self.config.name
      }
      else if (feedTrimmed.includes('Enter IP type')) {
        toWrite = self.config.type
      }
      else if (feedTrimmed.includes('Enter IP Addr')) {
        toWrite = self.config.ip
      }
      else if (feedTrimmed.includes('Enter Subnet')) {
        toWrite = self.config.sub
      }
      else if (feedTrimmed.includes('Enter Gateway')) {
        toWrite = self.config.gate
      }
      else if (feedTrimmed.includes('Is this correct')) {
        toWrite = 'y'
      }
      else if (feedTrimmed.includes('Settings written')) {
        if (self.currentCommand == 'connection' && self.config.ip) {
          // then set ip
          self.currentCommand = 'ip'
          self.shell.write('set ip\r\n')
        } else if (self.currentCommand == 'ip') {
          self.shell.write('reboot\r')
        }
      }

      // write to self.shell
      if (toWrite !== false) {
        console.log('writing: ' + toWrite);
        self.shell.write(toWrite + '\r')
        toWrite = false
      }

    })
  }

  self.connection.on('data', function(data) {
    console.log('connection data', data.toString())
  })

  self.connection.on('timeout', function() {
    console.log('socket timeout!')
    self.connection.end()
  })

  self.connection.on('close', function() {
    console.log('connection closed')
  })

  self.connection.on('error', function(err) {
    console.log('connection error', err)
  })

}

// if any arguments have been passed
if (process.argv.length >= 3) {
  CLIInstance = new setupAMX(argv)
  CLIInstance.connectAMX()
} else {
  console.log('no arguments passed in');
}

module.exports = setupAMX
