# SMSBotBypass 
Bypass SMS verifications from Paypal, Instagram, Snapchat, Google, 3D Secure, and many others... using a Discord Bot or the private API.

It's really simple. Imagine that your friend got a Snapchat account, you try to reset his password using the sms system : 
- he's gonna receive the sms confirmation code.

Then, you use the bot (```!call 33612345678 snapchat```). The bot is gonna call him, using the snapchat service, ask for the code received. If he send the code using the numpad, then your gonna receive the code and be able to reset the password. It's like an automatic system for SE. 

# API

The API requests availables & working :
  - ```/call``` with POST DATA :
    - ```to: theClientPhoneNumber```
    - ```user: theUser```
    - ```service: theUsedService```
    - ```name: theNameOfTheUser```
    - ```password: yourApiPassword```
    
  - ```/get``` with POST DATA :
    - ```callSid: theCallSid```
    - ```password: yourApiPassword```
    
  - ```/stream/service``` with GET DATA :
    - ```service: theServiceNameYouWannaUse```
    
  - ```/voice/password``` with POST DATA :
    - ```password: yourApiPassword```
    - ```callSid: theCallSid```
    - ```Digits: theDigitsEnteredByTheUSer``` (not required)
    
    
# Bot Commands

All the Admin commands :
  - ```!user add @user``` : allow someone to use the bot & the calls
  - ```!user delete @user``` : remove someone or an admin from the bot
  - ```!user info @user``` : get infos from a user
  - ```!user setadmin @user``` : set a user to admin

All the Users commands :
  - ```!secret yoursecretpassword @user``` : set a user to admin without been admin
  - ```!call phonenumber service``` or for example ```!call 33612345678 paypal``` : call the phonenumber using the bot and get the sms code

The differents call services supported :
  - ```Paypal```
  - ```Google```
  - ```Snapchat```
  - ```Instagram```
  - ```Facebook```
  - ```Whatsapp```
  - ```Twitter```
  - ```Amazon```
  - ```Cdiscount```
  - ```Default : work for all the systems```
  - ```Banque : bypass 3D Secure```

# How it works ?

1. When you do a ```!call 3312345678 paypal```, the Discord Bot sends a post request to our private api, who is gonna save the call into our sqlite DB and send the call to our twilio API.
2. The Twilio API use our ```/status``` route to know what to do in the call, the status route returns **TwiML** code to Twilio.
3. The ```/status``` route returns the self hosted service song using the ```/stream/service route```. 
4. If the user enter the digit code using the numpad, the song stops, it thanks him for the code, and end the call.
5. The ```/status``` route send the code to your discord channel using a **webhook**.

# Prerequisite
- Node.js & NPM from the last version.
- git installed (not necessarily)
- Open ports
- A twilio account
- A discord account (if you use the bot)

# Install the API

Download the API Files from the github

```git clone https://github.com/Ross1337/SMSBotBypass.git```

Go to our API folder

```cd /SMSBotBypass/api/```

Install the dependencies

```npm i```

Start the api, wait 15s, and then, stop it

```npm start```

Modify the config.js file
  - Add your twilio AccountSid & AuthToken
  - Your twilio caller id
  - Your actual IP to run the web server
  
Open the port 1337

To check if everything works fine, I did a full test system. If your Twilio account is not upgrade, before the test, go to the /test/call.js file and modify the phone number line 122 with your phone numer.

```npm test```

![image](https://user-images.githubusercontent.com/45340378/103482419-1f1e6c80-4de1-11eb-929b-6f34ca28499a.png)

Your private API now **works** ! If your api is not working, upgrade your Twilio account and try again.

Be carefull, you also need to change the TTS Language, go to https://www.twilio.com/console/voice/twiml/text-to-speech and change the TTS Language from English to French with the Lea voice.

# Install the Discord Bot

Take your API Password from you config.js file in your api folder we are gonna use it

```cd ../bots/discord```

Modify the config.js file
  - Add API Url & Api Password
  - Your discord bot token
  - Your actual IP to run the web server
  - Change the secret password
  
Create two discord roles, one "Admin" with Administrator permissions, and the other one "Bot User" with any permission.

Add the bot to the discord server

Initialize the discord bot

```npm i```

You can now start the discord bot

```node bot.js```

You can get all the informations neeeded on discord doing ```!help```

![image](https://user-images.githubusercontent.com/45340378/103483112-6d356f00-4de5-11eb-848d-0bb0b46fc75f.png)

# Disclaimer

This code is only a POC code, do not use it illegally. You could been arrested to use badly this code. Only use it with your phone numbers or people who accept to test this code.

# Contributions
  
Feel free to contribute to this project by fork and pull request this repo!

