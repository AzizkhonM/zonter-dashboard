"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const autoplayPlugin = Autoplay({
  delay: 3000,
  stopOnInteraction: false,
});

export function LeftPanelCarousel() {
  const t = useTranslations("RegisterCarousel");

  const slides = [
    {
      head: t("slides.0.head"),
      sub: t("slides.0.sub"),
    },
    {
      head: t("slides.1.head"),
      sub: t("slides.1.sub"),
    },
    {
      head: t("slides.2.head"),
      sub: t("slides.2.sub"),
    },
    {
      head: t("slides.3.head"),
      sub: t("slides.3.sub"),
    },
    {
      head: t("slides.4.head"),
      sub: t("slides.4.sub"),
    }
  ];

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
            <CarouselItem
              key={index}
              className="left-carousel-item"
            >
              <div className="slide-inner">
                <p className="slide-head">
                  {slide.head}
                </p>

                <p className="slide-sub">
                  {slide.sub}
                </p>
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
  overflow: hidden;
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
  overflow: hidden;
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