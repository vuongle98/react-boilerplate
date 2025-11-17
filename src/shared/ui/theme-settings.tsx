import { AccentName, useTheme } from "@/app/providers/ThemeProvider";
import {
  Accessibility,
  Bell,
  Download,
  Expand,
  Eye,
  Keyboard,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Settings,
  Shrink,
  Sparkles,
  Sun,
  Type,
  Upload,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Slider } from "./slider";
import { Switch } from "./switch";
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

  // Additional settings state
  const [reducedMotion, setReducedMotion] = React.useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("reduced-motion") === "true"
      : false
  );
  const [highContrast, setHighContrast] = React.useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("high-contrast") === "true"
      : false
  );
  const [fontSize, setFontSize] = React.useState(() =>
    typeof window !== "undefined"
      ? parseFloat(localStorage.getItem("font-size") || "1")
      : 1
  );
  const [toastPosition, setToastPosition] = React.useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("toast-position") || "bottom-right"
      : "bottom-right"
  );
  const [toastDuration, setToastDuration] = React.useState(() =>
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("toast-duration") || "4000")
      : 4000
  );
  const [soundEnabled, setSoundEnabled] = React.useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("sound-enabled") !== "false"
      : true
  );

  const getAccentColor = (accentName: AccentName): string => {
    const colorMap: Record<AccentName, string> = {
      default: "hsl(217 91% 60%)", // Default blue
      blue: "hsl(217 91% 60%)",
      green: "hsl(142 71% 45%)",
      purple: "hsl(262 80% 50%)",
      pink: "hsl(330 81% 60%)",
      orange: "hsl(25 95% 53%)",
      "glass-blue":
        "linear-gradient(135deg, hsl(217 91% 60%), rgba(255,255,255,0.1))",
      "glass-purple":
        "linear-gradient(135deg, hsl(262 80% 50%), rgba(255,255,255,0.1))",
    };
    return colorMap[accentName] || "hsl(217 91% 60%)";
  };

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

  const handleReducedMotionChange = (checked: boolean) => {
    setReducedMotion(checked);
    localStorage.setItem("reduced-motion", checked.toString());
    document.documentElement.style.setProperty(
      "--animation-duration",
      checked ? "0s" : "0.3s"
    );
  };

  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem("high-contrast", checked.toString());
    document.documentElement.classList.toggle("high-contrast", checked);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem("font-size", newSize.toString());
    document.documentElement.style.setProperty(
      "--font-size-multiplier",
      newSize.toString()
    );
    document.documentElement.style.fontSize = `${newSize * 100}%`;
  };

  const handleToastPositionChange = (value: string) => {
    setToastPosition(value);
    localStorage.setItem("toast-position", value);
  };

  const handleToastDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setToastDuration(newDuration);
    localStorage.setItem("toast-duration", newDuration.toString());
  };

  const handleSoundEnabledChange = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem("sound-enabled", checked.toString());
  };

  const exportSettings = () => {
    const settings = {
      theme,
      accent,
      isCompact,
      glassEffect,
      reducedMotion,
      highContrast,
      fontSize,
      toastPosition,
      toastDuration,
      soundEnabled,
    };
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `theme-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Settings exported successfully!");
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);

        // Apply imported settings
        if (settings.theme) setTheme(settings.theme);
        if (settings.accent) setAccent(settings.accent);
        if (typeof settings.isCompact === "boolean")
          setCompact(settings.isCompact);
        if (typeof settings.glassEffect === "boolean")
          setGlassEffect(settings.glassEffect);
        if (typeof settings.reducedMotion === "boolean")
          handleReducedMotionChange(settings.reducedMotion);
        if (typeof settings.highContrast === "boolean")
          handleHighContrastChange(settings.highContrast);
        if (settings.fontSize) handleFontSizeChange([settings.fontSize]);
        if (settings.toastPosition)
          handleToastPositionChange(settings.toastPosition);
        if (settings.toastDuration)
          handleToastDurationChange([settings.toastDuration]);
        if (typeof settings.soundEnabled === "boolean")
          handleSoundEnabledChange(settings.soundEnabled);

        toast.success("Settings imported successfully!");
      } catch (error) {
        toast.error("Failed to import settings. Invalid file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  const resetToDefaults = () => {
    setTheme("system");
    setAccent("default");
    setCompact(false);
    setGlassEffect(false);
    handleReducedMotionChange(false);
    handleHighContrastChange(false);
    handleFontSizeChange([1]);
    handleToastPositionChange("bottom-right");
    handleToastDurationChange([4000]);
    handleSoundEnabledChange(true);

    toast.success("Settings reset to defaults!");
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
      <DialogContent
        className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
        data-glass="true"
      >
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
          <TabsList
            className="grid w-full grid-cols-2 lg:grid-cols-6"
            data-glass="true"
          >
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2 text-xs"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="effects"
              className="flex items-center gap-2 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Effects</span>
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="flex items-center gap-2 text-xs"
            >
              <Shrink className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger
              value="accessibility"
              className="flex items-center gap-2 text-xs"
            >
              <Accessibility className="h-4 w-4" />
              <span className="hidden sm:inline">A11y</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2 text-xs"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Perf</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex items-center gap-2 text-xs"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
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
                  data-glass={glassEffect ? "true" : undefined}
                >
                  <Sun className="h-6 w-6" />
                  <span className="text-sm font-medium">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "primary" : "secondary"}
                  className="flex flex-col gap-3 h-auto py-4 px-3"
                  onClick={() => handleThemeChange("dark")}
                  data-glass={glassEffect ? "true" : undefined}
                >
                  <Moon className="h-6 w-6" />
                  <span className="text-sm font-medium">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "primary" : "secondary"}
                  className="flex flex-col gap-3 h-auto py-4 px-3"
                  onClick={() => handleThemeChange("system")}
                  data-glass={glassEffect ? "true" : undefined}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {availableAccents.map((accentOption) => (
                  <Button
                    key={accentOption.name}
                    variant={
                      accent === accentOption.name ? "primary" : "outline"
                    }
                    className={`flex flex-col gap-3 h-auto py-4 px-4 transition-all duration-200 hover:scale-105 ${
                      accent === accentOption.name
                        ? "ring-2 ring-primary/50 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleAccentChange(accentOption.name)}
                    data-glass={glassEffect ? "true" : undefined}
                  >
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${
                          accent === accentOption.name
                            ? "border-primary shadow-primary/25"
                            : "border-border"
                        }`}
                        style={{
                          background: getAccentColor(accentOption.name),
                        }}
                      />
                      {accent === accentOption.name && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {accentOption.label}
                    </span>
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
                  <div
                    className={`p-4 border rounded-lg transition-all ${
                      glassEffect
                        ? "backdrop-blur-md bg-card/80 border-border/50"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-2">
                      With Glass Effect
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Cards and modals have a frosted glass appearance with
                      backdrop blur
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg transition-all ${
                      !glassEffect ? "bg-card" : "bg-muted/50"
                    }`}
                  >
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
                      Reduce spacing and padding for a denser, more efficient
                      layout
                    </p>
                  </div>
                  <Switch
                    checked={isCompact}
                    onCheckedChange={handleCompactChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-6 border rounded-lg transition-all ${
                      isCompact ? "bg-muted/50" : "bg-card border-primary/20"
                    }`}
                  >
                    <div className="text-sm font-medium mb-3">
                      Spacious Layout
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div
                    className={`p-3 border rounded-lg transition-all ${
                      isCompact ? "bg-card border-primary/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-2">
                      Compact Layout
                    </div>
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

          <TabsContent value="accessibility" className="space-y-6 mt-6">
            {/* Accessibility Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                <Label className="text-sm font-medium">
                  Accessibility Options
                </Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Reduced Motion
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Minimize animations and transitions for better
                      accessibility
                    </p>
                  </div>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={handleReducedMotionChange}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      High Contrast
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={handleHighContrastChange}
                  />
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Font Size
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Adjust text size for better readability (Current:{" "}
                      {Math.round(fontSize * 100)}%)
                    </p>
                    <Slider
                      value={[fontSize]}
                      onValueChange={handleFontSizeChange}
                      min={0.8}
                      max={1.4}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller</span>
                      <span>Default</span>
                      <span>Larger</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Performance Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <Label className="text-sm font-medium">
                  Performance & Notifications
                </Label>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Toast Position
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Choose where notifications appear on screen
                    </p>
                    <Select
                      value={toastPosition}
                      onValueChange={handleToastPositionChange}
                    >
                      <SelectTrigger
                        data-glass={glassEffect ? "true" : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        data-glass={glassEffect ? "true" : undefined}
                      >
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">
                          Bottom Right
                        </SelectItem>
                        <SelectItem value="top-center">Top Center</SelectItem>
                        <SelectItem value="bottom-center">
                          Bottom Center
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Toast Duration
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      How long notifications stay visible ({toastDuration}ms)
                    </p>
                    <Slider
                      value={[toastDuration]}
                      onValueChange={handleToastDurationChange}
                      min={2000}
                      max={10000}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>2s</span>
                      <span>6s</span>
                      <span>10s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      Sound Effects
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Play sounds for notifications and interactions
                    </p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={handleSoundEnabledChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Advanced Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <Label className="text-sm font-medium">Advanced Settings</Label>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Settings
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Download your current theme and settings configuration
                    </p>
                    <Button
                      onClick={exportSettings}
                      variant="outline"
                      className="w-full"
                      iconLeft={<Download className="h-4 w-4 mr-2" />}
                    >
                      Export Configuration
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import Settings
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Upload a previously exported settings file
                    </p>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        iconLeft={<Upload className="h-4 w-4 mr-2" />}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Reset to Defaults
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Restore all settings to their default values
                    </p>
                    <Button
                      onClick={resetToDefaults}
                      variant="danger"
                      className="w-full"
                      iconLeft={<RotateCcw className="h-4 w-4 mr-2" />}
                    >
                      Reset All Settings
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      Keyboard Shortcuts
                    </Label>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Toggle Theme:</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                          Ctrl/Cmd + Shift + T
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Compact Mode:</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                          Ctrl/Cmd + Shift + C
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Settings:</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                          Ctrl/Cmd + ,
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 pt-4 border-t">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Active Settings</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {theme === "light" ? (
                  <Sun className="h-3 w-3" />
                ) : theme === "dark" ? (
                  <Moon className="h-3 w-3" />
                ) : (
                  <Monitor className="h-3 w-3" />
                )}
                {theme === "light"
                  ? "Light"
                  : theme === "dark"
                  ? "Dark"
                  : "System"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                {availableAccents.find((a) => a.name === accent)?.label ||
                  "Default"}
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
              {reducedMotion && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Reduced Motion
                </Badge>
              )}
              {highContrast && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  High Contrast
                </Badge>
              )}
              {fontSize !== 1 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  {Math.round(fontSize * 100)}% Font
                </Badge>
              )}
              {!soundEnabled && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <VolumeX className="h-3 w-3" />
                  Muted
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
