import { Column, Heading, Meta, Schema, Text, Card, Button, Row } from "@once-ui-system/core";
import { certificatesApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Certificate } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const query = slug.replace(/[-]/g, " ");
  try {
    const resp = await certificatesApi.list({ search: query });
    const item = resp.results.find((c) => c.title && c.title.toLowerCase().replace(/\s+/g, "-") === slug);
    const title = item ? item.title : `Certificate – ${slug}`;
    return Meta.generate({
      title,
      description: item?.description || "Certificate detail",
      baseURL,
      image: item?.certificate_image ? item.certificate_image : `/api/og/generate?title=${encodeURIComponent(title)}`,
      path: `/certificates/${slug}`,
    });
  } catch (e) {
    return Meta.generate({ title: `Certificate – ${slug}`, description: '', baseURL });
  }
}

export default async function CertificateDetail({ params }: Props) {
  const { slug } = await params;
  const searchQuery = slug.replace(/-/g, " ");

  let cert: Certificate | null = null;

  try {
    const resp = await certificatesApi.list({ search: searchQuery });
    if (resp && resp.results && resp.results.length > 0) {
      cert = resp.results.find((c) => c.title && c.title.toLowerCase().replace(/\s+/g, "-") === slug) || resp.results[0];
    }
  } catch (error) {
    console.error("Failed to fetch certificate:", error);
  }

  if (!cert) {
    notFound();
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={cert.title}
        description={cert.description || ''}
        path={`/certificates/${slug}`}
        image={cert.certificate_image ? cert.certificate_image : `/api/og/generate?title=${encodeURIComponent(cert.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">{cert.title}</Heading>

      <Card padding="24">
        {cert.organization_logo && (
          <img src={cert.organization_logo} alt={cert.issuing_organization} style={{ width: 88, height: 88, objectFit: 'contain', marginBottom: 12 }} />
        )}

        <Text variant="body-default-s" onBackground="neutral-weak">{cert.issuing_organization} • Issued {formatDate(cert.issue_date)}</Text>
        {cert.expiry_date && !cert.does_not_expire && (
          <Text variant="body-default-s" onBackground="neutral-weak">Expires {formatDate(cert.expiry_date)}</Text>
        )}

        {cert.description && (
          <Text marginTop="12" variant="body-default-m">{cert.description}</Text>
        )}

        {cert.credential_url && (
          <Row paddingTop="16">
            <Button href={cert.credential_url} variant="secondary" target="_blank">Verify Credential</Button>
          </Row>
        )}
      </Card>

      <Row>
        <Button href="/certificates" variant="tertiary">Back to certificates</Button>
      </Row>
    </Column>
  );
}
