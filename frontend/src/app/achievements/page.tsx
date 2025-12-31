import { Column, Heading, Meta, Schema, Grid, Text, Card, SmartLink } from "@once-ui-system/core";
import { achievementsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Achievement } from "@/types";
import { formatDate } from "@/utils/formatDate";

export async function generateMetadata() {
  const title = "Achievements";
  const description = "A collection of awards, honors, and other recognitions.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/achievements",
  });
}

export default async function AchievementsPage() {
  let achievements: Achievement[] = [];
  try {
    const response = await achievementsApi.list({ ordering: '-date' });
    achievements = response.results;
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
  }

  const title = "Achievements";
  const description = "A collection of awards, honors, and other recognitions.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/achievements"
        image={`/api/og/generate?title=${encodeURIComponent(title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {title}
      </Heading>
      <Column fillWidth flex={1} gap="40" paddingX="l">
        {achievements.length > 0 ? (
          <Grid columns="3" m={{ columns: 2 }} s={{ columns: 1 }} fillWidth gap="24">
            {achievements.map((achievement) => {
              const slug = achievement.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
              return (
                <SmartLink key={achievement.id} href={`/achievements/${slug}`}>
                  <Card padding="24" gap="16" fillWidth>
                    {achievement.image && (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-m)', overflow: 'hidden', marginBottom: '8px' }}>
                        <img src={achievement.image} alt={achievement.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                      </div>
                    )}
                    <Heading variant="heading-strong-m">{achievement.title}</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {achievement.issuer}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {formatDate(achievement.date)}
                    </Text>
                    <Text variant="body-default-m">{achievement.description}</Text>
                  </Card>
                </SmartLink>
              );
            })}
          </Grid>
        ) : (
          <Text paddingX="l">No achievements found.</Text>
        )}
      </Column>
    </Column>
  );
}
