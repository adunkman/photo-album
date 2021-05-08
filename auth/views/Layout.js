import deindent from "deindent";

export default (data = {}) => {
  return deindent(`
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>Log in • Andrew Dunkman</title>

        <meta charset="utf-8">
        <meta name="referrer" content="origin">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Enter your credentials to log in to Andrew Dunkman">
        <meta name="robots" content="noindex, nofollow">

        <link rel="shortcut icon" href="/login/icon.png">

        <style>
          html {
            box-sizing: border-box;
            font-family: Helvetica, Arial, sans-serif;
            font-kerning: normal;
            font-feature-settings: 'kern' 1;
            line-height: 1.5;
            text-rendering: optimizeLegibility;
            min-height: 100vh;
            background-color: #112f4e;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }

          body {
            width: 100%;
            max-width: 50ch;
            animation: dialog-slide-up 0.3s ease;
          }

          img {
            display: block;
            margin: 0 auto 2rem;
          }

          main {
            margin: 1rem;
            padding: 2rem;
            background-color: #fff;
            border-radius: 0.5rem;
            color: rgba(0, 0, 0, 0.9);
            position: relative;
          }

          main::before {
            display: block;
            content: '';
            width: 1rem;
            height: 1rem;
            position: absolute;
            top: -1rem;
            left: 50%;
            transform: translateX(-50%);
            border-left: .5rem transparent solid;
            border-right: .5rem transparent solid;
            border-bottom: .5rem #fff solid;
          }

          label {
            display: inline-block;
            margin-bottom: .5rem;
          }

          input {
            display: block;
            background-color: #fff;
            appearance: none;
            font-size: 1rem;
            font-family: inherit;
            font-weight: normal;
            line-height: inherit;
            border: 1px rgba(0, 0, 0, 0.3) solid;
            border-radius: 0.2rem;
            padding: 0.5rem 0.7rem;
            color: rgba(0, 0, 0, 0.9);
            box-shadow: inset 1px 1px 1px 0px rgba(0, 0, 0, 0.05);
            width: 100%;
            margin-bottom: 1.2rem;
          }

          button {
            appearance: none;
            display: inline-block;
            cursor: pointer;
            text-decoration: none;
            font-size: 1rem;
            font-family: inherit;
            font-style: normal;
            font-weight: bold;
            line-height: inherit;
            border: 1px transparent solid;
            border-radius: 0.2rem;
            padding: 0.5rem 0.7rem;
            transition: background-color 0.04s ease-out;
            color: rgba(255, 255, 255, 0.9);
            background-color: #0076d6;
          }

          button:hover {
            background-color: #2491ff;
          }

          button:active {
            background-color: #005ea2;
          }

          .cancel-link {
            display: inline-block;
            margin-left: 1rem;
            color: rgba(0, 0, 0, 0.5);
          }

          .notice {
            background-color: #e8f5ff;
            padding: 0.5rem 0.7rem;
            margin-bottom: 1.5rem;
            border-radius: .2rem;
            border: 1px #cfe8ff solid;
          }

          @keyframes dialog-slide-up {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
      </head>
      <body>
        <img src="/login/icon.png" width="64" height="64" alt="Cartoon drawing of Andrew Dunkman">
        <main>
          ${!data.message ? '' : `
            <div class="notice">${data.message}</div>
          `}

          ${data.content || ''}
        </main>
      </body>
    </html>
  `);
};
