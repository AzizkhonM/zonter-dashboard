"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function LeftPanelCarousel() {
  const t = useTranslations("RegisterCarousel");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [api, setApi] = React.useState<any>();

  React.useEffect(() => {
    setMounted(true);
    const savedIndex = localStorage.getItem("carouselIndex");
    if (savedIndex) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

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
    },
  ];

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      localStorage.setItem("carouselIndex", index.toString());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || !mounted) return;
    api.scrollTo(currentIndex);
  }, [api, mounted]);

  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    })
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="left-carousel-wrapper">
      <Carousel
        setApi={setApi}
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
  hover: cursor;
  user-select: none;
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
