import * as React from "react";
import { Moon, Sun, Monitor, Palette, Shrink, Expand, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { useTheme, AccentName } from "@/app/providers/ThemeProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Badge } from "./badge";
import { Switch } from "./switch";
import { Label } from "./label";
import { Separator } from "./separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface ThemeSettingsProps {
  trigger?: React.ReactNode;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ trigger }) => {
  const {
    theme,
    setTheme,
    isDarkMode,
    accent,
    setAccent,
    availableAccents,
    isCompact,
    setCompact,
    glassEffect,
    setGlassEffect,
  } = useTheme();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const handleAccentChange = (newAccent: AccentName) => {
    setAccent(newAccent);
  };

  const handleCompactChange = (checked: boolean) => {
    setCompact(checked);
  };

  const handleGlassEffectChange = (checked: boolean) => {
    setGlassEffect(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Theme Customization
          </DialogTitle>
          <DialogDescription>
            Personalize your app with advanced theme controls
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Effects</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Shrink className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            {/* Theme Mode */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Label className="text-sm font-medium">Theme Mode</Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "primary" : "secondary"}
                  className="flex flex-col gap-3 h-auto py-4 px-3"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="h-6 w-6" />
                  <span className="text-sm font-medium">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "primary" : "secondary"}
                  className="flex flex-col gap-3 h-auto py-4 px-3"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="h-6 w-6" />
                  <span className="text-sm font-medium">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "primary" : "secondary"}
                  className="flex flex-col gap-3 h-auto py-4 px-3"
                  onClick={() => handleThemeChange("system")}
                >
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm font-medium">System</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {theme === "light" && "Always use light theme"}
                {theme === "dark" && "Always use dark theme"}
                {theme === "system" && "Follow your system preference"}
              </p>
            </div>

            <Separator />

            {/* Color Scheme */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label className="text-sm font-medium">Color Scheme</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableAccents.map((accentOption) => (
                  <Button
                    key={accentOption.name}
                    variant={accent === accentOption.name ? "primary" : "secondary"}
                    className="flex flex-col gap-3 h-auto py-4 px-3"
                    onClick={() => handleAccentChange(accentOption.name)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                      style={{
                        backgroundColor: accentOption.name === "default"
                          ? "hsl(var(--primary))"
                          : `hsl(var(--${accentOption.name}-primary) || var(--primary))`
                      }}
                    />
                    <span className="text-xs font-medium">{accentOption.label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color palette for buttons and accents
              </p>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-6">
            {/* Glass Effect */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <Label className="text-sm font-medium">Visual Effects</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Glass Effect</Label>
                    <p className="text-xs text-muted-foreground">
                      Apply frosted glass appearance to cards and modals
                    </p>
                  </div>
                  <Switch
                    checked={glassEffect}
                    onCheckedChange={handleGlassEffectChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 border rounded-lg transition-all ${glassEffect ? 'backdrop-blur-md bg-card/80 border-border/50' : 'bg-muted/50'}`}>
                    <div className="text-sm font-medium mb-2">With Glass Effect</div>
                    <div className="text-xs text-muted-foreground">
                      Cards and modals have a frosted glass appearance with backdrop blur
                    </div>
                  </div>
                  <div className={`p-4 border rounded-lg transition-all ${!glassEffect ? 'bg-card' : 'bg-muted/50'}`}>
                    <div className="text-sm font-medium mb-2">Standard</div>
                    <div className="text-xs text-muted-foreground">
                      Clean, solid background appearance without effects
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6 mt-6">
            {/* Layout Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shrink className="h-4 w-4" />
                <Label className="text-sm font-medium">Layout Density</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Reduce spacing and padding for a denser, more efficient layout
                    </p>
                  </div>
                  <Switch
                    checked={isCompact}
                    onCheckedChange={handleCompactChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-6 border rounded-lg transition-all ${isCompact ? 'bg-muted/50' : 'bg-card border-primary/20'}`}>
                    <div className="text-sm font-medium mb-3">Spacious Layout</div>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className={`p-3 border rounded-lg transition-all ${isCompact ? 'bg-card border-primary/20' : 'bg-muted/50'}`}>
                    <div className="text-sm font-medium mb-2">Compact Layout</div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Settings Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Active Settings</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {theme === "light" ? <Sun className="h-3 w-3" /> : theme === "dark" ? <Moon className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                {availableAccents.find(a => a.name === accent)?.label || "Default"}
              </Badge>
              {glassEffect && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Glass
                </Badge>
              )}
              {isCompact ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shrink className="h-3 w-3" />
                  Compact
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Expand className="h-3 w-3" />
                  Spacious
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
