import {
  Avatar,
  Button,
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
    const profileData = await profileApi.list();
    profile = profileData.results[0];
  } catch (error) {
    profile = { full_name: 'Portfolio', bio: 'About page' };
  }

  return Meta.generate({
    title: `About – ${profile.full_name}`,
    description: profile.bio || 'About page',
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent('About')}`,
    path: '/about',
  });
}

export default async function About() {
  // Fetch all data from API
  let profile, workExperiences, education, skills, socialLinks;
  
  try {
    const [profileData, workData, eduData, skillsData, socialData] = await Promise.all([
      profileApi.list(),
      workExperienceApi.list({ ordering: '-start_date', show_on_home: true }),
      educationApi.list({ show_on_home: true }),
      skillsApi.list({ show_on_home: true }),
      socialLinksApi.list({ show_on_home: true }),
    ]);

    profile = profileData.results[0];
    workExperiences = workData.results;
    education = eduData.results;
    skills = skillsData.results;
    socialLinks = socialData.results;
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
        <Text>Please add a profile to the database.</Text>
      </Column>
    );
  }

  // Group skills by type
  const groupedSkills = groupBy(skills, 'skill_type');

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
      display: skills.length > 0,
      items: Object.keys(groupedSkills),
    },
  ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`About – ${profile.full_name}`}
        description={profile.bio}
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
          <Avatar 
            src={profile.profile_image || '/images/avatar.jpg'} 
            size="xl" 
          />
          <Row gap="8" vertical="center">
            <Icon onBackground="accent-weak" name="globe" />
            {profile.location || 'Remote'}
          </Row>
          <Row wrap gap="8">
            <Tag size="l">English</Tag>
          </Row>
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
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {profile.full_name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {profile.headline}
            </Text>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
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
                {socialLinks.map((item) => (
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
            )}
          </Column>

          {/* Bio Section */}
          <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
            <Text>{profile.bio}</Text>
            {profile.available_for_hire && (
              <Text onBackground="success-medium">✅ Available for hire</Text>
            )}
            {profile.years_of_experience && (
              <Text>Experience: {profile.years_of_experience} years</Text>
            )}
          </Column>

          {/* Work Experience Section */}
          {workExperiences.length > 0 && (
            <>
              <Heading as="h2" id="Experience" variant="display-strong-s" marginBottom="m">
                Experience
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {workExperiences.map((experience) => (
                  <Column key={experience.id} fillWidth>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                      <Text id={experience.company_name} variant="heading-strong-l">
                        {experience.company_name}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                        {experience.is_current && (
                          <> • {calculateDuration(experience.start_date, experience.end_date)}</>
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
                        {experience.achievements.split('\n').map((achievement, idx) => (
                          achievement.trim() && (
                            <Text as="li" variant="body-default-m" key={idx}>
                              {achievement.trim()}
                            </Text>
                          )
                        ))}
                      </Column>
                    )}
                    {experience.technologies_used && (
                      <Row wrap gap="8" paddingTop="8">
                        {experience.technologies_used.split(',').map((tech, idx) => (
                          <Tag key={idx} size="l">
                            {tech.trim()}
                          </Tag>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <>
              <Heading as="h2" id="Education" variant="display-strong-s" marginBottom="m">
                Education
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {education.map((edu) => (
                  <Column key={edu.id} fillWidth gap="4">
                    <Text id={edu.institution} variant="heading-strong-l">
                      {edu.institution}
                    </Text>
                    <Text variant="heading-default-s">
                      {edu.degree} in {edu.field_of_study}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                      {edu.grade && ` • ${edu.grade}`}
                    </Text>
                    {edu.description && (
                      <Text variant="body-default-m">{edu.description}</Text>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <>
              <Heading
                as="h2"
                id="Skills"
                variant="display-strong-s"
                marginBottom="40"
              >
                Skills
              </Heading>
              <Column fillWidth gap="l">
                {Object.entries(groupedSkills).map(([type, typeSkills]) => (
                  <Column key={type} fillWidth gap="4">
                    <Text id={type} variant="heading-strong-l">
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Skills
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
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}