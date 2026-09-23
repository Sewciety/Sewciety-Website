import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { Bell, Megaphone, Newspaper, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic } from "@/lib/newsletter/topics";
import { subscribeToNewsletter } from "@/lib/newsletter/subscribe.functions";
import flatlay from "@/assets/polaroid-flatlay.jpg";
import embroidery from "@/assets/embroidery-hoop.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Sewciety — The Sewing Club at the University of Waterloo",
      },
      {
        name: "description",
        content:
          "Stay in the loop with Sewciety, the sewing club at the University of Waterloo. Event alerts, club announcements, and a low-inbox bi-weekly newsletter.",
      },
      {
        property: "og:title",
        content: "Sewciety — The Sewing Club at the University of Waterloo",
      },
      {
        property: "og:description",
        content:
          "Event alerts, club announcements, and a bi-weekly newsletter from UW's sewing club.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const STAY_IN_LOOP_OPTIONS = [
  {
    id: "alerts",
    icon: Bell,
    title: "Event Alerts",
    body: "Instant notifications for sewing classes, socials, and applications so you can grab a spot before they fill up.",
  },
  {
    id: "announcements",
    icon: Megaphone,
    title: "Club & Community Announcements",
    body: "General updates like team updates, new equipment, and website launches.",
  },
  {
    id: "newsletter",
    icon: Newspaper,
    title: "The Bi-Weekly Newsletter",
    body: "A low-inbox bi-weekly recap every other Saturday with photos, project showcases, and highlights of what we've been up to.",
    note: "(Note: Workshop registration often opens and closes between issues!)",
  },
] as const;

type FormError = "invalid_email" | "no_topics" | "unavailable";

const FORM_ERROR_MESSAGES: Record<FormError, string> = {
  invalid_email: "Valid email required",
  no_topics: "Pick at least one option above",
  unavailable: "Something went wrong, try again",
};

function Tape({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-7 w-24 rounded-[1px] bg-tape shadow-sm",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)",
      }}
    />
  );
}

function ButtonDeco({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle
        cx="20"
        cy="20"
        r="17"
        fill={color}
        stroke="rgba(90,60,30,0.18)"
        strokeWidth="2"
      />
      {[13.5, 26.5].map((y) =>
        [13.5, 26.5].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="rgba(255,255,255,0.7)" />
        ))
      )}
    </svg>
  );
}

function StarDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2c.7 5.2 4.8 9.3 10 10-5.2.7-9.3 4.8-10 10-.7-5.2-4.8-9.3-10-10 5.2-.7 9.3-4.8 10-10z"
        fill="var(--color-butter)"
        stroke="rgba(120,90,40,0.25)"
        strokeWidth="1"
      />
    </svg>
  );
}

function ThreadSwash() {
  return (
    <svg viewBox="0 0 260 24" className="mx-auto mt-1 h-6 w-56" aria-hidden>
      <path
        d="M6 14 C 60 4, 120 22, 180 10 S 250 12, 254 10"
        fill="none"
        stroke="var(--color-stitch)"
        strokeWidth="2"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="14" r="3" fill="var(--color-stitch)" />
    </svg>
  );
}

function Index() {
  const [selected, setSelected] = useState<Set<Topic>>(new Set(["alerts"]));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  // Honeypot, see subscribeToNewsletter.
  const [website, setWebsite] = useState("");

  function toggle(id: Topic) {
    if (error === "no_topics") setError(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("invalid_email");
      return;
    }
    if (selected.size === 0) {
      setError("no_topics");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await subscribeToNewsletter({
        data: { email, topics: [...selected], website },
      });
      if (result.ok) {
        setSubscribed(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError("unavailable");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* scattered scrapbook decorations */}
      <ButtonDeco
        color="var(--color-butter)"
        className="absolute left-[3%] top-24 hidden h-11 w-11 -rotate-12 lg:block"
      />
      <StarDeco className="absolute right-[5%] top-40 hidden h-8 w-8 rotate-12 lg:block" />
      <ButtonDeco
        color="var(--color-sage)"
        className="absolute bottom-48 left-[4%] hidden h-9 w-9 rotate-6 lg:block"
      />
      <ButtonDeco
        color="var(--color-blush)"
        className="absolute bottom-24 right-[4%] hidden h-12 w-12 -rotate-6 lg:block"
      />
      <StarDeco className="absolute right-[10%] top-[52%] hidden h-6 w-6 -rotate-12 lg:block" />

      <main className="relative mx-auto max-w-3xl px-6 pb-10 pt-16">
        {/* Title */}
        <header className="relative text-center">
          <Tape className="left-[6%] top-0 -rotate-12" />
          <Tape className="right-[6%] top-0 rotate-12" />
          <h1 className="font-display text-7xl text-primary md:text-8xl">
            Sewciety
          </h1>
          <ThreadSwash />
          <p className="mt-3 text-lg text-foreground md:text-xl">
            The Sewing Club at the University of Waterloo
          </p>

          {/* polaroids */}
          <div className="relative mx-auto mt-12 flex max-w-xl items-start justify-center">
            <figure className="relative -rotate-6 rounded-sm bg-card p-3 pb-10 shadow-lg">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <img
                src={flatlay}
                alt="Pastel thread spools, lace, and buttons laid out on cream linen"
                className="h-56 w-44 object-cover"
              />
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-lg text-muted-foreground">
                spools &amp; lace
              </figcaption>
            </figure>
            <figure className="relative ml-[-1.5rem] mt-10 rotate-3 rounded-sm bg-card p-3 pb-10 shadow-lg">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
              <img
                src={embroidery}
                alt="Hands embroidering a pink tulip on an embroidery hoop"
                className="h-56 w-44 object-cover"
              />
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-lg text-muted-foreground">
                stitch by stitch
              </figcaption>
            </figure>
          </div>
        </header>

        {/* Newsletter */}
        <section className="mt-24">
          <div className="text-center">
            <h2 className="font-display text-5xl text-primary md:text-6xl">
              Stay in the Loop
            </h2>
            <p className="mt-3 font-hand text-2xl text-foreground">
              Pick how you'd like to hear from us:
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-5">
            {STAY_IN_LOOP_OPTIONS.map((option) => {
              const Icon = option.icon;
              const checked = selected.has(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggle(option.id)}
                  aria-pressed={checked}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-lg border-2 border-dashed p-5 text-left shadow-sm transition-all",
                    checked
                      ? "border-primary bg-primary/5"
                      : "border-stitch/40 bg-card hover:border-stitch/70"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-stitch/50 bg-background"
                    )}
                  >
                    {checked && (
                      <svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5 6.5 12 13 4" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-stitch" aria-hidden />
                      <span className="text-lg font-semibold text-foreground">
                        {option.title}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      {option.body}
                    </span>
                    {"note" in option && option.note && (
                      <span className="mt-2 block font-hand text-lg leading-snug text-stitch">
                        {option.note}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubscribe}
            noValidate
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-2.5"
          >
            {subscribed ? (
              <div className="rounded-lg border-2 border-dashed border-stitch/60 bg-card px-6 py-6 text-center shadow-sm">
                <p className="font-hand text-3xl text-foreground">
                  You're on the list!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep an eye on {email.trim()} — thread talk is coming your way.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="newsletter-email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email address
                  </label>
                  {error && (
                    <p role="alert" className="font-hand text-xl leading-none text-destructive">
                      {FORM_ERROR_MESSAGES[error]}
                    </p>
                  )}
                </div>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error === "invalid_email") setError(null);
                  }}
                  placeholder="Enter your uwaterloo or personal email"
                  aria-invalid={error === "invalid_email"}
                  className={cn(
                    "h-12 w-full rounded-md border-2 bg-card px-4 shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70",
                    error === "invalid_email"
                      ? "border-destructive bg-destructive/5"
                      : "border-stitch/40 focus:border-primary"
                  )}
                />
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-13 w-full rounded-md bg-primary py-3.5 font-hand text-2xl text-primary-foreground shadow-md transition-transform hover:-rotate-[0.5deg] hover:scale-[1.01] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
              </>
            )}
          </form>
        </section>

        {/* Coming soon */}
        <section className="mt-24">
          <div className="relative mx-auto max-w-xl rounded-md border-2 border-dashed border-stitch/50 bg-card px-8 py-14 text-center shadow-md">
            <Tape className="-top-3.5 left-1/2 -translate-x-1/2 -rotate-2" />
            <div className="absolute right-6 top-6 rotate-6" aria-hidden>
              <div className="flex h-16 w-14 items-center justify-center rounded-sm border-2 border-dashed border-stitch/50 bg-secondary/60">
                <Scissors className="h-6 w-6 text-stitch" />
              </div>
            </div>
            <h2 className="font-display text-5xl text-primary md:text-6xl">
              Full Website Coming Soon...
            </h2>
            <p className="mt-4 font-hand text-3xl text-foreground">Stay tuned!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe above and you'll be the first to know when we launch.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
