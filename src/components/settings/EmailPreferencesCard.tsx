import { useState, useEffect } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  type EmailPreferences,
  type EmailTemplateKey,
  DEFAULT_EMAIL_PREFERENCES,
  EMAIL_TEMPLATE_LABELS,
  getEmailPreferences,
  updateEmailPreferences,
} from "@/lib/email";

export function EmailPreferencesCard() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>(DEFAULT_EMAIL_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const prefs = await getEmailPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error("Failed to load email preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: EmailTemplateKey, value: boolean) => {
    if (!user) return;

    // Don't allow disabling verification or password reset emails
    if ((key === "email_verification" || key === "password_reset") && !value) {
      toast.error("This email type cannot be disabled for security reasons");
      return;
    }

    setIsSaving(key);
    const newPreferences = { ...preferences, [key]: value };

    try {
      await updateEmailPreferences(user.id, newPreferences);
      setPreferences(newPreferences);
      toast.success("Email preference updated");
    } catch (error) {
      console.error("Failed to update preference:", error);
      toast.error("Failed to update preference");
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const templateKeys = Object.keys(EMAIL_TEMPLATE_LABELS) as EmailTemplateKey[];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>Choose which emails you want to receive</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {templateKeys.map((key, index) => {
          const { label, description } = EMAIL_TEMPLATE_LABELS[key];
          const isRequired = key === "email_verification" || key === "password_reset";

          return (
            <div key={key}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {isRequired && (
                    <p className="text-xs text-amber-600 mt-1">Required for security</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isSaving === key && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Switch
                    checked={preferences[key]}
                    onCheckedChange={(checked) => handleToggle(key, checked)}
                    disabled={isSaving !== null || isRequired}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
