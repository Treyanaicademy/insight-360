import type React from 'react';
import { Text } from "@/components";
import { AccordionHeaderSkeleton } from "./accordion-header-skeleton";

type Props = React.PropsWithChildren<{
  accordionKey: string;
  activeKey?: string;
  setActive: (key?: string) => void;
  fallback: string | React.ReactNode;
  isLoading?: boolean;
  icon: React.ReactNode;
  label: string;
}>;

/**
 * when activeKey is equal to accordionKey, the children will be rendered. Otherwise, the fallback will be rendered
 * when isLoading is true, the <AccordionHeaderSkeleton /> will be rendered
 * when Accordion is clicked, setActive will be called with the accordionKey
 */
export const Accordion = ({
  accordionKey,
  activeKey,
  setActive,
  fallback,
  icon,
  label,
  children,
  isLoading,
}: Props) => {
  if (isLoading) {
    return <AccordionHeaderSkeleton />;
  }

  const isActive = activeKey === accordionKey;

  const toggleAccordion = () => {
    if (isActive) {
      setActive(undefined);
    } else {
      setActive(accordionKey);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "12px 24px",
        gap: "12px",
        alignItems: "start",
        borderBottom: "1px solid #d9d9d9",
      }}
    >
      <div style={{ marginTop: "1px", flexShrink: 0 }}>{icon}</div>
      {isActive ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          <Text
            strong
            onClick={toggleAccordion}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                toggleAccordion();
              }
            }}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            {label}
          </Text>
          {children}
        </div>
      ) : (
        <div
          onClick={toggleAccordion}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              toggleAccordion();
            }
          }}
          style={{ cursor: "pointer", flex: 1 }}
          role="button"
          tabIndex={0}
        >
          {fallback}
        </div>
      )}
    </div>
  );
};
