import { Column, Heading, Meta, Schema, Text, Card, Row, Avatar, Icon, Button } from "@once-ui-system/core";
import { testimonialsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Testimonial } from "@/types";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const slug = params.slug;
  const query = slug.replace(/[-]/g, " ");
  try {
    const resp = await testimonialsApi.list({ ordering: '-date' });
    const item = resp.results.find((t) => t.author_name && t.author_name.toLowerCase().replace(/\s+/g, "-") === slug);
    const title = item ? `Testimonial – ${item.author_name}` : `Testimonial – ${slug}`;
    return Meta.generate({ title, description: item?.content || '', baseURL, path: `/testimonials/${slug}` });
  } catch (e) {
    return Meta.generate({ title: `Testimonial – ${slug}`, description: '', baseURL });
  }
}

export default async function TestimonialDetail({ params }: Props) {
  const { slug } = params;
  const searchQuery = slug.replace(/-/g, " ");

  let testimonial: Testimonial | null = null;

  try {
    const resp = await testimonialsApi.list({ ordering: '-date' });
    if (resp && resp.results && resp.results.length > 0) {
      testimonial = resp.results.find((t) => t.author_name && t.author_name.toLowerCase().replace(/\s+/g, "-") === slug) || resp.results[0];
    }
  } catch (error) {
    console.error("Failed to fetch testimonial:", error);
  }

  if (!testimonial) {
    notFound();
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema as="webPage" baseURL={baseURL} title={`Testimonial – ${testimonial.author_name}`} description={testimonial.content} path={`/testimonials/${slug}`} author={{ name: person.name, url: `${baseURL}/about`, image: `${baseURL}${person.avatar}` }} />

      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">Testimonial by {testimonial.author_name}</Heading>

      <Card padding="24">
        <Row gap="16" vertical="center">
          {testimonial.author_image && <Avatar src={testimonial.author_image} size="l" />}
          <div>
            <Text variant="heading-strong-s">{testimonial.author_name}</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">{testimonial.author_title}{testimonial.author_company && ` at ${testimonial.author_company}`}</Text>
          </div>
        </Row>

        <Text variant="body-default-l" style={{ fontStyle: 'italic', marginTop: 12 }}>&ldquo;{testimonial.content}&rdquo;</Text>

        {testimonial.rating && (
          <Row gap="4" paddingTop="12">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Icon key={i} name="star" size="s" onBackground="accent-strong" />
            ))}
          </Row>
        )}
      </Card>

      <Row>
        <Button href="/testimonials" variant="tertiary">Back to testimonials</Button>
      </Row>
    </Column>
  );
}
