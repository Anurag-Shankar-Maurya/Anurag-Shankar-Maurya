/**
 * API Test Page - Verify API Connection
 * Visit /test-api to see if the backend is working
 */

import { Column, Heading, Text } from "@once-ui-system/core";
import { 
  profileApi, 
  projectsApi, 
  blogApi,
  workExperienceApi,
  skillsApi 
} from "@/lib";

export default async function TestAPIPage() {
  const results = {
    profiles: null as any,
    projects: null as any,
    blog: null as any,
    workExperience: null as any,
    skills: null as any,
    errors: [] as string[],
  };

  // Test each API endpoint
  try {
    results.profiles = await profileApi.list();
  } catch (error: any) {
    results.errors.push(`Profiles: ${error.message}`);
  }

  try {
    results.projects = await projectsApi.list();
  } catch (error: any) {
    results.errors.push(`Projects: ${error.message}`);
  }

  try {
    results.blog = await blogApi.list();
  } catch (error: any) {
    results.errors.push(`Blog: ${error.message}`);
  }

  try {
    results.workExperience = await workExperienceApi.list();
  } catch (error: any) {
    results.errors.push(`Work Experience: ${error.message}`);
  }

  try {
    results.skills = await skillsApi.list();
  } catch (error: any) {
    results.errors.push(`Skills: ${error.message}`);
  }

  return (
    <Column maxWidth="m" paddingY="24" gap="l">
      <Heading variant="display-strong-s">API Connection Test</Heading>
      
      {results.errors.length > 0 ? (
        <Column gap="m" padding="l" background="danger-medium" radius="l">
          <Heading variant="heading-strong-m">⚠️ Errors Detected</Heading>
          {results.errors.map((error, index) => (
            <Text key={index} variant="body-default-m">• {error}</Text>
          ))}
          <Text variant="body-default-m" marginTop="m">
            Make sure the Django backend is running: <code>python manage.py runserver</code>
          </Text>
        </Column>
      ) : (
        <Column gap="m" padding="l" background="success-medium" radius="l">
          <Heading variant="heading-strong-m">✅ All API Endpoints Working!</Heading>
        </Column>
      )}

      <Column gap="l">
        {/* Profiles */}
        <Column gap="s" padding="l" border="neutral-medium" radius="l">
          <Heading variant="heading-strong-s">Profiles</Heading>
          {results.profiles ? (
            <>
              <Text>Count: {results.profiles.count}</Text>
              {results.profiles.results?.[0] && (
                <Text variant="body-default-s">
                  First profile: {results.profiles.results[0].full_name}
                </Text>
              )}
            </>
          ) : (
            <Text variant="body-default-s" onBackground="danger-medium">Failed to load</Text>
          )}
        </Column>

        {/* Projects */}
        <Column gap="s" padding="l" border="neutral-medium" radius="l">
          <Heading variant="heading-strong-s">Projects</Heading>
          {results.projects ? (
            <>
              <Text>Count: {results.projects.count}</Text>
              {results.projects.results?.[0] && (
                <Text variant="body-default-s">
                  First project: {results.projects.results[0].title}
                </Text>
              )}
            </>
          ) : (
            <Text variant="body-default-s" onBackground="danger-medium">Failed to load</Text>
          )}
        </Column>

        {/* Blog Posts */}
        <Column gap="s" padding="l" border="neutral-medium" radius="l">
          <Heading variant="heading-strong-s">Blog Posts</Heading>
          {results.blog ? (
            <>
              <Text>Count: {results.blog.count}</Text>
              {results.blog.results?.[0] && (
                <Text variant="body-default-s">
                  First post: {results.blog.results[0].title}
                </Text>
              )}
            </>
          ) : (
            <Text variant="body-default-s" onBackground="danger-medium">Failed to load</Text>
          )}
        </Column>

        {/* Work Experience */}
        <Column gap="s" padding="l" border="neutral-medium" radius="l">
          <Heading variant="heading-strong-s">Work Experience</Heading>
          {results.workExperience ? (
            <>
              <Text>Count: {results.workExperience.count}</Text>
              {results.workExperience.results?.[0] && (
                <Text variant="body-default-s">
                  First job: {results.workExperience.results[0].job_title} at {results.workExperience.results[0].company_name}
                </Text>
              )}
            </>
          ) : (
            <Text variant="body-default-s" onBackground="danger-medium">Failed to load</Text>
          )}
        </Column>

        {/* Skills */}
        <Column gap="s" padding="l" border="neutral-medium" radius="l">
          <Heading variant="heading-strong-s">Skills</Heading>
          {results.skills ? (
            <>
              <Text>Count: {results.skills.count}</Text>
              {results.skills.results?.[0] && (
                <Text variant="body-default-s">
                  First skill: {results.skills.results[0].name}
                </Text>
              )}
            </>
          ) : (
            <Text variant="body-default-s" onBackground="danger-medium">Failed to load</Text>
          )}
        </Column>
      </Column>

      <Column gap="m" marginTop="xl">
        <Heading variant="heading-strong-s">Next Steps</Heading>
        <Text>
          {results.errors.length === 0 
            ? "✅ Your API is working! The data should now appear on your pages."
            : "⚠️ Fix the errors above, then refresh this page."}
        </Text>
        <Text variant="body-default-s">
          Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/
        </Text>
      </Column>
    </Column>
  );
}
