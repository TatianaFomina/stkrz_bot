# MiniApp Client
Web application that is opened inside webview telegram client. Serves as graphic user interface to telegram bot. Uses [Vue3](https://vuejs.org/guide/introduction.html) as UI framework and [telegram-web-app](https://core.telegram.org/bots/webapps#designing-mini-apps) library to to connect to Telegram App.
## Environment variables

|  Variable | Description  |
|---|---|
| VITE_API_URL  |  API host url. Put here url from ngrok output (the one that assigned to port 3000) |


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

4. Start or build

      4.a. Start in dev mode

      ```
      yarn dev
      ```

      4.b. Build for prod

      ```
      yarn build
      ```

