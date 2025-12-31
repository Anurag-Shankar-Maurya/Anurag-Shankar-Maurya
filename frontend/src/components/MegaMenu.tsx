"use client";

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
        <Text variant="body-default-s" onBackground="neutral-weak">{description}</Text>
      </Column>
    </Row>
  </SmartLink>
);

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
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
            <MenuLink href="/work" icon="folder" title="Projects" description="Featured case studies." onClose={onClose} />
            <MenuLink href="/blog" icon="book" title="Blog" description="My thoughts and articles." onClose={onClose} />
            <MenuLink href="/skills" icon="code" title="Skills" description="My technical capabilities." onClose={onClose} />
          </Column>

          {/* Column 3: Credentials */}
          <Column gap="24">
            <Heading variant="heading-strong-l">Credentials</Heading>
            <Line />
            <MenuLink href="/education" icon="education" title="Education" description="My academic background." onClose={onClose} />
            <MenuLink href="/certificates" icon="certificate" title="Certificates" description="My professional certifications." onClose={onClose} />
            <MenuLink href="/achievements" icon="award" title="Achievements" description="Awards and recognitions." onClose={onClose} />
            <MenuLink href="/testimonials" icon="quote" title="Testimonials" description="What others say about me." onClose={onClose} />
          </Column>
        </Grid>
      </div>
    </div>
  );
}
