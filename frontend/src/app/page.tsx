import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
  Tag,
  Icon,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import { 
  profileApi, 
  achievementsApi,
  testimonialsApi,
  skillsApi
} from "@/lib";

export async function generateMetadata() {
  let profile;
  try {
    const profileData = await profileApi.list();
    profile = profileData.results[0];
  } catch (error) {
    // Fallback to static data
  }

  const title = profile?.full_name || home.title;
  const description = profile?.headline || home.description;

  return Meta.generate({
    title: title,
    description: description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  // Fetch dynamic data from API
  let profile, featuredAchievement, testimonials, featuredSkills;
  
  try {
    const [profileData, achievementsData, testimonialsData, skillsData] = await Promise.all([
      profileApi.list(),
      achievementsApi.list({ show_on_home: true, ordering: '-date' }),
      testimonialsApi.list({ show_on_home: true, ordering: '-date' }),
      skillsApi.list({ show_on_home: true }),
    ]);

    profile = profileData.results[0];
    featuredAchievement = achievementsData.results[0];
    testimonials = testimonialsData.results;
    featuredSkills = skillsData.results.slice(0, 6); // Show top 6 skills
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  const headline = profile?.full_name || home.headline;
  const subline = profile?.headline || home.subline;
  const avatar = profile?.profile_image || person.avatar;
  const showFeaturedBadge = profile?.available_for_hire || home.featured.display;

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={String(headline)}
        description={String(subline)}
        image={`/api/og/generate?title=${encodeURIComponent(String(headline))}`}
        author={{
          name: profile?.full_name || person.name,
          url: `${baseURL}${about.path}`,
          image: avatar,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {showFeaturedBadge && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={profile?.available_for_hire ? about.path : (home.featured.href || '#')}
              >
                <Row paddingY="2" gap="4" vertical="center">
                  {profile?.available_for_hire ? (
                    <>
                      <Icon name="checkCircle" size="xs" />
                      Available for hire
                    </>
                  ) : (
                    featuredAchievement?.title || home.featured.title
                  )}
                </Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {subline}
            </Text>
          </RevealFx>
          {profile?.location && (
            <RevealFx translateY="8" delay={0.3} fillWidth horizontal="center" paddingBottom="16">
              <Row gap="8" vertical="center">
                <Icon name="globe" size="s" onBackground="neutral-weak" />
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {profile.location}
                </Text>
              </Row>
            </RevealFx>
          )}
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* Featured Skills */}
      {featuredSkills && featuredSkills.length > 0 && (
        <RevealFx translateY="12" delay={0.5} fillWidth>
          <Column fillWidth gap="m" horizontal="center" align="center">
            <Text variant="body-default-s" onBackground="neutral-weak">
              Specialized in
            </Text>
            <Row wrap gap="8" horizontal="center">
              {featuredSkills.map((skill) => (
                <Tag 
                  key={skill.id}
                  size="l"
                  prefixIcon={skill.icon}
                >
                  {skill.name}
                </Tag>
              ))}
            </Row>
          </Column>
        </RevealFx>
      )}

      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Column fillWidth gap="32" marginTop="40" horizontal="center">
            <Heading as="h2" variant="display-strong-s" align="center">
              What people say
            </Heading>
            <Column fillWidth gap="l" maxWidth="s">
              {testimonials.slice(0, 2).map((testimonial) => (
                <Column 
                  key={testimonial.id}
                  fillWidth 
                  padding="24"
                  radius="l"
                  background="surface"
                  gap="m"
                >
                  <Row gap="m" vertical="center">
                    {testimonial.author_image && (
                      <Avatar src={testimonial.author_image} size="m" />
                    )}
                    <Column gap="4">
                      <Text variant="heading-strong-s">
                        {testimonial.author_name}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {testimonial.author_title}
                        {testimonial.author_company && ` at ${testimonial.author_company}`}
                      </Text>
                    </Column>
                  </Row>
                  <Text variant="body-default-m">
                    "{testimonial.content}"
                  </Text>
                  {testimonial.rating && (
                    <Row gap="4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Icon key={i} name="star" size="s" onBackground="accent-strong" />
                      ))}
                    </Row>
                  )}
                </Column>
              ))}
            </Column>
          </Column>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}

      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Projects range={[2]} />

      {/* Featured Achievement */}
      {featuredAchievement && (
        <Column fillWidth gap="24" marginTop="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Column 
            fillWidth 
            horizontal="center" 
            align="center"
            padding="32"
            radius="l"
            background="brand-alpha-weak"
            gap="m"
          >
            {featuredAchievement.image && (
              <img 
                src={featuredAchievement.image}
                alt={featuredAchievement.title}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            )}
            <Heading as="h3" variant="heading-strong-l" align="center">
              {featuredAchievement.title}
            </Heading>
            {featuredAchievement.issuer && (
              <Text variant="body-default-m" onBackground="neutral-weak" align="center">
                {featuredAchievement.issuer}
              </Text>
            )}
            {featuredAchievement.description && (
              <Column maxWidth="s" fillWidth>
                <Text variant="body-default-m" align="center">
                  {featuredAchievement.description}
                </Text>
              </Column>
            )}
            {featuredAchievement.url && (
              <Button
                href={featuredAchievement.url}
                variant="secondary"
                size="s"
                target="_blank"
              >
                Learn more
              </Button>
            )}
          </Column>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}

      <Mailchimp />
    </Column>
  );
}
