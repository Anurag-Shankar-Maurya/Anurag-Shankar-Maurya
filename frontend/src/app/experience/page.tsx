import { Column, Heading, Meta, Schema, Text, Card, Row, SmartLink } from "@once-ui-system/core";
import { workExperienceApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { WorkExperience } from "@/types";
import { formatDate } from "@/utils/formatDate";

export async function generateMetadata() {
  const title = "Work Experience";
  const description = "A detailed overview of my professional experience and employment history.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/experience",
  });
}

export default async function ExperiencePage() {
  let workExperienceHistory: WorkExperience[] = [];
  try {
    const response = await workExperienceApi.list({ ordering: '-start_date' });
    workExperienceHistory = response.results;
  } catch (error) {
    console.error("Failed to fetch work experience history:", error);
  }

  const title = "Work Experience";
  const description = "A detailed overview of my professional experience and employment history.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/experience"
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
        {workExperienceHistory.length > 0 ? (
          <Column fillWidth gap="24">
            {workExperienceHistory.map((work) => (
              <SmartLink key={work.id} href={`/experience/${work.id}`}>
                <Card padding="24" fillWidth>
                  <Row gap="24" vertical="start">
                    {work.company_logo && (
                      <img 
                        src={work.company_logo}
                        alt={work.company_name}
                        style={{ width: '64px', height: '64px', objectFit: 'contain', flexShrink: 0 }}
                      />
                    )}
                    <Column gap="12" flex={1}>
                      <Heading variant="heading-strong-m">{work.job_title}</Heading>
                      <Text variant="body-strong-m" onBackground="neutral-weak">
                        {work.company_name} • {work.work_mode || 'On-site'}
                      </Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {formatDate(work.start_date)} - {work.end_date ? formatDate(work.end_date) : 'Present'}
                      </Text>
                      {work.description && (
                        <Text variant="body-default-m" marginTop="8" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {work.description}
                        </Text>
                      )}
                    </Column>
                  </Row>
                </Card>
              </SmartLink>
            ))}
          </Column>
        ) : (
          <Text paddingX="l">No work experience history found.</Text>
        )}
      </Column>
    </Column>
  );
}
