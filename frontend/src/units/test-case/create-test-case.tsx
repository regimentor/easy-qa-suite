import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, Segmented } from "antd";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTestCaseMutation } from "./test-case.queries";
import { useNavigate } from "@tanstack/react-router";
import { TEST_CASE_PRIORITIES, TEST_CASE_STATUSES } from "./consts";
import styles from "./create-test-case.module.css";

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

const priorityOptions = TEST_CASE_PRIORITIES.filter((p) => p !== "All").map(
  (p) => ({ label: p, value: p.toUpperCase() })
);
const statusOptions = TEST_CASE_STATUSES.filter((s) => s !== "All").map(
  (s) => ({ label: s, value: s.toUpperCase() })
);

export function CreateTestCase({ projectId }: CreateTestCaseProps) {
  const navigate = useNavigate();

  const [mutate, { loading, error }] = useMutation(createTestCaseMutation, {
    onCompleted: () => {
      form.reset();
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": projectId },
        hash: "test-cases",
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
      priority: "MEDIUM",
      status: "DRAFT",
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
    } catch (err) {
      console.error("Error creating test case:", err);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Test Case</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new test case
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
              name="title"
              render={({ field }) => (
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="title" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="description" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="preconditions" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="postconditions" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="priority" className={styles.label}>
                    Priority
                  </FormLabel>
                  <div className={styles.segmentedWrap}>
                    <Segmented
                      value={field.value}
                      onChange={(value) =>
                        value && field.onChange(value as string)
                      }
                      options={priorityOptions}
                      block
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="status" className={styles.label}>
                    Status
                  </FormLabel>
                  <div className={styles.segmentedWrap}>
                    <Segmented
                      value={field.value}
                      onChange={(value) =>
                        value && field.onChange(value as string)
                      }
                      options={statusOptions}
                      block
                    />
                  </div>
                </FormItem>
              )}
            />
            {error && (
              <div className={styles.error}>
                {error.message ||
                  "An error occurred while creating the test case"}
              </div>
            )}
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Test Case"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
