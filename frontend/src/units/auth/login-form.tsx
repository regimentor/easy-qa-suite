import { Button, Form, Input } from "antd";
import { logInFx } from "@/units/user/user.store";
import { useTranslation } from "react-i18next";
import styles from "./login-form.module.css";

export function LoginForm() {
  const [form] = Form.useForm();
  const { t } = useTranslation();

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
        <h3 className={styles.title}>{t("auth.title")}</h3>
        <h3 className={styles.subtitle}>{t("auth.subtitle")}</h3>
        <h4 className={styles.hint}>{t("auth.hint")}</h4>
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
            label={t("auth.username")}
            rules={[{ required: true, message: t("auth.usernameRequired") }]}
          >
            <Input placeholder={t("auth.usernamePlaceholder")} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("auth.password")}
            rules={[{ required: true, message: t("auth.passwordRequired") }]}
          >
            <Input.Password placeholder={t("auth.passwordPlaceholder")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("auth.signIn")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
