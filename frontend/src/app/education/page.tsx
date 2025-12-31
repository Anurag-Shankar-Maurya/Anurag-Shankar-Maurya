import { Column, Heading, Meta, Schema, Text, Card, Row, SmartLink } from "@once-ui-system/core";
import { educationApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Education } from "@/types";
import { formatDate } from "@/utils/formatDate";

export async function generateMetadata() {
  const title = "Education";
  const description = "A summary of academic background and qualifications.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/education",
  });
}

export default async function EducationPage() {
  let educationHistory: Education[] = [];
  try {
    const response = await educationApi.list({ ordering: '-start_date' });
    educationHistory = response.results;
  } catch (error) {
    console.error("Failed to fetch education history:", error);
  }

  const title = "Education";
  const description = "A summary of academic background and qualifications.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/education"
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
        {educationHistory.length > 0 ? (
          <Column fillWidth gap="24">
            {educationHistory.map((edu) => {
              const slug = edu.institution.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
              return (
                <SmartLink key={edu.id} href={`/education/${slug}`}>
                  <Card padding="24" fillWidth>
                    <Row gap="24" vertical="start">
                      {edu.logo && (
                        <img 
                          src={edu.logo}
                          alt={edu.institution}
                          style={{ width: '64px', height: '64px', objectFit: 'contain', flexShrink: 0 }}
                        />
                      )}
                      <Column gap="12" flex={1}>
                        <Heading variant="heading-strong-m">{edu.institution}</Heading>
                        <Text variant="body-strong-m" onBackground="neutral-weak">
                          {edu.degree} in {edu.field_of_study}
                        </Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                        </Text>
                        {edu.description && (
                          <Text variant="body-default-m" marginTop="8">{edu.description}</Text>
                        )}
                      </Column>
                    </Row>
                  </Card>
                </SmartLink>
              );
            })}
          </Column>
        ) : (
          <Text paddingX="l">No education history found.</Text>
        )}
      </Column>
    </Column>
  );
}
