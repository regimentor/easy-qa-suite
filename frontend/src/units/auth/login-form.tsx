import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { logInFx } from "@/units/user/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./login-form.module.css";

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
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>EasyQASuite</h3>
        <h3 className={styles.subtitle}>Log in to your account</h3>
        <h4 className={styles.hint}>Welcome back! Please enter your details</h4>
      </div>
      <div className={styles.formWrap}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={styles.form}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username" className={styles.label}>
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
                  <FormLabel htmlFor="password" className={styles.label}>
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

            <Button type="submit" className={styles.submitBtn}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
