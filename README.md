# StickerWiz | Telegram Stickers Mini App


![MiniApp user interface](./assets/interface.png)


<p align="center">
  <img src="./assets/telegram_logo.svg" width="16px" height="16px"/>
  <a href="https://t.me/stkrz_bot">stkrz_bot</a>&nbsp;&nbsp;|&nbsp;
  🏆 <a href="https://t.me/contest/342"> Telegram Contest Winner</a>
</p>

## About
A Telegram MiniApp that allows to create personalised sticker packs. Lets you make your own text stickers for any occasion with just a few taps using cool graphic interface 💅🛍️

From developer's perspective this repository might be usefull for those who develop any kind of content management MiniApps, to use as a template or a starting point. Here are the features of the app implementation:

- Inline and PM modes support
- Neat and tidy UI adapted for different clients (iOS and Android)
- I18n support
- Implemented using Vue.js
- Does not use any UI-kit library

## Running locally

### Telegram API Token
  Before you start, please visit official [Telegram documentation](https://core.telegram.org/bots/features#botfather) for instructions on how to obtain Telegram API token


### Telegram test environment
You can test and develop your MiniApps in Telegram test environment, which is completely separate from the main environment.
For that you'll have to create new separate account and a bot with @BotFather.
Don't forget to set environment variable `DEV=true` in `server/.env` to perform API calls to test environment as well.

[Learn more](https://core.telegram.org/bots/webapps#testing-mini-apps)

### Ngrok
As telegram only allows to open MiniApps available from the internet, we'll need to use [ngrok](https://ngrok.com/docs/getting-started/) to expose our app outside.
Follow [official docs](https://ngrok.com/docs/getting-started/) to install and authenticate ngrok. Then run the following command to start tunnel:

```
  ngrok http 3000 # your server port
```

If you want to launch the app in DEV mode, you'll need to make ngrok instatiate several tunnels at once. For that purpose create ngrok [config](https://ngrok.com/docs/secure-tunnels/ngrok-agent/reference/config/) with the following content:

```
authtoken: yourTokenHere
tunnels:
  first:
    addr: 5173 # server port
    proto: http    
  second:
    addr: 3000 # client dev server port
    proto: http
```

Once cofig file is created/updated, start ngrok with the following command:
```
ngrok start --all
```

### Build
Follow the instructions on how to start/build project in corresponding webapp and server README files.

- [webapp/README.md](https://github.com/TatianaFomina/stkrz_bot/blob/main/webapp/README.md) 
- [server/README.md](https://github.com/TatianaFomina/stkrz_bot/blob/main/server/README.md)

