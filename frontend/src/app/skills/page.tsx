import { Column, Heading, Meta, Schema, Text, Row, Tag, Card, SmartLink } from "@once-ui-system/core";
import { skillsApi } from "@/lib";
import { baseURL, person } from "@/resources";
import type { Skill } from "@/types";

export async function generateMetadata() {
  const title = "Skills";
  const description = "An overview of technical skills and proficiencies.";
  return Meta.generate({
    title,
    description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: "/skills",
  });
}

export default async function SkillsPage() {
  let skills: Skill[] = [];
  try {
    const response = await skillsApi.list();
    skills = response.results;
  } catch (error) {
    console.error("Failed to fetch skills:", error);
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const key = skill.skill_type || 'Others';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const title = "Skills & Proficiencies";
  const description = "An overview of technical skills and proficiencies.";

  return (
    <Column maxWidth="m" paddingTop="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/skills"
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
        {Object.entries(groupedSkills).length > 0 ? (
          <Column gap="24" fillWidth>
            {Object.entries(groupedSkills).map(([type, skillList]) => (
              <Card key={type} padding="24" fillWidth>
                <Column gap="16">
                  <Heading variant="heading-strong-l">{type.replace(/[-]/g, ' ')}</Heading>
                  <Row wrap gap="12">
                    {skillList.map((skill) => {
                      const slug = skill.name.toLowerCase().replace(/[\W_]+/g, '-').replace(/^-|-$/g, '');
                      return (
                        <SmartLink key={skill.id} href={`/skills/${slug}`}>
                          <Tag size="l" prefixIcon={skill.icon}>{skill.name} ({skill.proficiency})</Tag>
                        </SmartLink>
                      );
                    })}
                  </Row>
                </Column>
              </Card>
            ))}
          </Column>
        ) : (
          <Text paddingX="l">No skills found.</Text>
        )}
      </Column>
    </Column>
  );
}
