import { Column, Heading, Meta, Schema, Text, Card, Row, Tag, Button } from "@once-ui-system/core";
import { skillsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Skill } from "@/types";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const slug = params.slug;
  const query = slug.replace(/[-]/g, " ");
  try {
    const resp = await skillsApi.list({});
    const item = resp.results.find((s) => s.name && s.name.toLowerCase().replace(/\s+/g, "-") === slug);
    const title = item ? item.name : `Skill – ${slug}`;
    const description = item ? `${item.name} — ${item.proficiency || ''}` : '';
    return Meta.generate({ title, description, baseURL, path: `/skills/${slug}` });
  } catch (e) {
    return Meta.generate({ title: `Skill – ${slug}`, description: '', baseURL });
  }
}

export default async function SkillDetail({ params }: Props) {
  const { slug } = params;
  const searchQuery = slug.replace(/-/g, " ");

  let skill: Skill | null = null;

  try {
    const resp = await skillsApi.list({});
    if (resp && resp.results && resp.results.length > 0) {
      skill = resp.results.find((s) => s.name && s.name.toLowerCase().replace(/\s+/g, "-") === slug) || resp.results[0];
    }
  } catch (error) {
    console.error("Failed to fetch skill:", error);
  }

  if (!skill) {
    notFound();
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema as="webPage" baseURL={baseURL} title={skill.name} description={`${skill.name} — ${skill.proficiency}`} path={`/skills/${slug}`} author={{ name: person.name, url: `${baseURL}/about`, image: `${baseURL}${person.avatar}` }} />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">{skill.name}</Heading>

      <Card padding="24">
        <Row gap="12">
          {skill.icon && <Tag size="l" prefixIcon={skill.icon}>{skill.proficiency}</Tag>}
          <Text variant="body-default-s" onBackground="neutral-weak">Type: {skill.skill_type || 'Other'}</Text>
        </Row>
      </Card>

      <Row>
        <Button href="/skills" variant="tertiary">Back to skills</Button>
      </Row>
    </Column>
  );
}
