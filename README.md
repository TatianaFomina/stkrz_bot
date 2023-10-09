# Telegram Stickers MiniApp
A Telegram MiniApp that allows to create personalised sticker packs. Lets you make your own text stickers for any occasion with just a few taps using cool graphic interface 💅🛍️

![MiniApp user interface](./assets/interface.png)

## Features
- Neat and tidy UI adapted for different clients (iOS and Android)
- I18n support
- Implemented using Vue.js
- Does not use any UI-kit library


## Running locally

1. Creating Telegram bot and obtaining API token

Visit [this page](https://core.telegram.org/bots/features#botfather) for details.

<!-- 2. Setup `.env` in `/server` and `/webapp` folders

Manually create `.env` files following the structure in `.env.example` -->

2. Setup [ngrok](https://ngrok.com/docs/getting-started/) tunnels

As telegram only allows to open MiniApps available from the internet, we'll need to use ngrok to expose our app outside.
Follow [official docs](https://ngrok.com/docs/getting-started/) to install and authenticate ngrok. Then create ngrok [config](https://ngrok.com/docs/secure-tunnels/ngrok-agent/reference/config/) in order to be able instantiate several tunnels at once:

```
authtoken: yourTokenHere
tunnels:
  first:
    addr: 5173
    proto: http    
  second:
    addr: 3000
    proto: http
```

Once cofig file is created/updated, start ngrok with the following command:
```
ngrok start --all
```

3. Run server (dev mode)

    3.1. In separate terminal tab open server folder and create .env file:

    ```
    cd server
    cp .env.example .env
    ```

    Then edit `.env` file content as follows:

    ```
    # Telegram API Token. See https://core.telegram.org/bots/features#botfather
    TG_API_TOKEN=

    # Host of the web app. Put here url from ngrok output (the one that assigned to port 5173)
    WEB_APP_URL=

    # Current host. Put here url from ngrok output (the one that assigned to port 3000)
    HOST_URL=

    # Telegram Bot name. See https://core.telegram.org/bots/features#botfather
    BOT_NAME=

    PORT=3000

    # DEV=true if you want to run the bot in telegram test environment. Skip otherwise
    DEV=true
    ```


    3.2. Install dependencies
    ```
    yarn install
    ```

    3.3 Start
    ```
    yarn dev
    ```

4. Run client (dev mode)

    4.1. In separate terminal tab open server folder and create .env file:

    ```
    cd webapp
    cp .env.example .env
    ```

    Then edit `.env` file content as follows:

    ```
    # API host url. Put here url from ngrok output (the one that assigned to port 3000)
    VITE_API_URL=

    ```


    4.2. Install dependencies
    ```
    yarn install
    ```

    4.3 Start
    ```
    yarn dev
    ```


## Prod
For running prod version first fill in .env files (steps 3.1 and 4.1).
Then in root of the project run:

```
yarn prod
```

This command will install dependencies in both subprojects, build client and server and start the server
