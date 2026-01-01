import { Column, Heading, Meta, Schema, Text, Card, Row, Button } from "@once-ui-system/core";
import { educationApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Education } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const query = slug.replace(/[-]/g, " ");
  try {
    const resp = await educationApi.list({ ordering: '-start_date' });
    const item = resp.results.find((e) => e.institution && e.institution.toLowerCase().replace(/\s+/g, "-") === slug);
    const title = item ? `${item.degree} – ${item.institution}` : `Education – ${slug}`;
    return Meta.generate({ title, description: item?.description || '', baseURL, path: `/education/${slug}` });
  } catch (e) {
    return Meta.generate({ title: `Education – ${slug}`, description: '', baseURL });
  }
}

export default async function EducationDetail({ params }: Props) {
  const { slug } = await params;
  const searchQuery = slug.replace(/-/g, " ");

  let edu: Education | null = null;

  try {
    const resp = await educationApi.list({ ordering: '-start_date' });
    if (resp && resp.results && resp.results.length > 0) {
      edu = resp.results.find((e) => e.institution && e.institution.toLowerCase().replace(/\s+/g, "-") === slug) || resp.results[0];
    }
  } catch (error) {
    console.error("Failed to fetch education:", error);
  }

  if (!edu) {
    notFound();
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`${edu.degree} - ${edu.institution}`}
        description={edu.description || ''}
        path={`/education/${slug}`}
        image={edu.logo ? edu.logo : `/api/og/generate?title=${encodeURIComponent(edu.institution)}`}
        author={{ name: person.name, url: `${baseURL}/about`, image: `${baseURL}${person.avatar}` }}
      />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">{edu.institution}</Heading>

      <Card padding="24">
        {edu.logo && <img src={edu.logo} alt={edu.institution} style={{ width: 88, height: 88, objectFit: 'contain', marginBottom: 12 }} />}

        <Text variant="body-strong-m" onBackground="neutral-weak">{edu.degree} • {edu.field_of_study}</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">{formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}</Text>

        {edu.description && <Text marginTop="12" variant="body-default-m">{edu.description}</Text>}
      </Card>

      <Row>
        <Button href="/education" variant="tertiary">Back to education</Button>
      </Row>
    </Column>
  );
}
