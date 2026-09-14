import { getTranslation, type NativeLanguage } from "@/lib/analysisTranslations";
import { cn } from "@/lib/utils";

interface BilingualSummaryProps {
  text: string;
  nativeLanguage?: NativeLanguage;
  className?: string;
  englishClassName?: string;
  translationClassName?: string;
}

export function BilingualSummary({
  text,
  nativeLanguage,
  className,
  englishClassName = "text-gray-600",
  translationClassName = "text-gray-500",
}: BilingualSummaryProps) {
  const translation = getTranslation(text, nativeLanguage);

  return (
    <div className={cn("text-sm leading-relaxed", className)}>
      <p className={englishClassName}>{text}</p>
      {translation && (
        <p className={cn("mt-2 pt-2 border-t border-gray-200/60 text-xs leading-relaxed", translationClassName)}>
          {translation}
        </p>
      )}
    </div>
  );
}
