"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const slides = [
  {
    head: "This is not a tournament tool. It is a tournament operating system.",
    sub: "Build, manage, and control CS2 competitions like infrastructure — not spreadsheets.",
  },
  {
    head: "You don't join tournaments. You control them.",
    sub: "Design brackets, define rules, and run competitive systems with precision.",
  },
  {
    head: "Built for organizers, not spectators.",
    sub: "Every feature is designed for people who create structure, not consume it.",
  },
  {
    head: "Competition needs structure. Zonter is that structure.",
    sub: "From small community cups to university leagues — everything stays organized.",
  },
  {
    head: "A new layer for competitive CS2 infrastructure.",
    sub: "Not a platform. Not a dashboard. A control layer for esports operations.",
  },
];

const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: false });

export function LeftPanelCarousel() {
  const plugin = React.useRef(autoplayPlugin);

  return (
    <div className="left-carousel-wrapper">
      <Carousel
        plugins={[plugin.current]}
        orientation="vertical"
        opts={{ align: "start", loop: true }}
        className="left-carousel"
      >
        <CarouselContent className="left-carousel-content">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="left-carousel-item">
              <div className="slide-inner">
                <p className="slide-head">{slide.head}</p>
                <p className="slide-sub">{slide.sub}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <style>{`
.left-carousel-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  overflow: hidden; /* ← shu */
}

        .left-carousel {
          width: 100%;
          max-width: 420px;
        }

.left-carousel-content {
  height: 200px;
}

.left-carousel-item {
  height: 200px;
  display: flex;
  align-items: center;
  overflow: hidden; /* ← item ichidan ham chiqmasin */
}   

.slide-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

        .slide-head {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-white);
          line-height: 1.25;
          letter-spacing: -0.4px;
        }

        .slide-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
