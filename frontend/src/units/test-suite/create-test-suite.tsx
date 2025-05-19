import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTestSuiteMutation } from "./test-suite.queries";
import { useNavigate } from "@tanstack/react-router";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TEST_SUITE_TYPES } from "./const";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["SMOKE", "REGRESSION", "FUNCTIONAL", "COMPATIBILITY"]),
});

export type TTestSuiteFormValues = z.infer<typeof formSchema>;

type CreateTestSuiteProps = {
  projectId: string;
};

export function CreateTestSuite({ projectId }: CreateTestSuiteProps) {
  const navigate = useNavigate();

  const [mutate, { loading, error }] = useMutation(createTestSuiteMutation, {
    onCompleted: (data) => {
      console.log("Test suite successfully created:", data);
      form.reset();
      // Redirect to project page
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": projectId },
        hash: `test-suites`
      });
    },
  });

  const form = useForm<TTestSuiteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "FUNCTIONAL", // Default type
    },
  });

  const handleSubmit = async (formData: TTestSuiteFormValues) => {
    try {
      await mutate({
        variables: {
          input: {
            name: formData.name,
            description: formData.description || "",
            type: formData.type,
            projectId: projectId,
          },
        },
      });

      // onCompleted handler in useMutation already processes successful execution
    } catch (err) {
      console.error("Error creating test suite:", err);
      // Error will be available through `error` from useMutation
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="space-y-1 text-center">
        <h3 className="text-2xl font-bold">Create Test Suite</h3>
        <h4 className="text-sm">Fill in the details for the new test suite</h4>
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
                    Test Suite Name
                  </FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter test suite name"
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
                    placeholder="Detailed description of the test suite"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="type" className="text-sm">
                    Type
                  </FormLabel>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                    variant="outline"
                    className="w-full flex-wrap"
                  >
                    {/* Filter out "All" and map types to ToggleGroupItems */}
                    {TEST_SUITE_TYPES.filter(type => type !== "All").map(type => (
                      <ToggleGroupItem
                        key={type.toUpperCase()}
                        value={type.toUpperCase()}
                        className="text-xs flex-grow cursor-pointer"
                      >
                        {type}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormItem>
              )}
            />
            {error && (
              <div className="text-sm mt-2 text-red-500">
                {error.message || "An error occurred while creating the test suite"}
              </div>
            )}
            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Creating..." : "Create Test Suite"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}