import {
  Avatar,
  Button,
  RevealFx,
  Column,
  Heading,
  Icon,
  IconButton,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { 
  profileApi, 
  workExperienceApi, 
  educationApi, 
  skillsApi, 
  socialLinksApi,
  formatDate,
  calculateDuration,
  groupBy
} from "@/lib";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
  let profile;
  try {
    const profileList = await profileApi.list();
    if (profileList.results.length > 0) {
      profile = await profileApi.get(profileList.results[0].id);
    }
  } catch (error) {
    // Fallback on error
  }

  const fullName = profile?.full_name || 'Portfolio';
  const bio = profile?.bio || 'About page';

  return Meta.generate({
    title: `About – ${fullName}`,
    description: bio,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent('About')}`,
    path: '/about',
  });
}

export default async function About() {
  // Fetch profile with full details
  let profile, workExperiences, education, profileSkills, profileSocialLinks;
  
  try {
    // Get profile list first to find ID
    const profileList = await profileApi.list();
    if (profileList.results.length === 0) {
      throw new Error('No profile found');
    }
    
    // Get full profile details with related data
    const [profileDetail, workData, eduData] = await Promise.all([
      profileApi.get(profileList.results[0].id),
      workExperienceApi.list({ ordering: '-start_date', show_on_home: true }),
      educationApi.list({ show_on_home: true }),
    ]);

    profile = profileDetail;
    workExperiences = workData.results;
    education = eduData.results;
    
    // Use profile's embedded social links and skills if available
    profileSocialLinks = profile.social_links || [];
    profileSkills = profile.skills || [];
  } catch (error) {
    console.error('Failed to fetch about page data:', error);
    return (
      <Column maxWidth="m" paddingY="24">
        <Heading>Unable to load profile data</Heading>
        <Text>Please ensure the backend is running and try again.</Text>
      </Column>
    );
  }

  if (!profile) {
    return (
      <Column maxWidth="m" paddingY="24">
        <Heading>No profile found</Heading>
        <Text>Please ensure a profile exists in the database.</Text>
      </Column>
    );
  }

  // Group skills by type
  const groupedSkills = groupBy(profileSkills, 'skill_type');

  // Build table of contents structure
  const structure = [
    {
      title: "Summary",
      display: true,
      items: [],
    },
    {
      title: "Experience",
      display: workExperiences.length > 0,
      items: workExperiences.map((exp) => exp.company_name),
    },
    {
      title: "Education",
      display: education.length > 0,
      items: education.map((edu) => edu.institution),
    },
    {
      title: "Skills",
      display: profileSkills.length > 0,
      items: Object.keys(groupedSkills),
    },
  ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`About – ${profile.full_name}`}
        description={profile.bio || ''}
        path="/about"
        image={`/api/og/generate?title=${encodeURIComponent('About')}`}
        author={{
          name: profile.full_name,
          url: `${baseURL}/about`,
          image: profile.profile_image ? `${baseURL}${profile.profile_image}` : `${baseURL}/images/avatar.jpg`,
        }}
      />
      
      {/* Table of Contents */}
      <Column
        left="0"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        position="fixed"
        paddingLeft="24"
        gap="32"
        s={{ hide: true }}
      >
        <TableOfContents structure={structure} about={{ tableOfContent: { display: true, subItems: false } }} />
      </Column>

      <Row fillWidth s={{ direction: "column"}} horizontal="center">
        {/* Avatar Section */}
        <Column
          className={styles.avatar}
          top="64"
          fitHeight
          position="sticky"
          s={{ position: "relative", style: { top: "auto" } }}
          xs={{ style: { top: "auto" } }}
          minWidth="160"
          paddingX="l"
          paddingBottom="xl"
          gap="m"
          flex={3}
          horizontal="center"
        >
          <RevealFx translateY="8" fillWidth horizontal="center" paddingBottom="12">
            <Column fillWidth gap="8" horizontal="center">
              <Avatar 
                src={profile.profile_image || '/images/avatar.jpg'} 
                size="xl" 
              />
              {profile.location && (
                <Row gap="8" vertical="center">
                  <Icon onBackground="accent-weak" name="globe" />
                  {profile.location}
                </Row>
              )}
              {profile.email && (
                <Row gap="8" vertical="center">
                  <Icon onBackground="accent-weak" name="email" />
                  <Text variant="body-default-s">{profile.email}</Text>
                </Row>
              )}
              {profile.phone && (
                <Row gap="8" vertical="center">
                  <Icon onBackground="accent-weak" name="phone" />
                  <Text variant="body-default-s">{profile.phone}</Text>
                </Row>
              )}
            </Column>
          </RevealFx>
        </Column>

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          {/* Header Section */}
          <Column
            id="Summary"
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
              <Heading className={styles.textAlign} variant="display-strong-xl">
                {profile.full_name}
              </Heading>
            </RevealFx>
            {profile.headline && (
              <RevealFx translateY="8" delay={0.2} fillWidth paddingBottom="16">
                <Text
                  className={styles.textAlign}
                  variant="heading-default-xl"
                  onBackground="neutral-weak"
                >
                  {profile.headline}
                </Text>
              </RevealFx>
            )}

            {/* Social Links */}
            {profileSocialLinks.length > 0 && (
              <RevealFx translateY="12" delay={0.4} fillWidth paddingTop="4">
                <Row
                  className={styles.blockAlign}
                  paddingTop="20"
                  paddingBottom="8"
                  gap="8"
                  wrap
                  horizontal="center"
                  fitWidth
                  data-border="rounded"
                >
                  {profileSocialLinks.map((item) => (
                    <React.Fragment key={item.id}>
                      <Row s={{ hide: true }}>
                        <Button
                          href={item.url}
                          prefixIcon={item.icon || item.platform}
                          label={item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                          size="s"
                          weight="default"
                          variant="secondary"
                        />
                      </Row>
                      <Row hide s={{ hide: false }}>
                        <IconButton
                          size="l"
                          href={item.url}
                          icon={item.icon || item.platform}
                          variant="secondary"
                        />
                      </Row>
                    </React.Fragment>
                  ))}
                </Row>
              </RevealFx>
            )}
          </Column>

          {/* Bio Section */}
          <RevealFx translateY="12" delay={0.3} fillWidth>
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              <Text>{profile.bio}</Text>
              
              {/* Profile Details Grid */}
              <Row wrap gap="m" marginTop="m">
                {profile.available_for_hire && (
                  <Tag size="l" prefixIcon="checkCircle" onBackground="success-medium">
                    Available for hire
                  </Tag>
                )}
                {profile.years_of_experience && (
                  <Tag size="l" prefixIcon="calendar">
                    {profile.years_of_experience} years experience
                  </Tag>
                )}
                {profile.current_role && (
                  <Tag size="l" prefixIcon="briefcase">
                    {profile.current_role}
                  </Tag>
                )}
                {profile.current_company && (
                  <Tag size="l" prefixIcon="building">
                    {profile.current_company}
                  </Tag>
                )}
              </Row>

              {/* Resume Download */}
              {profile.resume_url && profile.resume_filename && (
                <Row marginTop="m">
                  <Button
                    href={profile.resume_url}
                    prefixIcon="download"
                    label={`Download Resume (${profile.resume_filename})`}
                    size="m"
                    variant="secondary"
                    target="_blank"
                  />
                </Row>
              )}

              {/* Gallery Images */}
              {profile.images && profile.images.length > 0 && (
                <Column fillWidth gap="m" marginTop="xl">
                  <Heading as="h3" variant="heading-strong-l">
                    Gallery
                  </Heading>
                  <Row wrap gap="m">
                    {profile.images.map((image) => (
                      <Column 
                        key={image.id} 
                        style={{ width: '200px' }}
                        gap="4"
                      >
                        <img
                          src={image.data_uri}
                          alt={image.alt_text || image.filename}
                          style={{ 
                            width: '100%', 
                            height: 'auto',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        {image.caption && (
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {image.caption}
                          </Text>
                        )}
                      </Column>
                    ))}
                  </Row>
                </Column>
              )}

              {/* Timestamps */}
              <Row wrap gap="m" marginTop="l" paddingTop="l" style={{ borderTop: '1px solid var(--neutral-alpha-weak)' }}>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Profile created: {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  •
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Last updated: {new Date(profile.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </Row>
            </Column>
          </RevealFx>

          {/* Work Experience Section */}
          {workExperiences.length > 0 && (
            <>
              <RevealFx translateY="8" delay={0.1} fillWidth>
                <Heading as="h2" id="Experience" variant="display-strong-s" marginBottom="m">
                  Experience
                </Heading>
              </RevealFx>
              <Column fillWidth gap="l" marginBottom="40">
                {workExperiences.map((experience, idx) => (
                  <RevealFx key={experience.id} translateY="8" delay={0.05 * idx} fillWidth>
                    <Column fillWidth>
                      <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                        <Row gap="m" vertical="center">
                          {experience.company_logo && (
                            <img
                              src={experience.company_logo}
                              alt={`${experience.company_name} logo`}
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          )}
                          <Text id={experience.company_name} variant="heading-strong-l">
                            {experience.company_name}
                          </Text>
                        </Row>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                          {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                          {experience.is_current && (
                            <> • {calculateDuration(experience.start_date, null)}</>
                          )}
                        </Text>
                      </Row>
                      <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                        {experience.job_title}
                        {experience.employment_type && ` • ${experience.employment_type}`}
                        {experience.work_mode && ` • ${experience.work_mode}`}
                      </Text>
                      <Text variant="body-default-m" marginBottom="s">
                        {experience.description}
                      </Text>
                      {experience.achievements && (
                        <Column as="ul" gap="8" marginBottom="s">
                          {experience.achievements.split('\n').map((achievement, idx2) => (
                            achievement.trim() && (
                              <Text as="li" variant="body-default-m" key={idx2}>
                                {achievement.trim()}
                              </Text>
                            )
                          ))}
                        </Column>
                      )}
                      {experience.technologies_used && (
                        <Row wrap gap="8" paddingTop="8">
                          {experience.technologies_used.split(',').map((tech, idx3) => (
                            <Tag key={idx3} size="l">
                              {tech.trim()}
                            </Tag>
                          ))}
                        </Row>
                      )}
                      {experience.images && experience.images.length > 0 && (
                        <Row wrap gap="m" marginTop="m">
                          {experience.images.map((image) => (
                            <Column key={image.id} style={{ width: '150px' }} gap="4">
                              <img
                                src={image.data_uri}
                                alt={image.alt_text || image.filename}
                                style={{ 
                                  width: '100%', 
                                  height: 'auto',
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                              />
                              {image.caption && (
                                <Text variant="body-default-xs" onBackground="neutral-weak">
                                  {image.caption}
                                </Text>
                              )}
                            </Column>
                          ))}
                        </Row>
                      )}
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <>
              <RevealFx translateY="8" delay={0.1} fillWidth>
                <Heading as="h2" id="Education" variant="display-strong-s" marginBottom="m">
                  Education
                </Heading>
              </RevealFx>
              <Column fillWidth gap="l" marginBottom="40">
                {education.map((edu, idx) => (
                  <RevealFx key={edu.id} translateY="8" delay={0.05 * idx} fillWidth>
                    <Column fillWidth gap="4">
                      <Row gap="m" vertical="center">
                        {edu.logo && (
                          <img
                            src={edu.logo}
                            alt={`${edu.institution} logo`}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                        )}
                        <Text id={edu.institution} variant="heading-strong-l">
                          {edu.institution}
                        </Text>
                      </Row>
                      <Row fillWidth horizontal="between" vertical="end">
                        <Text variant="body-default-m" onBackground="brand-weak">
                          {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                        </Text>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                        </Text>
                      </Row>
                      {edu.grade && (
                        <Text variant="body-default-s">Grade: {edu.grade}</Text>
                      )}
                      {edu.description && (
                        <Text variant="body-default-m">{edu.description}</Text>
                      )}
                      {edu.images && edu.images.length > 0 && (
                        <Row wrap gap="m" marginTop="m">
                          {edu.images.map((image) => (
                            <Column key={image.id} style={{ width: '150px' }} gap="4">
                              <img
                                src={image.data_uri}
                                alt={image.alt_text || image.filename}
                                style={{ 
                                  width: '100%', 
                                  height: 'auto',
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                              />
                              {image.caption && (
                                <Text variant="body-default-xs" onBackground="neutral-weak">
                                  {image.caption}
                                </Text>
                              )}
                            </Column>
                          ))}
                        </Row>
                      )}
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* Skills Section */}
          {profileSkills.length > 0 && (
            <>
              <RevealFx translateY="8" delay={0.1} fillWidth>
                <Heading
                  as="h2"
                  id="Skills"
                  variant="display-strong-s"
                  marginBottom="40"
                >
                  Skills
                </Heading>
              </RevealFx>
              <Column fillWidth gap="l">
                {Object.keys(groupedSkills).length > 0 ? (
                  Object.entries(groupedSkills).map(([type, typeSkills], idx) => (
                    <RevealFx key={type} translateY="8" delay={0.05 * idx} fillWidth>
                      <Column fillWidth gap="4">
                        <Text id={type} variant="heading-strong-l">
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ').replace('-', ' ')}
                        </Text>
                        <Row wrap gap="8" paddingTop="8">
                          {typeSkills.map((skill) => (
                            <Tag 
                              key={skill.id} 
                              size="l" 
                              prefixIcon={skill.icon}
                            >
                              {skill.name}
                              {skill.proficiency && ` • ${skill.proficiency}`}
                            </Tag>
                          ))}
                        </Row>
                      </Column>
                    </RevealFx>
                  ))
                ) : (
                  <Row wrap gap="8">
                    {profileSkills.map((skill) => (
                      <Tag 
                        key={skill.id} 
                        size="l" 
                        prefixIcon={skill.icon}
                      >
                        {skill.name}
                        {skill.proficiency && ` • ${skill.proficiency}`}
                      </Tag>
                    ))}
                  </Row>
                )}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}