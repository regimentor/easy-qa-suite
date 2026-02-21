import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, Segmented } from "antd";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTestSuiteMutation } from "./test-suite.queries";
import { useNavigate } from "@tanstack/react-router";
import { TEST_SUITE_TYPES } from "./const";
import styles from "./create-test-suite.module.css";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["SMOKE", "REGRESSION", "FUNCTIONAL", "COMPATIBILITY"]),
});

export type TTestSuiteFormValues = z.infer<typeof formSchema>;

type CreateTestSuiteProps = {
  projectId: string;
};

const typeOptions = TEST_SUITE_TYPES.filter((t) => t !== "All").map((type) => ({
  label: type,
  value: type.toUpperCase(),
}));

export function CreateTestSuite({ projectId }: CreateTestSuiteProps) {
  const navigate = useNavigate();

  const [mutate, { loading, error }] = useMutation(createTestSuiteMutation, {
    onCompleted: () => {
      form.reset();
      navigate({
        to: "/projects/$project-id",
        params: { "project-id": projectId },
        hash: "test-suites",
      });
    },
  });

  const form = useForm<TTestSuiteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "FUNCTIONAL",
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
    } catch (err) {
      console.error("Error creating test suite:", err);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Test Suite</h3>
        <h4 className={styles.subtitle}>
          Fill in the details for the new test suite
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="name" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="description" className={styles.label}>
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
                <FormItem className={styles.formItem}>
                  <FormLabel htmlFor="type" className={styles.label}>
                    Type
                  </FormLabel>
                  <div className={styles.segmentedWrap}>
                    <Segmented
                      value={field.value}
                      onChange={(value) =>
                        value && field.onChange(value as string)
                      }
                      options={typeOptions}
                      block
                    />
                  </div>
                </FormItem>
              )}
            />
            {error && (
              <div className={styles.error}>
                {error.message || "An error occurred while creating the test suite"}
              </div>
            )}
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Test Suite"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
