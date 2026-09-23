import { createMailerLiteProvider } from "./mailerlite.server";
import { NewsletterError, type NewsletterProvider } from "./provider";

export function getNewsletterProvider(): NewsletterProvider {
  const token = process.env["MAILERLITE_API_TOKEN"];
  if (!token) {
    console.error("MAILERLITE_API_TOKEN is not set");
    throw new NewsletterError("unavailable", "Newsletter provider is not configured");
  }
  return createMailerLiteProvider(token);
}
