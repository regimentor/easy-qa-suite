import { Button, Form, Input } from "antd";
import { logInFx } from "@/units/user/user.store";
import styles from "./login-form.module.css";

export function LoginForm() {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await logInFx(values);
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
