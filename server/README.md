# MiniApp Server
Server-side NodeJS application responsible for serving static files and handling users' messages to chat with bot.
Uses [fastify](https://fastify.dev/) as a web framework and [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api) to to interact with the official Telegram Bot API.

## Environment variables

|  Variable | Description  |
|---|---|
| TG_API_TOKEN  |  Telegram API Token. See https://core.telegram.org/bots/features#botfather |
| WEB_APP_URL  |  Host of the web app. Put here url from ngrok output (the one that assigned to port 5173) |
| HOST_URL  |  Current host. Put here url from ngrok output (the one that assigned to port 3000) |
| BOT_NAME  |  Telegram Bot name. See https://core.telegram.org/bots/features#botfather |
| PORT  |  Server port. Default is 3000 |
| DEV  |  Set `true` if you want to run the bot in telegram test environment. Skip otherwise |


## Run instructions
1. create .env file:

    ```
    cd server
    cp .env.example .env
    ```

2. Fill in variables with your values

3. Install dependencies

    ```
    yarn install
    ```

4. Start

      4.a. Dev mode

      ```
      yarn dev
      ```

      4.b. Prod mode (make sure yout build client first, as it's going to access client build files)

      ```
      yarn build
      node build/index.js
      ```

