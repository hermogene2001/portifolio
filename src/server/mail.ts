import "@tanstack/react-start/server-only"
import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

/*
  Sends contact-form messages to a Gmail inbox over Gmail SMTP.

  Required environment variables:
    GMAIL_USER          the Gmail address that sends the mail
    GMAIL_APP_PASSWORD  a 16-character Google "App Password" for that account
                        (Google account -> Security -> 2-Step Verification -> App passwords)
    CONTACT_TO          optional destination; defaults to GMAIL_USER
*/

type MailConfig = {
  user: string
  pass: string
  to: string
}

function config(): MailConfig {
  const user = (process.env.GMAIL_USER ?? "").trim()
  return {
    user,
    pass: (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""),
    to: (process.env.CONTACT_TO ?? "").trim() || user,
  }
}

export function mailConfigured() {
  const { user, pass } = config()
  return Boolean(user && pass)
}

let cachedTransporter: Transporter | null = null

function getTransporter(): Transporter {
  const { user, pass } = config()
  if (!user || !pass) {
    throw new Error(
      "Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD."
    )
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      // Nodemailer defaults to a 2-minute connection timeout, which can outlive
      // a serverless function's limit: the platform then kills the request and
      // the client sees an opaque (header-less) 502 instead of an error. Keep
      // every SMTP step short so we fail fast and return a real message.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
  }
  return cachedTransporter
}

/** Reject a promise if it does not settle within `ms`. */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

export type ContactMessage = {
  name: string
  email: string
  message: string
}

/** Remove CR/LF so user input can't inject extra mail headers. */
function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function sendContactEmail(msg: ContactMessage) {
  const { user, to } = config()
  const transporter = getTransporter()

  const name = singleLine(msg.name)
  const email = singleLine(msg.email)
  const subject = `Portfolio contact — ${name}`

  const text = [
    `New message from your portfolio contact form`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    ``,
    msg.message,
  ].join("\n")

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#302e4d;line-height:1.6">
      <h2 style="margin:0 0 12px;color:#f021b2">New portfolio message</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border:none;border-top:1px solid #e8dfec;margin:16px 0" />
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(msg.message)}</p>
    </div>
  `

  await withTimeout(
    transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
      html,
    }),
    20_000,
    "Sending your message timed out. Please try again in a moment."
  )
}
