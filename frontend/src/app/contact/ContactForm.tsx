"use client";

import { useState } from "react";
import { Button, Column, Heading, Input, Row, Text, Tag, IconButton } from "@once-ui-system/core";
import { contactApi } from "@/lib";
import type { ProfileDetail } from "@/types/api.types";

interface ContactFormProps {
  profile: ProfileDetail | null;
}

export function ContactForm({ profile }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emailStr: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    
    setEmailError("");
    setStatus("sending");
    try {
      await contactApi.submit({ name, email, subject, message });
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Failed to send contact message:", error);
      setStatus("error");
    }
  };

  return (
    <Row fillWidth gap="xl" s={{ direction: "column" }} style={{ marginTop: "24px" }}>
      {/* Left side: Contact Details */}
      <Column fillWidth gap="m" maxWidth="xs">
        <Heading variant="heading-strong-l">Get in Touch</Heading>
        <Text onBackground="neutral-weak" style={{ lineHeight: "1.6" }}>
          I&apos;m currently available for freelance projects and open to full-time opportunities.
          If you have a project that needs some creative injection, then that&apos;s where I come in!
        </Text>

        <Column gap="12" style={{ marginTop: "16px" }}>
          {profile?.email && (
            <Column padding="16" radius="m" background="surface" border="neutral-alpha-weak">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                Email me at
              </Text>
              <Text variant="body-strong-m" style={{ marginTop: "4px" }}>
                <a href={`mailto:${profile.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {profile.email}
                </a>
              </Text>
            </Column>
          )}

          {profile?.location && (
            <Column padding="16" radius="m" background="surface" border="neutral-alpha-weak">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                Based in
              </Text>
              <Text variant="body-strong-m" style={{ marginTop: "4px" }}>
                {profile.location}
              </Text>
            </Column>
          )}
        </Column>

        {profile?.social_links && profile.social_links.length > 0 && (
          <Column gap="12" style={{ marginTop: "24px" }}>
            <Text variant="label-default-s" onBackground="neutral-weak">Connect on Social</Text>
            <Row gap="8" wrap>
              {profile.social_links.map((link) => (
                <IconButton
                  key={link.id}
                  href={link.url}
                  icon={link.platform}
                  tooltip={link.platform}
                  size="m"
                  variant="ghost"
                />
              ))}
            </Row>
          </Column>
        )}
      </Column>

      {/* Right side: Contact Form */}
      <Column fillWidth padding="24" radius="l" background="surface" border="neutral-alpha-weak">
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            id="name"
            label="Name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="email"
            label="Email"
            placeholder="john@example.com"
            type="email"
            required
            value={email}
            errorMessage={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
          />

          <Input
            id="subject"
            label="Subject"
            placeholder="Project Inquiry"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Column gap="4">
            <label htmlFor="message" style={{ fontSize: "var(--text-label-default-s-font-size)", fontWeight: "var(--font-weight-semibold)", color: "var(--neutral-text-strong)" }}>
              Message
            </label>
            <textarea
              required
              id="message"
              name="message"
              rows={5}
              placeholder="Tell me about your project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--neutral-border)",
                background: "var(--neutral-background-weak)",
                color: "var(--neutral-text-strong)",
                fontFamily: "inherit",
                fontSize: "var(--text-body-default-m-font-size)",
                lineHeight: "var(--text-body-default-m-line-height)",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-solid)";
                e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-alpha-weak)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--neutral-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Column>

          <Button
            type="submit"
            variant="primary"
            fillWidth
            style={{ marginTop: "8px" }}
            suffixIcon="arrowRight"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </Button>

          {status === "success" && (
            <Tag variant="green" size="l" style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
              Message sent successfully! I&apos;ll get back to you soon.
            </Tag>
          )}

          {status === "error" && (
            <Tag variant="red" size="l" style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
              Something went wrong. Please try again later.
            </Tag>
          )}
        </form>
      </Column>
    </Row>
  );
}
