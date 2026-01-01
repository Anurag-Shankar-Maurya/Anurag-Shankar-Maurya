import { Column, Heading, Meta, Schema, Text, Card, Button, Row } from "@once-ui-system/core";
import { achievementsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Achievement } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  // best effort: search by slug-like title
  const query = slug.replace(/[-]/g, " ");
  try {
    const resp = await achievementsApi.list({ search: query });
    const item = resp.results.find((a) => a.title && a.title.toLowerCase().replace(/\s+/g, "-") === slug);
    const title = item ? item.title : `Achievement – ${slug}`;
    return Meta.generate({
      title,
      description: item?.description || "Achievement detail",
      baseURL,
      image: item?.image ? item.image : `/api/og/generate?title=${encodeURIComponent(title)}`,
      path: `/achievements/${slug}`,
    });
  } catch (e) {
    return Meta.generate({
      title: `Achievement – ${slug}`,
      description: "Achievement detail",
      baseURL,
    });
  }
}

export default async function AchievementDetail({ params }: Props) {
  const { slug } = await params;
  const searchQuery = slug.replace(/-/g, " ");

  let achievement: Achievement | null = null;

  try {
    const resp = await achievementsApi.list({ search: searchQuery });
    if (resp && resp.results && resp.results.length > 0) {
      // prefer exact slug match on title if possible
      achievement = resp.results.find((a) => a.title && a.title.toLowerCase().replace(/\s+/g, "-") === slug) || resp.results[0];
    }
  } catch (error) {
    console.error("Failed to fetch achievement:", error);
  }

  if (!achievement) {
    notFound();
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={achievement.title}
        description={achievement.description || ''}
        path={`/achievements/${slug}`}
        image={achievement.image ? achievement.image : `/api/og/generate?title=${encodeURIComponent(achievement.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {achievement.title}
      </Heading>

      <Card padding="24">
        {achievement.image && (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--radius-m)', marginBottom: '12px' }}>
            <img src={achievement.image} alt={achievement.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <Text variant="body-default-s" onBackground="neutral-weak">{achievement.issuer} • {formatDate(achievement.date)}</Text>
        {achievement.description && (
          <Text variant="body-default-m" marginTop="12">{achievement.description}</Text>
        )}

        {achievement.url && (
          <Row paddingTop="16">
            <Button href={achievement.url} target="_blank" variant="secondary">View Source</Button>
          </Row>
        )}
      </Card>

      <Row>
        <Button href="/achievements" variant="tertiary">Back to achievements</Button>
      </Row>
    </Column>
  );
}
