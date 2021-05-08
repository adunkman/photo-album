import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import jwt from "jsonwebtoken";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import renderLoginForm from "../views/LoginForm";
import renderLoginEmail from "../views/LoginEmail";
import renderLayout from "../views/Layout";
import { toOpenableLink } from "./DataUriOpener";
import favicon from "../assets/images/favicon.png";

export const createServer = async () => {
  const server = Hapi.server({
    address: process.env.HOST || process.env.DOMAIN,
    port: process.env.PORT,
    compression: false,
  });

  await server.register(Cookie);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'authorization',
      password: process.env.COOKIE_ENCRYPTION_SECRET,
      isSecure: process.env.NODE_ENV === 'production',
      clearInvalid: true,
      ttl: 604800000, // 7 days
    },
    redirectTo: '/login',
    appendNext: 'returnTo',
    validateFunc: async (request, session) => {
      if (!session.email) {
        return { valid: false };
      }

      return { valid: true, credentials: { email: session.email } };
    },
  });

  server.auth.default('session');

  const SES = new SESClient();

  server.route([
    {
      method: 'GET',
      path: '/login',
      options: {
        auth: { mode: 'try' },
        plugins: {
          'hapi-auth-cookie': { redirectTo: false }
        },
        handler: async (request, h) => {
          if (request.auth.isAuthenticated) {
            return h.redirect('/');
          }

          return renderLoginForm({ returnTo: request.query.returnTo });
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      options: {
        auth: { mode: 'try' },
        handler: async (request, h) => {
          const { email, returnTo } = request.payload;

          if (!email) {
            return renderLoginForm({
              message: 'ℹ️ Please enter your email address to continue.',
              returnTo,
            });
          }

          if (email !== process.env.SUPPORT_EMAIL) {
            return renderLoginForm({
              message: 'ℹ️ Your email address is not allowed. Contact Andrew for permission to view his photos.',
              returnTo,
            });
          }

          const token = jwt.sign({}, process.env.JWT_ENCRYPTION_SECRET, {
            expiresIn: '10 minutes',
            notBefore: 0,
            audience: `urn:${process.env.DOMAIN}:verify`,
            issuer: `urn:${process.env.DOMAIN}:auth`,
            subject: `${email}`.toLowerCase(),
          });

          const message = renderLoginEmail({
            token,
            returnTo,
            baseUrl: process.env.NODE_ENV === "production"
              ? `https://${process.env.DOMAIN}`
              : `http://localhost:${process.env.PORT}`
          });

          if (process.env.NODE_ENV === "production") {
            try {
              await SES.send(new SendEmailCommand({
                Source: `notifications@${process.env.DOMAIN}`,
                ReplyToAddresses: [ process.env.SUPPORT_EMAIL ],
                ReturnPath: process.env.SUPPORT_EMAIL,
                Destination: { ToAddresses: [ email ] },
                Message: {
                  Subject: {
                    Data: `🔒 Your login information for ${process.env.DOMAIN}`,
                    Charset: 'UTF-8',
                  },
                  Body: {
                    Html: { Data: message.html, Charset: 'UTF-8' },
                    Text: { Data: message.text, Charset: 'UTF-8' },
                  }
                }
              }));
            }
            catch (err) {
              console.log(err);

              return renderLoginForm({
                message: `⚠️ Uh oh! Your login information failed to send (${err.message}). Enter your email address to try again, or contact Andrew for assistance.`,
                email,
                returnTo,
              });
            }

            return renderLayout({ content: '📤 Check your email to continue.' });
          }
          else {
            const html = toOpenableLink(`data:text/html;base64,${Buffer.from(message.html).toString('base64')}`);
            const text = toOpenableLink(`data:text/plain;base64,${Buffer.from(message.text).toString('base64')}`);

            return renderLayout({ content: `Check your (<a href="${html}">fake HTML email</a>, <a href="${text}">fake text email</a>, <a href="${message.link}">verify link</a>) to continue.` });
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/verify',
      options: {
        auth: { mode: 'try' },
      },
      handler: (request, h) => {
        const { token, returnTo } = request.query;

        if (!token) {
          return h.redirect('/');
        }

        try {
          const { sub: email } = jwt.verify(token, process.env.JWT_ENCRYPTION_SECRET, {
            audience: `urn:${process.env.DOMAIN}:verify`,
            issuer: `urn:${process.env.DOMAIN}:auth`,
          });

          request.cookieAuth.set({ email });
          return h.redirect(returnTo || '/');
        }
        catch (err) {
          if (err.name === 'TokenExpiredError') {
            return renderLoginForm({
              message: '⚠️ The link is no longer valid. Enter your email address to try again, or contact Andrew for assistance.',
              returnTo,
            });
          }

          if (err.name === 'JsonWebTokenError') {
            return renderLoginForm({
              message: `⚠️ The token is corrupt (${err.message}). Enter your email address to try again, or contact Andrew for assistance.`,
              returnTo,
            });
          }

          return renderLoginForm({
            message: `⚠️ An unexpected error occurred. Enter your email address to try again, or contact Andrew for assistance.`,
            returnTo,
          });
        }
      },
    },
    {
      method: 'GET',
      path: '/logout',
      handler: (request, h) => {
        request.cookieAuth.clear();
        return h.redirect('/');
      },
    },
    {
      method: 'GET',
      path: '/login/icon.png',
      options: {
        auth: { mode: 'try' },
      },
      handler: (request, h) => {
        const buffer = Buffer.from(favicon.split(',')[1], 'base64');
        return h.response(buffer).bytes(buffer.length).type("image/png");
      },
    },
  ]);

  return server;
};
