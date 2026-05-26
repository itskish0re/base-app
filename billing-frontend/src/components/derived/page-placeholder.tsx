import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This screen is a placeholder. Grid and form will be added in this page folder.
        </p>
      </CardContent>
    </Card>
  );
}
