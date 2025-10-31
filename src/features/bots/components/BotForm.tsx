import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bot, BotStatus, BOT_STATUS_OPTIONS } from "../types";

const botFormSchema = z.object({
  botToken: z.string().min(1, "Bot token is required"),
  botUsername: z.string().min(3, "Username must be at least 3 characters").max(100),
  botName: z.string().min(3, "Name must be at least 3 characters").max(100),
  webhookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type BotFormValues = z.infer<typeof botFormSchema>;

interface BotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot?: Bot;
  onSubmit: (data: BotFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function BotForm({ open, onOpenChange, bot, onSubmit, isLoading }: BotFormProps) {
  const form = useForm<BotFormValues>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      botToken: "",
      botUsername: "",
      botName: "",
      webhookUrl: "",
      description: "",
      isActive: true,
    },
  });

  // Reset form when bot changes or dialog opens/closes
  useEffect(() => {
    if (bot) {
      form.reset({
        botToken: "", // Don't show existing token for security
        botUsername: bot.botUsername,
        botName: bot.botName,
        webhookUrl: bot.webhookUrl || "",
        description: bot.description || "",
        isActive: bot.isActive,
      });
    } else {
      form.reset({
        botToken: "",
        botUsername: "",
        botName: "",
        webhookUrl: "",
        description: "",
        isActive: true,
      });
    }
  }, [bot, open, form]);

  const handleSubmit = async (data: BotFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{bot ? "Edit Bot" : "Create New Bot"}</DialogTitle>
          <DialogDescription>
            {bot ? "Update the bot details below" : "Fill in the details to create a new bot"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="botToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Token *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter bot token from BotFather" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {bot ? "Leave empty to keep existing token" : "Token from Telegram BotFather"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="botUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="my_bot" {...field} />
                    </FormControl>
                    <FormDescription>Bot's Telegram username</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="botName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Bot" {...field} />
                    </FormControl>
                    <FormDescription>Display name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://example.com/webhook" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Optional webhook endpoint URL</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this bot does..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional description of the bot's purpose</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this bot
                    </FormDescription>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : bot ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

