import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/hooks/useToast";
import type { LoginFormValues } from "@/types/user";
import { readStateString } from "@/utils/guards";

// Yup validation schema — the rules and the exact error texts in one place (P1.2)
const loginSchema = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const initialValues: LoginFormValues = { username: "", password: "" };

export default function LoginPage() {
  useDocumentTitle("Log in");

  const { isLoggedIn, displayName, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // ProtectedRoute put the page the guest wanted (e.g. "/checkout") into state.from
  const from = readStateString(location.state, "from");

  // useFormik keeps values, errors, touched fields and the submitting flag for us.
  // The inputs are still controlled: value={formik.values.x} + onChange={formik.handleChange}.
  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      // Educational login: no server — the username goes into AuthContext
      login(values.username);
      showToast(`Welcome, ${values.username.trim()}!`);
      navigate(from ?? "/", { replace: true });
    },
  });

  // Show an error after the field was left (blur) or after a submit attempt
  function fieldError(field: keyof LoginFormValues): string | undefined {
    return formik.touched[field] ? formik.errors[field] : undefined;
  }

  if (isLoggedIn) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <h1 className="text-3xl">You're logged in</h1>
        <p className="text-ink-500 dark:text-ink-400">Signed in as {displayName}.</p>
        <Link to="/" className={buttonClasses("primary")}>
          Go to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md py-4 md:py-10">
      <Link
        to="/"
        className="focus-ring mb-6 inline-block rounded text-sm font-semibold text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      >
        ← Back to catalog
      </Link>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 md:p-8 dark:border-ink-800 dark:bg-ink-900">
        <h1 className="text-3xl">Log in</h1>
        {from === "/checkout" ? (
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">Log in to continue to checkout.</p>
        ) : (
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Demo login: any username and a password of 6+ characters.
          </p>
        )}

        {/* noValidate: our own validation and messages instead of the browser's bubbles */}
        <form onSubmit={formik.handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="username"
            name="username"
            label="Username"
            autoComplete="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("username")}
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("password")}
          />
          <Button type="submit" size="lg" className="mt-2 w-full" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in…" : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
