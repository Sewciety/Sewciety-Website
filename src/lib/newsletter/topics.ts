// The mailing-list topics a visitor can opt into. Shared by the signup form and
// the server so the two can't drift apart.
export const TOPICS = ["alerts", "announcements", "newsletter"] as const;

export type Topic = (typeof TOPICS)[number];
