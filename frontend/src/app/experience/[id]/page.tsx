import { Column, Heading, Meta, Schema, Text, Card, Row, Button, Tag, Flex } from "@once-ui-system/core";
import { workExperienceApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { WorkExperience } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return {};
  }

  try {
    const item = await workExperienceApi.get(numId);
    const title = `${item.job_title} at ${item.company_name}`;
    return Meta.generate({
      title,
      description: item.description,
      baseURL,
      image: item.company_logo ? item.company_logo : `/api/og/generate?title=${encodeURIComponent(title)}`,
      path: `/experience/${id}`,
    });
  } catch (e) {
    return Meta.generate({
      title: "Work Experience Detail",
      description: "Work experience history details",
      baseURL,
    });
  }
}

export default async function ExperienceDetail({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    notFound();
  }

  let work: WorkExperience | null = null;

  try {
    work = await workExperienceApi.get(numId);
  } catch (error) {
    console.error("Failed to fetch work experience:", error);
  }

  if (!work) {
    notFound();
  }

  const technologies = work.technologies_used
    ? work.technologies_used.split(",").map((t) => t.trim())
    : [];

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`${work.job_title} - ${work.company_name}`}
        description={work.description}
        path={`/experience/${id}`}
        image={work.company_logo ? work.company_logo : `/api/og/generate?title=${encodeURIComponent(work.company_name)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {work.job_title}
      </Heading>

      <Card padding="24">
        <Row gap="24" vertical="center" marginBottom="16">
          {work.company_logo && (
            <img 
              src={work.company_logo} 
              alt={work.company_name} 
              style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-m)' }} 
            />
          )}
          <Column>
            <Text variant="heading-strong-m">{work.company_name}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {work.location} • {work.work_mode || 'On-site'} • {work.employment_type || 'Full-time'}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {formatDate(work.start_date)} - {work.end_date ? formatDate(work.end_date) : 'Present'}
            </Text>
          </Column>
        </Row>

        <Text variant="heading-strong-s" marginTop="24">Description</Text>
        <Text variant="body-default-m" marginTop="8" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
          {work.description}
        </Text>

        {work.achievements && (
          <>
            <Text variant="heading-strong-s" marginTop="24">Key Achievements</Text>
            <Text variant="body-default-m" marginTop="8" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
              {work.achievements}
            </Text>
          </>
        )}

        {technologies.length > 0 && (
          <>
            <Text variant="heading-strong-s" marginTop="24" marginBottom="12">Technologies Used</Text>
            <Flex gap="8" wrap>
              {technologies.map((tech, idx) => (
                <Tag key={idx} size="m">
                  {tech}
                </Tag>
              ))}
            </Flex>
          </>
        )}
      </Card>

      <Row>
        <Button href="/experience" variant="tertiary">Back to experience</Button>
      </Row>
    </Column>
  );
}
