import type { Topic } from "@/lib/newsletter/topics";

// The rest of the app talks to this interface, never to a specific email
// service. Swapping MailerLite for another provider (or our own system) means
// writing a new implementation, not touching the form or future dashboard.
export interface NewsletterProvider {
  subscribe(input: SubscribeInput): Promise<void>;
}

export type SubscribeInput = {
  email: string;
  topics: Topic[];
  // Kept as proof of consent for CASL.
  consentedAt: Date;
  ip?: string;
};

export type NewsletterErrorKind = "invalid_email" | "unavailable";

export class NewsletterError extends Error {
  constructor(
    readonly kind: NewsletterErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "NewsletterError";
  }
}
