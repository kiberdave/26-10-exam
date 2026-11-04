import { useState } from "react";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  // Local UI state: which photo is big. Nobody else needs it, so it lives here.
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-2xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
        <img
          src={activeImage}
          alt={`${title} — photo ${activeIndex + 1} of ${images.length}`}
          width={600}
          height={600}
          fetchPriority="high"
          className="size-full object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product photos">
          {images.map((image, index) => (
            // Image URLs are unique within a product, so the URL is a good key
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  "focus-ring block size-16 overflow-hidden rounded-lg border-2 bg-white sm:size-20 dark:bg-ink-900",
                  index === activeIndex
                    ? "border-brand-600 dark:border-brand-400"
                    : "border-transparent hover:border-ink-300 dark:hover:border-ink-600",
                )}
              >
                <img src={image} alt="" width={80} height={80} loading="lazy" className="size-full object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
