import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { TOPICS } from "@/lib/newsletter/topics";
import { getNewsletterProvider } from "@/server/newsletter/index.server";
import { NewsletterError, type NewsletterErrorKind } from "@/server/newsletter/provider";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  topics: z.array(z.enum(TOPICS)).min(1),
  // Honeypot: hidden from people, so only bots fill it in.
  website: z.string().optional(),
});

export type SubscribeResult = { ok: true } | { ok: false; error: NewsletterErrorKind };

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: z.input<typeof subscribeSchema>) => subscribeSchema.parse(input))
  .handler(async ({ data }): Promise<SubscribeResult> => {
    // Pretend it worked so bots don't learn to skip the field.
    if (data.website) return { ok: true };

    try {
      const ip = getRequestIP({ xForwardedFor: true });
      await getNewsletterProvider().subscribe({
        email: data.email,
        topics: [...new Set(data.topics)],
        consentedAt: new Date(),
        ...(ip ? { ip } : {}),
      });
      return { ok: true };
    } catch (error) {
      if (error instanceof NewsletterError) return { ok: false, error: error.kind };
      console.error(error);
      return { ok: false, error: "unavailable" };
    }
  });
