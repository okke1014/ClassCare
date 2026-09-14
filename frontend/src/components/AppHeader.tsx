import Image from "next/image";
import { ChevronLeft } from "lucide-react";

interface AppHeaderProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function AppHeader({ onBack, title, subtitle, right }: AppHeaderProps) {
  const centerLogo = !title && !!onBack;

  const backButton = onBack ? (
    <button
      type="button"
      onClick={onBack}
      aria-label="Go back"
      className="p-2 rounded-full hover:bg-gray-100 shrink-0"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  ) : null;

  const logo = (
    <Image
      src="/images/ev-system-logo.png"
      alt="EV Academy"
      width={110}
      height={28}
      className="h-7 w-auto"
      priority
    />
  );

  if (centerLogo) {
    return (
      <header className="relative h-14 px-4 border-b bg-white flex items-center shrink-0 z-10">
        <div className="flex-1 flex items-center min-w-0">{backButton}</div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center min-w-0 max-w-[calc(100%-7rem)]">
          {logo}
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
          )}
        </div>
        <div className="flex-1 flex items-center justify-end min-w-0">{right}</div>
      </header>
    );
  }

  return (
    <header className="h-14 px-4 border-b bg-white flex items-center justify-between gap-2 shrink-0 z-10">
      <div className="flex items-center gap-1 min-w-0">
        {backButton}
        <div className="flex flex-col min-w-0">
          {title ? (
            <h1 className="text-base font-semibold truncate">{title}</h1>
          ) : (
            logo
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
          )}
        </div>
      </div>
      {right && <div className="flex items-center gap-1 shrink-0">{right}</div>}
    </header>
  );
}
