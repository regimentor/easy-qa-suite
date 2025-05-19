import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { logInFx } from "@/units/user/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type TLoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: TLoginFormValues) => {
    try {
      await logInFx(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="space-y-1 text-center">
        <h3 className="text-2xl font-bold">EasyQASuite</h3>
        <h3 className="text-xl font-bold">Log in to your account</h3>
        <h4 className="text-zinc-400 text-sm">
          Welcome back! Please enter your details
        </h4>
      </div>
      <div className="w-full max-w-md mt-7 p-6 space-y-4 bg-zinc-950 rounded-lg shadow-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username" className="text-sm">
                    Username
                  </FormLabel>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password" className="text-sm">
                    Password
                  </FormLabel>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-3">
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
