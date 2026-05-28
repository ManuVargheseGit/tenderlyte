"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FormEvent, PointerEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

const images = {
  heroCoconut: "/assets/tenderlyte-hero-coconut.png",
  coconutSplit:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqo2cPHwiLImWNGLSOPNHBjctsxgegQiRW0yelZp-HBN3Oo9Lf6CXgR9T4TavtVWWc0C1yqc1tn0M4x-ChAyBfOhnC67DtSCiWqT-h5pWhsh502jZKu6e77vTqUSG73viMb8vbkMtgr0SQpJv0NwjwrNajiAOeJ6A2U-4ZPGb62T3pwqyz735oYs9uUhY0aEnf22bKv86i4fruWShyMjXIdtPQ-TNnEb6PTa5VHTSKIhXteuzEES6u6jpdDL9aT_ojdHJOGkMLr0",
  lab:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoknTXjm6W3lKmHb_mDdTJvhBhDALVPB3ME_yFRXWzcQKi5ABOGN_X2JjmScMqpRs--Jn3NM_l7KDtvf-v7otnZmZeTenrftnoYZQjK164PffWrVNZsPyLueH2Y2gUHFdT0y3P9hN8D3w8k0RlxuN3CeABw8lOhSbi9u4QQqIqYStgLcbTErBUDLtJLA801O34ya5fiTnEGK9IQRsQawH27BbmcZ6Luc-kaFbUx_c1fyiGgdLEFskNYGZnt-9wPGKaxorsxOyJISo",
  athlete:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDjn9nKkOtaFrLwG_MR3nPMnamotgJf8sRBqexupO-OaTtg18Odf4rHziIY2XD-dqGtWsTo7fkG3RdQuh42MKC1Wy7yLhkHAEY6eTuAdmyflfmLJPsb4RNjaWyTmQMI5YXiw4tJWSGYDGNSE9GSUnFEvWJfbiNFWpUb_02a5jxTh-5aV9vQsaGbp2csx7VFQ3dKZGXc8lOvm4vc1fmoxJWV9h2GSEPwAYJHnykPvZ98byHd8hBWbBzWtvXBL9DMZrGAa_xcecf27PQ",
  work:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyA-JGmZtdlzbk18prej0HGxc2Js1h6B5Di8y7Dn0_OpzS9HgzXPu6mrIm9l396frKHqLYmoMlBHlNejX8-eLM1Ts6r8U2bt5TtK6QrQftA2L7Jyp_yPckguADfZt35PcmU2FY4GNoCFF_I1fsm0GtcxTiRvQcmq6HaZralt_UuAtFrZLcZupvRAG0BugxPS8h2ZmNdd6e5YUfFOfTVSCUMSTIDvmlrA7Fu3Cs0-5nLpDkjZVBS-lzl_ed9LxQyf3k_GTZbT4SNIM",
  molecule:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6lEEr0ZxDwRhLigKaQwtMvtiqzI_dhVWMjsajBpwOOKyQ73xpJ30rypxAgloIXVjelUBZ5kZOn7hI-wAG2earm6M11hxvMAQag-QkBKBlsdwgdDUKMUoIUUZn03LPZOalk71IzoooKPvdXZxjiPHnQmnle8DIhFQD7RqJODzNLXSz7HTR_XDrPxTJwkC9r-7CiWG6OKf69-Sjv9x2VqUiJDgeSE9cJ3WZCSYv4cE0RONMp9do5hsat6WyahbU8DFlgYEHQwpYg6c",
  droplets:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDByyaKXl_W2e75ZQS0fk9trkktSZ4HqubQrxnVbcJT29kYEXg_Hln0Vv7bzy5bARB6NEH_fEy6y4deweObdrpErUz4EIub7lIXYDCovzkKlAfYw6_zykDuShmD3W2fn1kEof8cV4cbV62xLU2eeunWKFaREtc9qch9AQLplDrKPqBH1IHk5DnKYbAY1kFqLYGxMKCgYBVOH2Mz4OREl5S98TEiLRMb-tm3_fEeO5jkRnVf_0CXdBhl5BIWE4LAjz0hZKqRiBXDKOw",
  plantation:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBoxOzeDE5cZkjqdSRwV7J9HC0XgrEuQc9X9mZ22ceyxxqJM-_LKjLuaTmYuNYTqKHvAzscAFcmmqC06Qr3LQZyKCpUfFsSHd95jpn3mFA1OYvoas0dIGnGEB_kbg53sn1mjKwoQWI03SXbi6CJ_us8uhhP_4H_eb7e2e7cw5XxkTO5Zh-qAFiQIjn21qG_X_vM8L-S9U62pJ5i0AZAx8PWwBadbIiZE4U14bkDpvUaj5OyJa1s09WemJHUBwEaodQB8b0pjvB3OmY",
  coconutTree:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBWvmgq63Lw7VZ46dk2shBJM9TUfZNgjNrHjNEOW3Q8709MXEQIYN6zyd7ehQqIGR2HlTqdATbjRlPKdMPTnOFjAa7L_sNAJKXZdr-Q5sGt6GXwr_pGRxlufZOtkGO-Rn63NzUo4IXyXq0FI3e1Nqf2iuKi6NkBXvAyzklEN_Mrt6IOF3vye0OprQJlkm89ossnY5SPmJq1UZZv6DGh0r7tDbCSlEaZolF7QGbtH471LXjO9-0WvucEhfSUrgQ3GFE1MzbhOUQzF2Q",
  farmer:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6oTMYCeLOAbNeJ-_FbQU1qCjsrnsiKRXFfIGzwWYg7hyLE45UFNBAoU2jRuC_ZFQorhpi62NNlfNCV6jXuxkpFC-W3G0LCfM22P6qo-s0R7bEcFerQlREkokB6vCL7vQ3679gOM_pfWd4t-6zv6jcfWy2V1q6jvQYQLF45sEIvD8CN8spQTjSdDhjwKorspk5QoWqli-csVaMDL57YbQiIuqFZ_Ley8TqCgZi15d04U1ahbq-fGSih-fmcTG1AaQ-eMOG_Yqu8lk",
  filling:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNTU8tC10MsBC7xRFgCak0UR7w0mhuApjK99U0CHpNBVnGCRBhB6kjfKzayGoxsq3oJrr2zjj16UOhKnR8ZLYLuXHKHQBIkOEK2XC1UiIzoPHu4dvx6lLqmZwaCKpCurb6Lq-Cm8nJ5Bngao5J3RLGNjjcU758M7-ffEYHTklJgbj-uKVzTN1ecsizfKQX7b6yNPFKbCkZhvNDsN24VrgnYp-FHSVINUfrRsm-Aep6WJO1m_W6TUhlx-p4qLtiMtTfWwz1gDOw4jw",
  sunset:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDMORwyHeoQsW2wnVJ1hITUKZk3cfKlswnOPptM_Th1UVLuG7cPXwZv_esdMJ5l1FfkXOV8qcU3p2yt47F4t2h6ZOfoot6lVpUiQVUEdJQlUNJL_FE_4kTmYZa8e3ZsSkVwm9DZDeu9ozAke4xEm-zpAZVcCidC3Ga5hGCtbmDMwUsHOEhiTRXcZuWw2o7PAfU7FqSG9_Q-if7bLXA1TdhAmIo6LS3Za4EXSWTh8a7WEoE8QplEv54hnqumFLViJoUzru74n1avikE",
  dropletHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDgSr9BDcOMTSw6Bsj4-de9zzHDlBxTG8dpFHgfZdJr4D-R_2znGb1O1QrUO_Eq9HDq8i9_Mfgm6lHYhkjs-cIoJcCpOhOUNE3GLKmlhG2MB1ZU1ftxUlTJmslxouePX3NwRgBWnnizXHhdkrc9ApxyTB4heC_rAU0N9doyWDbWp9WU8DBF7LehYUoPnejoZ2rpTxeNxtFE13TXQQB0VrCp0xR6inF0VY8x668ZYagqPOiKh2rLFEOs4tRacabTTO40KlAKIL44_HA",
  jungleMist:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTOTT_IT5DY_dGyvNKB_jf34Dlq37PqelC1Vkh3wxn3Iq-LNgn41NK59oCXyNbEtRlufaqgsT1yiv1eVo89B9cOlHpp5BL7sj2VeBWvBvX_slICBWQwIOQS7j-Jc26Nhoe9mU7AfpXgoRZsLRu8T8htApsnqIcNC1hmHrPGxHjF4IV7_HxJAZESNLBTAac3fcSM8BMbIPWa1JXp6wiqpoMZc6AtJYBv4JK2XfNrtziudYO3UGusQyrRhihst5biokUEdqNcojK-a0",
  coconutConcept:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfEw7Fu7JKUQOSAnBCyupc0wSq__XXPCWvgNKJ-dzJNZe7kfcKCxnDawtkPWNL3psEobM25iwXSLF57bCgVhK7mqLKAekEjRYU1NirHdbQreSG-rTNhNOBnfETu-_rNwhoeg5n13rTrwQiiomOIyT0QObFfMmNeJ5T-27PHV5dMk4166qEdXqS75Q0IggarQVF2lKjeJRXO1OCQ5DdI6UEqE0shTp6blhLoqYxz72rQidrKtcwhCvgoeP3hgqZ2xt5z2jFHlw802E",
  cracked:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAx4-PHLy5pwjVXDzWq-jP6d6TeFD1s-p_wOAlIqO_cLnzkVz_Elp-ymZwqzbD3voZmLiCb3-xzJpmzHncQvoclQ8NDKJYNTbjq4ZL4soz-0ljeuvN9WwdXoA1BGk659pdrpk0onDppMKO7xO2HkZMLXOahpYr8fNIQru6N-0jNzMORU7RJ6qzFA4tiohfqRF-AR8ARGURgDUq475ICTeiyEJqzgVh3kg5DNn_ObwvnXvVX6CnGCvcviCtLdJt-vLH3y9jZFhnjG-g",
  handPicked:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAiQoJhEI3d8YhU1x5nVZA4-l-swAw53pX_tSnSTff8Jrcgn6UvapcKnpJA1a5kdu18anm8gTs6JCJDXPZ9jZVzxJhGNJADjW-sz6rr6iu1XG7egupZj_CpNnfLpgkVjSW7hSIfGVKvTQ72TRc64iuUxsZvCtgmA2Y2apLkT7DwHkkKpMBwL9z9ucKmjdpr2Pspo6jViZURSrMwUY4CfHdl1hlAARcZ5IcB95jffRfISrS9vQJ01VDi2zupw7ayQHWcSvGgi4nBXjA",
  process:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZvnNSuJbfUZ0-iIKuyvS8ZYwGguat9dTHYNb_0IOg2qJPZbLFgVdGsHmUVmSbIedGm_SGg3V4Rx2H37kuzIGESwDPBt1vvw_4NVVIG5ri2lOwVMnn4nCPyi1Xf79-pgURpEiPstQFb-gzo_N4OJEs0aNQlFtJUVz4gm8rylLmTWyI4Il-zm65TtGobZ0W9_wNq0p-2OtLHwk4TWcAn1_sYmuKFUqOqootJWS5bg4mmOl8ITzqADWgq7VGezY4OG6NweFNnrbpuUo",
  bottle:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCqB1a6CcgEy0UyD5bxF9l9YT3S4_YnPF2B8yRmDabfcVi_zC4M-Va7x9O7E0-8tDqof6Nn-_WnctI4ARl1LWch1eO7bU32nRvGKYOAG-u-cQLIuU0aeSZLt_YFvIGmlqO5QtFIBxwgDa6HXcGMolWnKL7fCjlPjHi7tU77hE4X310UxahrfBOmKmSbnwet0PATIGGrZfxCle3EJFfDXzvWjeFG0LreTDXq1VS8ocNAVnv6nJTAlmQdl3Olv7mTcsddrqOBBiOEYMA"
};

const navItems = [
  { href: "#showcase", label: "Showcase" },
  { href: "#purity", label: "Purity" },
  { href: "#story", label: "Story" },
  { href: "#lifestyle", label: "Lifestyle" },
  { href: "#contact", label: "Contact" }
];

const showcaseFeatures = [
  ["bolt", "Natural Electrolytes", "Bio-available minerals for instant cellular recovery and peak cognitive performance.", "bg-lime-400 text-[#536d00]"],
  ["water_drop", "No Added Sugar", "Pure, unadulterated hydration with a naturally sweet profile from heritage palms.", "bg-[#c5ebda] text-[#002117]"],
  ["energy_savings_leaf", "Fresh Daily", "Harvested every 24 hours to ensure the enzymatic vitality of our signature water.", "bg-[#e0e3e1] text-[#181c1b]"],
  ["package_2", "Eco-Purity", "100% recyclable Tetra Pak packaging designed to block UV rays and preserve taste.", "bg-forest-900 text-white"]
];

const minerals = [
  ["Potassium", "690mg"],
  ["Magnesium", "60mg"],
  ["Sodium", "45mg"],
  ["Calcium", "58mg"]
];

const storyCards = [
  ["Direct Farmer Equity", "Our pricing model guarantees 40% above market value, allowing our farming communities to thrive and invest in their local education systems."],
  ["100% Traceable", "Scan your pack to see exactly which farm your water came from."],
  ["Education Fund", "5% of every sale goes directly to the TenderLyte Scholars initiative in India."],
  ["Biodiversity Protection", "We protect 2 acres of rainforest for every 1 acre of coconut plantation we manage."]
];

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
  const [activeHref, setActiveHref] = useState(navItems[0].href);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash;
      if (navItems.some((item) => item.href === hash)) {
        setActiveHref((current) => (current === hash ? current : hash));
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
      let current = navItems[0].href;

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

function Header() {
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
      <a
        className="z-10 shrink-0 whitespace-nowrap rounded-full bg-lime-400 px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[#536d00] shadow-lg transition-transform duration-500 hover:scale-105 md:px-8 md:text-xs"
        href="#contact"
        onClick={() => setActiveHref("#contact")}
        onPointerDown={ripple}
      >
        Shop Now
      </a>
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

function ShowcaseHero() {
  return (
    <section id="showcase" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 md:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f9f9f9_0%,#e8e8e8_100%)]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-forest-950/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-[500px] w-[500px] rounded-full bg-[#4e6700]/5 blur-[150px]" />

      <motion.div
        className="relative z-10 mb-16 max-w-4xl text-center"
        initial={{ y: 42, opacity: 0, filter: "blur(12px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.2em] text-[#4e6700]">Precision Hydration</p>
        <h1 className="mb-6 font-display text-[48px] font-semibold leading-[52px] tracking-[-0.02em] text-forest-950 md:text-[84px] md:leading-[92px] md:tracking-[-0.04em]">
          Nature&apos;s Design, <br />
          <span className="text-[#4e6700]">Perfected.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-7 text-muted">
          Experience the futuristic purity of TenderLyte. Harvested at the peak of vitality and preserved through advanced tetra-lock technology.
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-between gap-10 md:flex-row md:gap-16"
        initial={{ y: 54, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex w-full flex-col gap-6 md:w-1/4">
          {showcaseFeatures.slice(0, 2).map(([icon, title, text, accent]) => (
            <ShowcaseFeature key={title} icon={icon} title={title} text={text} accent={accent} />
          ))}
        </div>
        <div className="relative flex w-full flex-col items-center md:w-2/4">
          <div className="relative aspect-square w-full max-w-[500px]">
            <Image src={images.heroCoconut} alt="Ultra-realistic 3D tender coconut splash" fill priority sizes="(max-width: 768px) 92vw, 500px" className="object-contain mix-blend-multiply drop-shadow-[0_30px_70px_rgba(8,44,33,0.16)]" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6 md:w-1/4">
          {showcaseFeatures.slice(2).map(([icon, title, text, accent]) => (
            <ShowcaseFeature key={title} icon={icon} title={title} text={text} accent={accent} />
          ))}
        </div>
      </motion.div>
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
    <article className="glass-card rounded-3xl p-8 transition-all duration-700 hover:-translate-y-2" data-reveal>
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="mb-2 font-display text-[20px] font-medium leading-tight text-forest-950">{title}</h3>
      <p className="text-sm leading-[1.55] text-muted">{text}</p>
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

function ContactScreen() {
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
            <a className="button-primary" href="#showcase" onPointerDown={ripple}>Explore Shop</a>
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

export function TenderLyteLanding() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <ShowcaseHero />
        <ProductShowcase />
        <PurityScreen />
        <StoryScreen />
        <LifestyleScreen />
        <ContactScreen />
      </main>
      <Footer />
    </>
  );
}
