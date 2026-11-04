import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/hooks/useToast";
import { ordersStorage, reviewsStorage } from "@/models/StorageService";
import type { ProfileFormValues } from "@/types/user";
import { pluralize } from "@/utils/format";
import { hasErrors, validateProfile } from "@/utils/validation";

const sectionClass =
  "flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-5 md:p-6 dark:border-ink-800 dark:bg-ink-900";

export default function ProfilePage() {
  useDocumentTitle("Profile");

  const { user, logout, updateProfile } = useAuth();
  const { clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // ProtectedRoute guarantees a user here; the fallback only satisfies the types
  const [values, setValues] = useState<ProfileFormValues>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [ordersCount, setOrdersCount] = useState(() => ordersStorage.get()?.length ?? 0);

  const errors = validateProfile(values);
  const showError = (field: keyof ProfileFormValues) => (submitAttempted ? errors[field] : undefined);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (hasErrors(errors)) return;

    updateProfile(values); // the Header shows the new name immediately (same AuthContext)
    setSubmitAttempted(false);
    showToast("Profile saved ✓");
  }

  function handleClearLocalData() {
    if (!window.confirm("Delete your cart, orders and reviews from this browser? This cannot be undone.")) return;
    clearCart();
    ordersStorage.remove();
    reviewsStorage.remove();
    setOrdersCount(0);
    showToast("Local data cleared", "info"); // the session and the theme stay
  }

  function handleLogout() {
    logout();
    showToast("You're logged out", "info");
    navigate("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl">Profile</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Logged in as <strong className="text-ink-900 dark:text-white">{user?.username}</strong> ·{" "}
          {pluralize(ordersCount, "order")}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={sectionClass}>
        <h2 className="text-lg">Personal details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="profile-firstName"
            name="firstName"
            label="First name"
            autoComplete="given-name"
            value={values.firstName}
            onChange={handleChange}
            error={showError("firstName")}
          />
          <TextField
            id="profile-lastName"
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            value={values.lastName}
            onChange={handleChange}
            error={showError("lastName")}
          />
          <TextField
            id="profile-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            error={showError("email")}
          />
          <TextField
            id="profile-phone"
            name="phone"
            type="tel"
            label="Phone (optional)"
            autoComplete="tel"
            value={values.phone}
            onChange={handleChange}
            error={showError("phone")}
            hint="9–15 digits, e.g. +995 555 12 34 56"
          />
        </div>
        <Button type="submit" className="self-start">
          Save changes
        </Button>
      </form>

      <section className={sectionClass}>
        <h2 className="text-lg">Appearance</h2>
        <ThemeToggle withLabel className="self-start border border-ink-200 dark:border-ink-700" />
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg">Data in this browser</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Your cart, orders and reviews are stored only on this device. Clearing them keeps you logged in and keeps
          your theme.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleClearLocalData}>
            Clear local data
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </section>
    </div>
  );
}
