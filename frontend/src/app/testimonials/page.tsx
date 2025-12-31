import { Column, Heading, Meta, Schema, Grid, Text, Card, Avatar, Row, Icon } from "@once-ui-system/core";
import { testimonialsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Testimonial } from "@/types";

export async function generateMetadata() {
  const title = "Testimonials";
  const description = "What clients and colleagues say about my work.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    const response = await testimonialsApi.list({ ordering: '-date' });
    testimonials = response.results;
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
  }

  const title = "Testimonials";
  const description = "What clients and colleagues say about my work.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/testimonials"
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
        {testimonials.length > 0 ? (
          <Grid columns="2" s={{ columns: 1 }} fillWidth gap="24">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} padding="24" gap="16" fillWidth>
                <Column gap="16" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Row gap="m" vertical="center">
                    {testimonial.author_image && (
                      <Avatar src={testimonial.author_image} size="l" />
                    )}
                    <Column gap="4" flex={1}>
                      <Text variant="heading-strong-s">
                        {testimonial.author_name}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {testimonial.author_title}
                        {testimonial.author_company && ` at ${testimonial.author_company}`}
                      </Text>
                    </Column>
                  </Row>
                  <Text variant="body-default-l" style={{ fontStyle: 'italic' }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </Text>
                </Column>
                {testimonial.rating && (
                  <Row gap="4" paddingTop="8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="star" size="s" onBackground="accent-strong" />
                    ))}
                  </Row>
                )}
              </Card>
            ))}
          </Grid>
        ) : (
          <Text paddingX="l">No testimonials found.</Text>
        )}
      </Column>
    </Column>
  );
}
