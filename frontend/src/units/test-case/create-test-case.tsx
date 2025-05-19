import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTestCaseMutation } from "./test-case.queries";
import { useNavigate } from "@tanstack/react-router";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TEST_CASE_PRIORITIES, TEST_CASE_STATUSES } from "./consts";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  postconditions: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: z.enum(["DRAFT", "ACTIVE", "DEPRECATED"]),
});

export type TTestCaseFormValues = z.infer<typeof formSchema>;

type CreateTestCaseProps = {
  projectId: string;
};

export function CreateTestCase({ projectId }: CreateTestCaseProps) {
  const navigate = useNavigate();

  const [mutate, { loading, error }] = useMutation(createTestCaseMutation, {
    onCompleted: (data) => {
      console.log("Test case successfully created:", data);
      form.reset();
      // Redirect to project page
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": projectId },
        hash: `test-cases`
      });
    },
  });

  const form = useForm<TTestCaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      preconditions: "",
      postconditions: "",
      priority: "MEDIUM", // Соответствует Medium из TEST_CASE_PRIORITIES
      status: "DRAFT",    // Соответствует Draft из TEST_CASE_STATUSES
    },
  });

  const handleSubmit = async (formData: TTestCaseFormValues) => {
    try {
      await mutate({
        variables: {
          input: {
            title: formData.title,
            description: formData.description || "",
            preconditions: formData.preconditions || "",
            postconditions: formData.postconditions || "",
            priority: formData.priority,
            status: formData.status,
            projectId: projectId,
          },
        },
      });

      // onCompleted handler in useMutation already processes successful execution
    } catch (err) {
      console.error("Error creating test case:", err);
      // Error will be available through `error` from useMutation
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="space-y-1 text-center">
        <h3 className="text-2xl font-bold">Create Test Case</h3>
        <h4 className="text-sm">Fill in the details for the new test case</h4>
      </div>
      <div className="w-full max-w-md mt-7 p-6 space-y-4 rounded-lg shadow-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="text-sm">
                    Test Case Title
                  </FormLabel>
                  <Input
                    id="title"
                    placeholder="Enter test case title"
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
                    placeholder="Detailed description of the test case"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="preconditions" className="text-sm">
                    Preconditions
                  </FormLabel>
                  <Textarea
                    id="preconditions"
                    placeholder="Conditions that must be met before running the test"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="postconditions" className="text-sm">
                    Postconditions
                  </FormLabel>
                  <Textarea
                    id="postconditions"
                    placeholder="Results that should be achieved after successful test execution"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priority" className="text-sm">
                    Priority
                  </FormLabel>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                    variant="outline"
                    className="w-full flex-wrap"
                  >
                    {/* Filter out "All" and map priorities to ToggleGroupItems */}
                    {TEST_CASE_PRIORITIES.filter(priority => priority !== "All").map(priority => (
                      <ToggleGroupItem
                        key={priority.toUpperCase()}
                        value={priority.toUpperCase()}
                        className="text-xs flex-grow cursor-pointer"
                      >
                        {priority}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status" className="text-sm">
                    Status
                  </FormLabel>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                    variant="outline"
                    className="w-full flex-wrap"
                  >
                    {/* Filter out "All" and map statuses to ToggleGroupItems */}
                    {TEST_CASE_STATUSES.filter(status => status !== "All").map(status => (
                      <ToggleGroupItem
                        key={status.toUpperCase()}
                        value={status.toUpperCase()}
                        className="text-xs flex-grow cursor-pointer"
                      >
                        {status}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormItem>
              )}
            />
            {error && (
              <div className="text-sm mt-2 text-red-500">
                {error.message || "An error occurred while creating the test case"}
              </div>
            )}
            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Creating..." : "Create Test Case"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
