import { Column, Heading, Meta, Schema, Grid, Text, Card, Button, Row, SmartLink } from "@once-ui-system/core";
import { certificatesApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Certificate } from "@/types";
import { formatDate } from "@/utils/formatDate";

export async function generateMetadata() {
  const title = "Certificates & Credentials";
  const description = "A collection of professional certificates and credentials.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/certificates",
  });
}

export default async function CertificatesPage() {
  let certificates: Certificate[] = [];
  try {
    const response = await certificatesApi.list({ ordering: '-issue_date' });
    certificates = response.results;
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
  }

  const title = "Certificates & Credentials";
  const description = "A collection of professional certificates and credentials.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/certificates"
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
        {certificates.length > 0 ? (
          <Grid columns="3" m={{ columns: 2 }} s={{ columns: 1 }} fillWidth gap="24">
            {certificates.map((cert) => {
              const slug = cert.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
              return (
                <SmartLink key={cert.id} href={`/certificates/${slug}`}>
                  <Card padding="24" gap="16" fillWidth>
                    <Column gap="16" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {cert.organization_logo && (
                        <img 
                          src={cert.organization_logo}
                          alt={cert.issuing_organization}
                          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                        />
                      )}
                      <Heading variant="heading-strong-m">{cert.title}</Heading>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {cert.issuing_organization}
                      </Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Issued {formatDate(cert.issue_date)}
                      </Text>
                      {cert.description && (
                        <Text variant="body-default-m">{cert.description}</Text>
                      )}
                    </Column>
                    {cert.credential_url && (
                      <Row paddingTop="16">
                        <Button
                          href={cert.credential_url}
                          variant="secondary"
                          size="s"
                          target="_blank"
                        >
                          Verify Credential
                        </Button>
                      </Row>
                    )}
                  </Card>
                </SmartLink>
              );
            })}
          </Grid>
        ) : (
          <Text paddingX="l">No certificates found.</Text>
        )}
      </Column>
    </Column>
  );
}
