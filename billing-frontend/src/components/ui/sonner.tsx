import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useIsMobile } from '@/hooks/useMobile';

function useDocumentTheme(): ToasterProps['theme'] {
  const [theme, setTheme] = useState<ToasterProps['theme']>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
}

/** Global toast host — mount once inside app providers. */
export function Toaster(props: ToasterProps) {
  const isMobile = useIsMobile();
  const theme = useDocumentTheme();

  return (
    <Sonner
      theme={theme}
      position={isMobile ? 'bottom-center' : 'top-right'}
      closeButton
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
}
