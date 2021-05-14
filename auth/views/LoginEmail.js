import deindent from "deindent";

import favicon from "../assets/images/favicon.png";

export default (data = {}) => {
  const link = new URL('/verify', data.baseUrl);
  link.searchParams.set("token", data.token)

  if (data.returnTo) {
    link.searchParams.set("returnTo", data.returnTo)
  }

  return {
    link,
    subject: 'Your login information 🔒',
    html: deindent(`
      <!DOCTYPE html>
      <html lang="en-us">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">

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

            .button {
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

            .button:hover {
              background-color: #2491ff;
            }

            .button:active {
              background-color: #005ea2;
            }
          </style>
        </head>
        <body>
          <img src="${favicon}" width="64" height="64" alt="Cartoon drawing of Andrew Dunkman">
          <main>
            <p style="margin: 0 0 1rem;">Someone has requested to log in to <a href="${data.baseUrl}">${data.baseUrl}</a> using this email address. If it was you, click the link below within 10 minutes to verify your email and continue logging in.</p>
            <a href="${link}" class="button" target="_blank">Verify your email</a>
          </main>
        </body>
      </html>
    `),
    text: deindent(`
      Someone has requested to log in to ${data.baseUrl} using this email address.
      If it was you, visit the link below within 10 minutes to verify your email address and continue logging in.

      Verify your email: ${link}
    `),
  };
};
