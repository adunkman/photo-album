import deindent from "deindent";

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
            a { color: #005ea2; }
            a:hover { color: #0076d6; }
            a:active { color: #0b4778; }
            .button { transition: background-color 0.04s ease-out; }
            .button:hover {
              background-color: #2491ff !important;
            }

            .button:active {
              background-color: #005ea2 !important;
            }
          </style>
        </head>
        <body bgcolor="#112f4e" style="margin: 0; font-family: helvetica, arial, sans-serif; line-height: 1.5; text-rendering: optimizeLegibility;">
          <table bgcolor="#112f4e" style="color: #ffffff; padding: 30px 10px;" width="100%">
            <tr>
              <td align="center">
                <table width="100%" bgcolor="#ffffff" style="max-width: 600px; color: #000000; padding: 10px; border-radius: 10px;">
                  <tr>
                    <td style="padding: 15px;">
                      <p style="margin: 0 0 20px;">Someone has requested to log in to <a href="${data.baseUrl}">${data.baseUrl}</a> using this email address. If it was you, click the link below within 10 minutes to verify your email and continue logging in.</p>
                      <a href="${link}" class="button" style="display: inline-block; text-decoration: none; font-weight: bold; border-radius: 5px; padding: 10px 15px; background-color: #0076d6; color: #fff;">Verify your email</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; color: #a1d3ff;">
                  <tr>
                    <td align="center" style="padding: 40px 0 10px;">
                      Received this email by mistake? Reply to let me know.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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
