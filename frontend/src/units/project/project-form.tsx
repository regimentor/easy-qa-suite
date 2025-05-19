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

// Project fields: name, key, description (description optional)
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
      console.log("Project successfully created:", data);
      form.reset();
      // Redirect to project page
      navigate({ 
        to: '/projects/$project-id',
        params: { 'project-id': data.createProject.id }
      });
    }
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
          }
        },
      });
      
      // onCompleted обработчик в useMutation уже обрабатывает успешное выполнение
      
    } catch (err) {
      console.error("Error creating project:", err);
      // Error will be available through `error` from useMutation
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="space-y-1 text-center">
        <h3 className="text-2xl font-bold">Create Project</h3>
        <h4 className="text-sm">
          Fill in the details for the new project
        </h4>
      </div>
      <div className="w-full max-w-md mt-7 p-6 space-y-4 rounded-lg shadow-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-sm">
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
                  <FormLabel htmlFor="key" className="text-sm">
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
                  <FormLabel htmlFor="description" className="text-sm">
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
              <div className="text-sm mt-2 text-red-500">
                {error.message || "An error occurred while creating the project"}
              </div>
            )}
            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
