import { Flex, Meta, Schema } from "@once-ui-system/core";
import { ContactForm } from "./ContactForm";
import { baseURL, person } from "@/resources";
import { profileApi } from "@/lib";

export async function generateMetadata() {
  let profile = null;
  try {
    const profileList = await profileApi.list();
    if (profileList.results.length > 0) {
      profile = await profileApi.get(profileList.results[0].id);
    }
  } catch (error) {
    // Fallback on error
  }

  const title = `Contact | ${profile?.full_name || person.name}`;
  const description = `Get in touch with ${profile?.full_name || person.name} for projects or job opportunities.`;

  return Meta.generate({
    title,
    description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Contact")}`,
    path: "/contact",
  });
}

export default async function Contact() {
  let profile = null;
  try {
    const profileList = await profileApi.list();
    if (profileList.results.length > 0) {
      profile = await profileApi.get(profileList.results[0].id);
    }
  } catch (error) {
    console.error("Failed to fetch profile in Contact Page:", error);
  }

  return (
    <Flex maxWidth="m" fillWidth direction="column" paddingX="16" paddingY="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`Contact | ${profile?.full_name || person.name}`}
        description={`Get in touch with ${profile?.full_name || person.name}`}
        path="/contact"
        image={`/api/og/generate?title=${encodeURIComponent("Contact")}`}
        author={{
          name: profile?.full_name || person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <ContactForm profile={profile} />
    </Flex>
  );
}
