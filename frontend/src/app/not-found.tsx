import { Column, Heading, Text, Button, Row } from "@once-ui-system/core";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="160" paddingTop="160" gap="24">
      <Column center gap="8">
        <Text variant="display-strong-xl" onBackground="brand-strong" style={{ lineHeight: '1' }}>
          404
        </Text>
        <Heading variant="display-default-xs">
          Lost in Space?
        </Heading>
      </Column>
      
      <Column center gap="32" maxWidth={32}>
        <Text onBackground="neutral-weak" align="center">
          The page you're looking for seems to have vanished or never existed in this dimension. Don't worry, even the best explorers get lost sometimes.
        </Text>

        <Row gap="12" wrap>
          <Button
            href="/"
            variant="primary"
            size="l">
            Go back home
          </Button>
          <Button
            href="/work"
            variant="secondary"
            size="l">
            View Projects
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
