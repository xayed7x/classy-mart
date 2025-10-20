"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";

interface ProductInformationProps {
  product: any;
}

export function ProductInformation({ product }: ProductInformationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState({ title: "", content: "" });

  const productDetails = [
    { title: "Description", content: product.longDescription },
    { title: "Sizing & Fit", content: product.sizingAndFit },
    { title: "Materials & Care", content: product.materialsAndCare },
  ];

  const openSheet = (title: string, content: string) => {
    setSheetContent({ title, content });
    setIsSheetOpen(true);
  };

  return (
    <div className="mt-6 border-t border-accent dark:border-aura-accent-border">
      {/* Mobile: Clickable rows with BottomSheet */}
      <div className="lg:hidden">
        {productDetails.map((item) => (
          <button
            key={item.title}
            onClick={() => openSheet(item.title, item.content)}
            className="flex w-full items-center justify-between border-b border-accent dark:border-aura-accent-border py-4 text-left"
          >
            <span className="font-medium text-base text-text dark:text-aura-soft-white">
              {item.title}
            </span>
            <ChevronRight
              size={20}
              className="text-muted-foreground dark:text-aura-gold"
            />
          </button>
        ))}
        <BottomSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          title={sheetContent.title}
        >
          <p>{sheetContent.content}</p>
        </BottomSheet>
      </div>

      {/* Desktop: Always visible content */}
      <div className="hidden lg:block space-y-8">
        {productDetails.map((item) => (
          <div key={item.title}>
            <h3 className="text-lg font-bold font-satoshi text-text dark:text-aura-soft-white">
              {item.title}
            </h3>
            <p className="mt-2 text-base text-muted-foreground dark:text-aura-gold">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}