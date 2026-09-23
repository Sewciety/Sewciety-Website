import type { Topic } from "@/lib/newsletter/topics";
import { NewsletterError, type NewsletterProvider, type SubscribeInput } from "./provider";

const API_URL = "https://connect.mailerlite.com/api";

// MailerLite group for each topic. IDs aren't secret, so they live here.
const GROUP_IDS: Record<Topic, string> = {
  alerts: "199434029647267804",
  announcements: "199434036195624147",
  newsletter: "199434039967351821",
};

// MailerLite expects "yyyy-MM-dd HH:mm:ss" in UTC.
function formatTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function createMailerLiteProvider(apiToken: string): NewsletterProvider {
  return {
    async subscribe({ email, topics, consentedAt, ip }: SubscribeInput) {
      // Upserts: an existing subscriber is updated and the groups are added
      // alongside any they already belong to. `status` is left unset so the
      // account's double opt-in setting applies.
      const response = await fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          groups: topics.map((topic) => GROUP_IDS[topic]),
          opted_in_at: formatTimestamp(consentedAt),
          ...(ip ? { optin_ip: ip } : {}),
        }),
      });

      if (response.ok) return;

      if (response.status === 422) {
        throw new NewsletterError("invalid_email", "MailerLite rejected the email address");
      }

      const body = await response.text().catch(() => "");
      console.error(`MailerLite subscribe failed (${response.status}): ${body}`);
      throw new NewsletterError("unavailable", "Newsletter provider request failed");
    },
  };
}
