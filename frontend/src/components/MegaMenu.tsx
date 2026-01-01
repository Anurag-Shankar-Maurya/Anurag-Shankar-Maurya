"use client";

import React, { useEffect, useRef } from "react";
import { Column, Grid, Heading, Row, Text, SmartLink, Line, Icon } from "@once-ui-system/core";
import styles from "./MegaMenu.module.scss";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuLink = ({ href, icon, title, description, onClose }: { href: string, icon: string, title: string, description: string, onClose: () => void }) => (
  <SmartLink href={href} onClick={onClose} className={styles.menuItem}>
    <Row gap="16" vertical="center">
      <Icon name={icon} size="m" />
      <Column gap="4">
        <Text variant="body-strong-m">{title}</Text>
        <Text variant="body-strong-s" onBackground="neutral-weak" className={styles.subtitle}>{description}</Text>
      </Column>
    </Row>
  </SmartLink>
);

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background from scrolling while menu is open
    document.documentElement.classList.add("no-scroll");

    const el = containerRef.current;

    // Move focus into the menu
    if (el) {
      const focusable = el.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      (focusable[0] as HTMLElement | undefined)?.focus();
    }

    // Trap keyboard focus and allow Escape to close
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab" && el) {
        const focusableEls = Array.from(
          el.querySelectorAll<HTMLElement>(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.container} ref={containerRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} aria-label="Close menu" onClick={onClose}>
          <Icon name="close" />
        </button>
        <Grid columns="3" m={{ columns: 1 }} gap="40" padding="40">
          {/* Column 1: Main Navigation */}
          <Column gap="24">
            <Heading variant="heading-strong-l">Explore</Heading>
            <Line />
            <MenuLink href="/about" icon="person" title="About Me" description="My background and story." onClose={onClose} />
            <MenuLink href="/gallery" icon="gallery" title="Gallery" description="A collection of visual works." onClose={onClose} />
          </Column>

          {/* Column 2: Portfolio */}
          <Column gap="24">
            <Heading variant="heading-strong-l">Portfolio</Heading>
            <Line />
            <MenuLink href="/work" icon="grid" title="Projects" description="Featured case studies." onClose={onClose} />
            <MenuLink href="/blog" icon="book" title="Blog" description="My thoughts and articles." onClose={onClose} />
            <MenuLink href="/skills" icon="rocket" title="Skills" description="My technical capabilities." onClose={onClose} />
          </Column>

          {/* Column 3: Credentials */}
          <Column gap="24">
            <Heading variant="heading-strong-l">Credentials</Heading>
            <Line />
            <MenuLink href="/education" icon="book" title="Education" description="My academic background." onClose={onClose} />
            <MenuLink href="/certificates" icon="document" title="Certificates" description="My professional certifications." onClose={onClose} />
            <MenuLink href="/achievements" icon="calendar" title="Achievements" description="Awards and recognitions." onClose={onClose} />
            <MenuLink href="/testimonials" icon="person" title="Testimonials" description="What others say about me." onClose={onClose} />
          </Column>
        </Grid>
      </div>
    </div>
  );
}
