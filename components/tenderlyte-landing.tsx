"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dispatch, FormEvent, PointerEvent, RefObject, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { cartVariants, images, minerals, navItems, showcaseFeatures, storyCards } from "./tenderlyte-content";

function useHeroScroll(heroRef: RefObject<HTMLElement | null>, prefersReducedMotion: boolean | null) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const depth = Math.sin(progress * Math.PI);
        hero.style.setProperty("--hero-progress", progress.toFixed(3));
        hero.style.setProperty("--hero-depth", depth.toFixed(3));
        hero.style.setProperty("--hero-copy-y", `${Math.round(progress * -58)}px`);
        hero.style.setProperty("--hero-copy-opacity", `${gsap.utils.clamp(0.18, 1, 1 - progress * 1.45).toFixed(3)}`);
        hero.style.setProperty("--hero-product-y", `${Math.round(progress * 86)}px`);
        hero.style.setProperty("--hero-product-x", `${Math.round(progress * -28)}px`);
        hero.style.setProperty("--hero-product-rotate", `${(depth * 4.5).toFixed(2)}deg`);
        hero.style.setProperty("--hero-glass-y", `${Math.round(progress * -72)}px`);
      }
    });

    return () => trigger.kill();
  }, [heroRef, prefersReducedMotion]);
}

function useReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 42, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}

function useScrolledHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return isScrolled;
}

function useActiveSection() {
  type NavHref = (typeof navItems)[number]["href"];
  const [activeHref, setActiveHref] = useState<NavHref>(navItems[0].href);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash;
      if (navItems.some((item) => item.href === hash)) {
        const nextHash = hash as NavHref;
        setActiveHref((current) => (current === nextHash ? current : nextHash));
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  useEffect(() => {
    let frame = 0;

    const readActiveSection = () => {
      const scrollPosition = window.scrollY + 180;
      let current: NavHref = navItems[0].href;

      for (const item of navItems) {
        const section = document.querySelector<HTMLElement>(item.href);
        if (!section) continue;

        if (section.offsetTop <= scrollPosition) {
          current = item.href;
        }
      }

      setActiveHref((active) => (active === current ? active : current));
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(readActiveSection);
    };

    readActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [activeHref, setActiveHref] as const;
}

function ripple(event: PointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
  target.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
  target.classList.remove("is-rippling");
  void target.offsetWidth;
  target.classList.add("is-rippling");
}

function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const [activeHref, setActiveHref] = useActiveSection();
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  useEffect(() => {
    const measureIndicator = () => {
      const nav = navRef.current;
      const link = linkRefs.current[activeHref];

      if (!nav || !link) {
        setIndicator((current) => (current.visible ? { ...current, visible: false } : current));
        return;
      }

      const next = {
        left: link.offsetLeft + 16,
        width: Math.max(0, link.offsetWidth - 32),
        visible: true
      };

      setIndicator((current) =>
        current.left === next.left && current.width === next.width && current.visible === next.visible ? current : next
      );
    };

    measureIndicator();
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [activeHref]);

  return (
    <motion.header
      initial={{ x: "-50%", y: -24, opacity: 0 }}
      animate={{ x: "-50%", y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-4 z-50 flex min-h-[72px] w-[calc(100vw-32px)] max-w-7xl items-center justify-between rounded-full border border-white/20 bg-white/45 px-4 py-3 shadow-[0_20px_50px_rgba(8,44,33,0.1)] backdrop-blur-xl transition-all duration-700 sm:top-6 sm:w-[90%] md:min-h-[88px] md:px-10 md:py-4"
    >
      <a
        className="z-10 shrink-0 whitespace-nowrap font-display text-[22px] font-medium leading-none tracking-[-0.02em] text-forest-950 md:text-[40px] md:leading-[48px] md:tracking-[-0.04em]"
        href="#showcase"
        onClick={() => setActiveHref("#showcase")}
      >
        TenderLyte
      </a>
      <nav ref={navRef} className="absolute left-1/2 top-1/2 hidden h-11 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-1 text-xs font-bold uppercase tracking-[0.1em] text-muted lg:flex" aria-label="Primary navigation">
        <span
          className={`pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-[#4e6700] transition-[transform,width,opacity] duration-300 ease-out ${
            indicator.visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: `${indicator.width}px`,
            transform: `translate3d(${indicator.left}px, 0, 0)`
          }}
        />
        {navItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
          <a
            key={item.href}
            ref={(node) => {
              linkRefs.current[item.href] = node;
            }}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex h-11 items-center justify-center px-4 font-display transition-colors duration-300 ${
              isActive ? "text-[#4e6700]" : "text-ink/70 hover:text-[#4e6700]"
            }`}
            href={item.href}
            onClick={() => setActiveHref(item.href)}
          >
            <span className="relative z-10">{item.label}</span>
          </a>
          );
        })}
      </nav>
      <button
        className="z-10 shrink-0 whitespace-nowrap rounded-full bg-lime-400 px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[#536d00] shadow-lg transition-transform duration-500 hover:scale-105 md:px-8 md:text-xs"
        type="button"
        onClick={onOpenCart}
        onPointerDown={ripple}
      >
        Shop Now
      </button>
    </motion.header>
  );
}

function RemoteImage({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

function ShowcaseHero({ onOpenCart }: { onOpenCart: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const cardLoop = prefersReducedMotion
    ? undefined
    : {
        y: [0, -5, 0],
        boxShadow: [
          "0 20px 50px rgba(8, 44, 33, 0.05)",
          "0 26px 64px rgba(8, 44, 33, 0.12)",
          "0 20px 50px rgba(8, 44, 33, 0.05)"
        ]
      };

  return (
    <section id="showcase" className="hero-motion relative isolate h-[100svh] overflow-hidden px-6 md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.18)_0%,rgba(0,0,0,0.08)_36%,rgba(0,0,0,0.18)_100%)]" />
      <video
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[18px] saturate-90 brightness-110"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        poster={images.heroCoconut}
      >
        <source src="/mp_.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#04120d]/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center py-4 md:py-6">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <motion.div
            className="hero-scroll-copy flex max-w-none flex-col justify-center self-center"
            initial={{ y: 30, opacity: 0, filter: "blur(12px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e9ff92] md:text-[12px]">
              <span className="h-px w-9 bg-[#e9ff92]/85" />
              <span>Precision Hydration</span>
            </div>
            <h1 className="max-w-[9ch] font-display text-[clamp(36px,4.8vw,78px)] font-semibold leading-[0.92] tracking-[-0.04em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              Nature&apos;s Design,
              <br />
              <span className="text-[#c9ff35]">Perfected.</span>
            </h1>
            <p className="mt-4 max-w-xl font-display text-[14px] leading-6 text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)] md:text-[15px] md:leading-7">
              Experience the futuristic purity of TenderLyte. Harvested at the peak of vitality and preserved through advanced tetra-lock technology.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="button-primary" type="button" onClick={onOpenCart} onPointerDown={ripple}>
                Order A Sample Pack
              </button>
              <a className="button-ghost" href="#purity">
                Explore Purity
              </a>
            </div>

          </motion.div>

          <motion.div
            className="flex flex-col gap-4 self-center lg:justify-self-end"
            initial={{ y: 40, opacity: 0, scale: 0.965 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid w-full max-w-[620px] gap-3 sm:grid-cols-2 lg:gap-4">
              {showcaseFeatures.map(([icon, title, text, accent], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 14, scale: 0.965 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 18,
                    mass: 0.85,
                    delay: 0.08 + index * 0.04
                  }}
                >
                  <motion.div
                    animate={cardLoop}
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 5.2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                            delay: index * 0.18
                          }
                    }
                  >
                    <ShowcaseFeature icon={icon} title={title} text={text} accent={accent} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#00150e_0%,#082c21_100%)] px-6 py-28 text-white md:px-16 md:py-40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
          <div className="w-full md:w-1/2" data-reveal>
            <p className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.1em] text-lime-400">The Tech Behind The Taste</p>
            <h2 className="mb-8 font-display text-[32px] font-medium leading-[38px] tracking-[0] text-white md:text-[40px] md:leading-[48px] md:tracking-[-0.01em]">
              Clinical Purity, <br />Organic Spirit.
            </h2>
            <div className="space-y-6">
              <IconInfo icon="verified" title="Cold-Press Extraction" text="Advanced oxygen-free extraction maintains the complex nutrient profile often lost in traditional pasteurization." />
              <IconInfo icon="biotech" title="Molecular Sealing" text="Our aseptic filling technology ensures 12 months of shelf stability without a single preservative." />
            </div>
          </div>
          <div className="w-full md:w-1/2" data-reveal>
            <div className="glass-card relative aspect-video overflow-hidden rounded-[2rem] border-white/10">
              <Image src={images.lab} alt="Futuristic Lab Aesthetic" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60 transition-transform duration-1000 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
              <button className="absolute bottom-8 left-8 flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.1em] text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
                  <span className="material-symbols-outlined">play_arrow</span>
                </span>
                Watch Extraction Process
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-50 px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.1em] text-[#4e6700]">Lifestyle Integration</p>
              <h2 className="font-display text-[32px] font-medium leading-[38px] tracking-[0] text-forest-950 md:text-[40px] md:leading-[48px] md:tracking-[-0.01em]">
                Designed for the <br />Modern High-Performer.
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <span className="glass-card rounded-full px-6 py-2 font-display text-[10px] font-bold uppercase tracking-[0.1em] text-forest-950">Post-Workout</span>
              <span className="glass-card rounded-full px-6 py-2 font-display text-[10px] font-bold uppercase tracking-[0.1em] text-forest-950">Focus Aid</span>
              <span className="rounded-full bg-[#4e6700] px-6 py-2 font-display text-[10px] font-bold uppercase tracking-[0.1em] text-white">All Day</span>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-4 md:grid-rows-2">
            <BentoImage large src={images.athlete} title="Sustain Your Flow" text="For those who push boundaries, we provide the hydration to keep up with your vision." />
            <BentoImage src={images.work} title="Work Focus" text="Clean energy for the modern professional: clarity, order, and cellular restoration." />
            <BentoMetric value="99.9%" label="Natural Ingredients" />
            <BentoMetric value="0g" label="Added Sugar" />
            <BentoImage src={images.droplets} title="Rapid Absorption" text="Hypotonic hydration tuned for everyday recovery." />
          </div>
        </div>
      </section>
    </>
  );
}

function ShowcaseFeature({ icon, title, text, accent }: { icon: string; title: string; text: string; accent: string }) {
  return (
    <article className="glass-card flex min-h-[146px] flex-col rounded-[24px] border border-white/20 bg-[linear-gradient(180deg,rgba(201,255,53,0.18)_0%,rgba(255,255,255,0.08)_100%)] p-4 transition-all duration-700 hover:-translate-y-2 md:min-h-[154px] md:p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${accent} md:mb-4 md:h-11 md:w-11`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="mb-2 font-display text-[17px] font-medium leading-tight text-white md:text-[18px]">{title}</h3>
      <p className="max-w-[21ch] font-display text-[11px] font-medium leading-[1.35] text-white/80 md:text-[12px] md:leading-[1.4]">{text}</p>
    </article>
  );
}

function IconInfo({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-lime-400">{icon}</span>
      <div>
        <h4 className="font-display text-xs font-bold uppercase tracking-[0.1em] text-white">{title}</h4>
        <p className="leading-[1.55] text-[#aacfbe]">{text}</p>
      </div>
    </div>
  );
}

function BentoImage({ src, title, text, large = false }: { src: string; title: string; text: string; large?: boolean }) {
  return (
    <article className={`glass-card group relative min-h-[320px] overflow-hidden rounded-[2rem] md:min-h-0 ${large ? "md:col-span-2 md:row-span-2" : "md:col-span-1"}`} data-reveal>
      <Image src={src} alt={title} fill sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className="mb-2 font-display text-2xl font-medium">{title}</h3>
        <p className="max-w-xs text-sm leading-[1.55] text-white/80">{text}</p>
      </div>
    </article>
  );
}

function BentoMetric({ value, label }: { value: string; label: string }) {
  return (
    <article className="glass-card flex min-h-[220px] flex-col justify-end rounded-[2rem] p-8" data-reveal>
      <p className="font-display text-5xl font-semibold tracking-[-0.02em] text-forest-950">{value}</p>
      <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
    </article>
  );
}

function PurityScreen() {
  return (
    <section id="purity" className="bg-[#f3f3f4] py-28">
      <div className="mx-auto w-[min(1180px,calc(100vw-32px))] md:w-[min(1180px,calc(100vw-48px))]">
        <div className="text-center" data-reveal>
          <p className="eyebrow text-lime-400">Purity</p>
          <h2 className="section-title">Molecular Hydration <br />Redefined.</h2>
          <p className="mx-auto max-w-2xl text-lg leading-[1.55] text-muted">
            TenderLyte transitions from organic growth to medical-grade precision. Every drop is a symphony of electrolytes, filtered through nature and verified by science.
          </p>
        </div>
        <RemoteImage src={images.molecule} alt="Molecular hydration visualization" className="mt-14 aspect-[16/7] rounded-[40px] opacity-70 grayscale" />

        <div className="mt-24 grid items-center gap-12 md:grid-cols-2">
          <div data-reveal>
            <h3 className="section-title text-[clamp(32px,4vw,56px)]">EU Clean-Label Standards</h3>
            <p className="text-lg leading-[1.6] text-muted">
              We adhere to the world&apos;s most stringent purity protocols. Our process eliminates synthetic additives, ensuring that every sip contains only what the Earth intended.
            </p>
            <div className="mt-8 glass-panel inline-block p-6">
              <p className="eyebrow mb-1">ISO 9001 Certified</p>
              <p className="text-muted">Batch 0422 Verified</p>
            </div>
          </div>
          <div className="rounded-[32px] bg-forest-950 p-8 text-white" data-reveal>
            <h3 className="mb-4 font-display text-4xl">Purity Testing</h3>
            <p className="mb-10 text-white/75">Three-stage filtration combined with spectroscopic analysis ensures zero contaminants and perfect mineral retention.</p>
            <a className="font-display text-xs font-bold uppercase tracking-[0.1em] text-lime-300" href="#story">View Protocol</a>
          </div>
        </div>
      </div>

      <div className="mt-28 bg-forest-950 py-24 text-white">
        <div className="mx-auto w-[min(1180px,calc(100vw-32px))] text-center md:w-[min(1180px,calc(100vw-48px))]">
          <h2 className="section-title !text-white" data-reveal>The Mineral Matrix</h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60" data-reveal>Bio-available electrolytes engineered by nature to sync with your cellular rhythm.</p>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {minerals.map(([name, amount]) => (
              <div key={name} className="rounded-3xl border border-white/10 p-8" data-reveal>
                <p className="font-display text-4xl text-lime-300">{amount}</p>
                <h4 className="mt-6 font-display text-lg">{name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-28 grid w-[min(1180px,calc(100vw-32px))] items-center gap-10 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2">
        <RemoteImage src={images.droplets} alt="Hydration kinetics droplets" className="aspect-[4/5] rounded-[56px]" />
        <div data-reveal>
          <h3 className="section-title text-[clamp(36px,5vw,64px)]">Hydration Kinetics</h3>
          <p className="text-lg leading-[1.6] text-muted">
            Our research focuses on the osmotic balance of naturally occurring electrolytes. By maintaining the raw molecular structure of the coconut water, we achieve a bioavailability rate that exceeds synthetic isotonic drinks by up to 40%.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <InfoBlock title="Rapid Absorption" text="Hypotonic formula for instant cellular uptake." />
            <InfoBlock title="Zero Oxidation" text="Cold-press sealed to prevent nutrient degradation." />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryScreen() {
  return (
    <section id="story" className="bg-white">
      <div className="relative grid min-h-svh place-items-center overflow-hidden text-center text-white">
        <Image src={images.plantation} alt="Tropical coconut plantation" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest-950/45" />
        <div className="relative z-10 max-w-4xl px-6" data-reveal>
          <h2 className="mb-6 font-display text-[clamp(56px,8vw,112px)] font-semibold leading-none">Rooted in Purity</h2>
          <p className="mx-auto max-w-2xl text-xl leading-[1.55] text-white/80">
            Our journey begins in the heart of protected coastal groves, where the soil is rich with volcanic minerals and the air is washed by ocean breezes.
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-[min(1180px,calc(100vw-32px))] gap-12 py-28 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2">
        <div data-reveal>
          <h2 className="section-title">Sustainability is our Pulse</h2>
          <p className="text-lg leading-[1.6] text-muted">
            We don&apos;t just harvest; we heal. Every TenderLyte coconut comes from a zero-waste ecosystem. Husks are repurposed for bio-fuel, and every tree is managed using circular agricultural techniques that protect the local biodiversity.
          </p>
        </div>
        <RemoteImage src={images.coconutTree} alt="Young green coconut with dew" className="aspect-[4/5] rounded-[44px]" />
      </div>

      <div className="bg-forest-950 py-28 text-white">
        <div className="mx-auto w-[min(1180px,calc(100vw-32px))] md:w-[min(1180px,calc(100vw-48px))]">
          <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal>
              <h2 className="section-title !text-white">Ethical Sourcing Beyond Fairtrade</h2>
              <p className="text-white/60">Transparency is the bedrock of TenderLyte. We partner directly with family farms, ensuring living wages and community infrastructure development.</p>
            </div>
            <RemoteImage src={images.farmer} alt="Tropical farmer in orchard" className="aspect-[16/9] rounded-[36px]" />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {storyCards.map(([title, text]) => (
              <article key={title} className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl" data-reveal>
                <h3 className="mb-4 font-display text-2xl">{title}</h3>
                <p className="text-sm leading-[1.55] text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-[min(1180px,calc(100vw-32px))] items-center gap-10 py-28 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2">
        <RemoteImage src={images.filling} alt="Tetra Pak filling line" className="aspect-square rounded-[44px]" />
        <div data-reveal>
          <h2 className="section-title">Purity Locked in Light-Speed</h2>
          <div className="space-y-7">
            <InfoBlock title="Extraction" text="Closed-loop extraction ensures the water never touches oxygen, preserving delicate electrolytes." />
            <InfoBlock title="Aseptic Filling" text="Treated with flashes of light to eliminate bacteria without the heat that kills flavor." />
            <InfoBlock title="Tetra Pak Shield" text="6 layers of protection block UV rays and air, keeping it fresh for months with zero preservatives." />
          </div>
        </div>
      </div>
    </section>
  );
}

function LifestyleScreen() {
  return (
    <section id="lifestyle" className="bg-[#f9f9f9] py-28">
      <div className="mx-auto grid min-h-svh w-[min(1180px,calc(100vw-32px))] items-center gap-12 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-[0.8fr_1fr_0.8fr]">
        <div className="space-y-6" data-reveal>
          <p className="eyebrow text-muted/60">Origin 001</p>
          <h2 className="font-display text-[clamp(48px,5vw,72px)] font-semibold leading-none text-forest-950/30">Unfiltered<br />Silence.</h2>
          <p className="max-w-[240px] text-muted">The essence of hydration, stripped of noise. Purely from the source.</p>
        </div>
        <RemoteImage src={images.dropletHero} alt="Water droplet centerpiece" className="mx-auto aspect-[5/7] w-full max-w-[500px] rounded-[80px] shadow-ambient" />
        <div className="glass-panel p-8" data-reveal>
          <p className="mb-2 font-display text-2xl text-forest-950">99.9% Vital</p>
          <p className="text-muted">Electrolytes harvested in total darkness to preserve organic integrity.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-28 text-center" data-reveal>
        <h3 className="mb-[-20px] font-display text-[clamp(60px,10vw,140px)] leading-none text-forest-950/10">ESSENCE</h3>
        <p className="relative z-10 font-display text-[clamp(30px,5vw,56px)] font-light italic leading-tight text-forest-950">
          &quot;True purity isn&apos;t the presence of something good, but the absolute absence of everything else.&quot;
        </p>
        <div className="mx-auto my-10 h-24 w-px bg-gradient-to-b from-forest-950 to-transparent opacity-20" />
        <p className="eyebrow text-muted">The TenderLyte Manifesto</p>
      </div>

      <div className="mx-auto grid w-[min(1180px,calc(100vw-32px))] gap-8 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2">
        <RemoteImage src={images.jungleMist} alt="Lush jungle mist" className="aspect-[4/5] rounded-[44px]" />
        <div className="grid content-center gap-7" data-reveal>
          <h3 className="section-title">Micro-Filtered by Nature</h3>
          <p className="text-lg leading-[1.6] text-muted">Our coconuts are hand-selected at dawn, ensuring the water never touches the air until it hits your bottle.</p>
          <InfoBlock title="Bio-Available Electrolytes" text="Immediate absorption for cellular restoration. No synthetic minerals." />
          <InfoBlock title="Zero-React Glass" text="Bottled in medical-grade borosilicate to preserve the delicate alkalinity." />
        </div>
      </div>

      <div className="mx-auto mt-28 grid w-[min(1180px,calc(100vw-32px))] items-center gap-10 overflow-hidden rounded-[44px] bg-forest-950 p-8 text-white md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2 md:p-12">
        <RemoteImage src={images.coconutConcept} alt="Minimal coconut concept" className="aspect-[4/3] rounded-[32px] opacity-70" />
        <div data-reveal>
          <h3 className="section-title !text-white">Experience the Purity.</h3>
          <a className="button-primary mt-4" href="#contact" onPointerDown={ripple}>Reserve Your Pack</a>
        </div>
      </div>
    </section>
  );
}

function ContactScreen({ onOpenCart }: { onOpenCart: () => void }) {
  const [sent, setSent] = useState(false);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  }

  return (
    <section id="contact" className="bg-white py-28">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-32px))] items-center gap-12 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow text-lime-400">Premium Hydration</p>
          <h2 className="section-title">Pure Coconut <span className="text-moss-500">Essence</span></h2>
          <p className="text-lg leading-[1.6] text-muted">
            Experience the high-impact showcase of our premium coconut collection. Designed for the cinematic soul who demands clinical purity and organic vitality.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="button-primary" type="button" onClick={onOpenCart} onPointerDown={ripple}>Explore Shop</button>
            <a className="button-ghost" href="#story">Our Process</a>
          </div>
        </div>
        <RemoteImage src={images.cracked} alt="Freshly cracked organic coconut" className="aspect-[4/3] rounded-[36px]" priority />
      </div>

      <div className="mx-auto mt-24 w-[min(1180px,calc(100vw-32px))] md:w-[min(1180px,calc(100vw-48px))]">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div data-reveal>
            <h2 className="section-title">The Showcase</h2>
            <p className="max-w-md text-muted">Our curated selection of sustainable products, harvested at peak freshness.</p>
          </div>
          <a className="font-display text-sm font-bold text-forest-900" href="#showcase">View All</a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureImage src={images.handPicked} title="Hand-picked Quality" text="Sustainable harvesting from small-scale tropical farms." />
          <FeatureImage src={images.process} title="Eco-friendly Process" text="Carbon-neutral processing with zero waste protocols." />
          <FeatureImage src={images.bottle} title="Premium Aesthetics" text="Packaging designed to fit the modern luxury lifestyle." />
        </div>
      </div>

      <div className="mx-auto mt-28 grid w-[min(1180px,calc(100vw-32px))] gap-10 md:w-[min(1180px,calc(100vw-48px))] md:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal>
          <h2 className="section-title">Get in Touch</h2>
          <p className="text-lg leading-[1.6] text-muted">Have questions about our sourcing or wholesale opportunities? Our concierge team is ready to assist you in bringing purity to your lifestyle.</p>
          <div className="mt-8 space-y-5">
            <InfoBlock title="Flagship Store" text="Hayes and Harlington, The Charter Building, Charter Pl, Uxbridge UB8 1JG" />
            <InfoBlock title="General Inquiries" text="admin.tenderlyte@gmail.com" />
          </div>
        </div>
        <form className="glass-panel grid gap-5 p-8" onSubmit={submitForm} data-reveal>
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <label className="form-label">
            Message
            <textarea className="form-control min-h-28 resize-y" name="message" rows={4} />
          </label>
          <button className="button-primary" type="submit" onPointerDown={ripple}>{sent ? "Message ready" : "Contact Concierge"}</button>
        </form>
      </div>
    </section>
  );
}

function FeatureImage({ src, title, text }: { src: string; title: string; text: string }) {
  return (
    <article className="group overflow-hidden rounded-[32px] bg-white shadow-ambient" data-reveal>
      <RemoteImage src={src} alt={title} className="aspect-[4/3]" />
      <div className="p-7">
        <h3 className="mb-2 font-display text-2xl text-forest-950">{title}</h3>
        <p className="text-sm leading-[1.55] text-muted">{text}</p>
      </div>
    </article>
  );
}

function InfoBlock({ title, text, inverse = false }: { title: string; text: string; inverse?: boolean }) {
  return (
    <div>
      <h4 className={`mb-2 font-display text-xs font-bold uppercase tracking-[0.1em] ${inverse ? "text-white" : "text-forest-900"}`}>{title}</h4>
      <p className={`leading-[1.55] ${inverse ? "text-white/60" : "text-muted"}`}>{text}</p>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="form-label">
      {label}
      <input className="form-control" name={name} type={type} required={required} />
    </label>
  );
}

function Footer() {
  return (
    <footer className="bg-forest-950 py-14 text-white">
      <div className="mx-auto flex w-[min(1180px,calc(100vw-32px))] flex-col gap-8 md:w-[min(1180px,calc(100vw-48px))] md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">TenderLyte</h2>
          <p className="mt-3 max-w-sm text-white/50">Purity in every drop. Sustainable, organic, and obsessively precise.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-[0.1em] text-white/50">
          <a href="#">Privacy Policy</a>
          <a href="#">Sustainability</a>
          <a href="#">Stockists</a>
          <a href="#">Press</a>
        </div>
      </div>
    </footer>
  );
}

function CartModal({
  open,
  onClose,
  items,
  setItems
}: {
  open: boolean;
  onClose: () => void;
  items: Record<string, number>;
  setItems: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const totalCount = Object.values(items).reduce((sum, count) => sum + count, 0);

  const changeItem = (id: string, delta: number) => {
    setItems((current) => {
      const nextValue = Math.max(0, (current[id] ?? 0) + delta);
      return { ...current, [id]: nextValue };
    });
  };

  const resetItems = () => {
    setItems(Object.fromEntries(cartVariants.map((item) => [item.id, 0])) as Record<string, number>);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#04120d]/65 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.08)_100%)] text-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
            initial={{ y: 26, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-8">
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#e9ff92]">Cart</p>
                <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">TenderLyte</h2>
              </div>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                onClick={onClose}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid gap-6 px-5 py-6 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-8">
              <div className="grid gap-4">
                {cartVariants.map((item) => {
                  const quantity = items[item.id] ?? 0;
                  return (
                    <article key={item.id} className="glass-card rounded-[24px] border border-white/15 bg-white/10 p-4 md:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${item.accent}`}>
                            Product Option
                          </div>
                          <h3 className="font-display text-[18px] font-semibold text-white md:text-[20px]">{item.name}</h3>
                          <p className="mt-2 max-w-xl font-display text-sm leading-6 text-white/78">{item.description}</p>
                        </div>
                        <div className="flex min-w-[120px] items-center justify-end gap-2">
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                            onClick={() => changeItem(item.id, -1)}
                          >
                            <span className="material-symbols-outlined text-[20px]">remove</span>
                          </button>
                          <div className="flex h-10 w-12 items-center justify-center rounded-full bg-[#e9ff92] font-display text-sm font-bold text-[#2f4600]">
                            {quantity}
                          </div>
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                            onClick={() => changeItem(item.id, 1)}
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="glass-card flex flex-col justify-between rounded-[28px] border border-white/15 bg-white/10 p-5 md:p-6">
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#e9ff92]">Summary</p>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="font-display text-6xl font-semibold leading-none text-white">{totalCount}</span>
                    <span className="pb-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-white/65">units selected</span>
                  </div>
                  <p className="mt-4 max-w-sm font-display text-sm leading-6 text-white/75">
                    Build your order with either the single bottle or the 12-pack. No pricing, just a clean count and a premium cart view.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {cartVariants.map((item) => (
                      <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">{item.name}</p>
                        <p className="mt-2 font-display text-2xl font-semibold text-white">{items[item.id] ?? 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="button-primary" onClick={onClose}>
                    Continue Browsing
                  </button>
                  <button type="button" className="button-ghost" onClick={resetItems}>
                    Clear Cart
                  </button>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FloatingCartButton({
  count,
  onClick
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(201,255,53,0.95)_0%,rgba(233,255,146,0.92)_100%)] px-4 py-3 text-[#536d00] shadow-[0_20px_50px_rgba(8,44,33,0.2)] backdrop-blur-xl transition-transform duration-300 hover:scale-105 md:bottom-6 md:right-6"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#536d00] text-white">
        <span className="material-symbols-outlined">shopping_bag</span>
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-[#536d00]">
          {count}
        </span>
      </span>
      <span className="hidden font-display text-[11px] font-bold uppercase tracking-[0.12em] md:block">Cart</span>
    </button>
  );
}

export function TenderLyteLanding() {
  useReveal();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [items, setItems] = useState<Record<string, number>>(() =>
    Object.fromEntries(cartVariants.map((item) => [item.id, 0])) as Record<string, number>
  );
  const totalCount = Object.values(items).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <main>
        <ShowcaseHero onOpenCart={() => setIsCartOpen(true)} />
        <ProductShowcase />
        <PurityScreen />
        <StoryScreen />
        <LifestyleScreen />
        <ContactScreen onOpenCart={() => setIsCartOpen(true)} />
      </main>
      <Footer />
      <FloatingCartButton count={totalCount} onClick={() => setIsCartOpen(true)} />
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} items={items} setItems={setItems} />
    </>
  );
}
