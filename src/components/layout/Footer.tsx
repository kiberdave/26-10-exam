export function Footer() {
  return (
    <footer className="border-t border-ink-200 py-8 text-sm text-ink-500 dark:border-ink-800 dark:text-ink-400">
      <div className="page-container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>10X Shop is a 10X Academy graduation project. Payments and orders are simulated.</p>
        <p>
          Product data:{" "}
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
          >
            DummyJSON
          </a>
        </p>
      </div>
    </footer>
  );
}
