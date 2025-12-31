import { Column, Heading, Meta, Schema, Grid, Text, Card, Button, Row } from "@once-ui-system/core";
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
      <Heading variant="heading-strong-xl" marginLeft="24">
        {title}
      </Heading>
      
      {certificates.length > 0 ? (
        <Grid columns="3" m={{ columns: 2 }} s={{ columns: 1 }} fillWidth gap="24" paddingX="l">
          {certificates.map((cert) => (
            <Card key={cert.id} padding="24" style={{ display: 'flex', flexDirection: 'column' }}>
              <Column gap="16" style={{ flexGrow: 1 }}>
                {cert.organization_logo && (
                  <img 
                    src={cert.organization_logo}
                    alt={cert.issuing_organization}
                    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                  />
                )}
                <Heading variant="heading-strong-m">{cert.title}</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {cert.issuing_organization} • Issued {formatDate(cert.issue_date)}
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
          ))}
        </Grid>
      ) : (
        <Text paddingX="l">No certificates found.</Text>
      )}
    </Column>
  );
}
