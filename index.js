'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'giant_coffee_mug_explodes') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token' + req.query['hub.verify_token'])
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


const token = "EAAJKaDZBwiKcBAHqsz601pTvKc6lkGUhSmqTiSZBj4BneZA3bjSZAZBM8Pknk1wf2cLohxfFrNllGWrgbvZAB37PScVCbjBvgIbC8B8M6BKq6JAWgeeRiKct9f9s21OKfcJ3TNLpc8zOURx4W8bu4uHP1xTtZADjpIpnggqOF8zcwZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
    
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"EAAJKaDZBwiKcBAHqsz601pTvKc6lkGUhSmqTiSZBj4BneZA3bjSZAZBM8Pknk1wf2cLohxfFrNllGWrgbvZAB37PScVCbjBvgIbC8B8M6BKq6JAWgeeRiKct9f9s21OKfcJ3TNLpc8zOURx4W8bu4uHP1xTtZADjpIpnggqOF8zcwZDZD": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
    let messageData2 = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [{
                    title: "rift",
                    subtitle: "Next-generation virtual reality",
                    item_url: "https://www.oculus.com/en-us/rift/",               
                    image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                    buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/rift/",
                        title: "Open Web URL"
                    }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for first bubble",
                    }],
                }, {
                    title: "touch",
                    subtitle: "Your Hands, Now in VR",
                    item_url: "https://www.oculus.com/en-us/touch/",               
                    image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                    buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/touch/",
                        title: "Open Web URL"
                    }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for second bubble",
                    }]
                }]
            }
        }
    }
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData2,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
