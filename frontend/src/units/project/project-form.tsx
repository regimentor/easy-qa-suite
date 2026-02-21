import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createProjectMutation } from "./projects.queries";
import { useNavigate } from "@tanstack/react-router";
import styles from "./project-form.module.css";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Project code is required"),
  description: z.string().optional(),
});

export type TProjectFormValues = z.infer<typeof formSchema>;

export function ProjectForm() {
  const navigate = useNavigate();

  const [mutate, { loading, error }] = useMutation(createProjectMutation, {
    onCompleted: (data) => {
      form.reset();
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": data.createProject.id },
      });
    },
  });

  const form = useForm<TProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
    },
  });

  const handleSubmit = async (formData: TProjectFormValues) => {
    try {
      await mutate({
        variables: {
          input: {
            name: formData.name,
            key: formData.key,
            description: formData.description || "",
          },
        },
      });
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Project</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new project
        </h4>
      </div>
      <div className={styles.formWrap}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={styles.form}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className={styles.label}>
                    Project Name
                  </FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="key" className={styles.label}>
                    Project Code
                  </FormLabel>
                  <Input
                    id="key"
                    placeholder="Unique code (e.g., EQA)"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description" className={styles.label}>
                    Description
                  </FormLabel>
                  <Textarea
                    id="description"
                    placeholder="Brief project description"
                    {...field}
                  />
                </FormItem>
              )}
            />
            {error && (
              <div className={styles.error}>
                {error.message ||
                  "An error occurred while creating the project"}
              </div>
            )}
            <Button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
