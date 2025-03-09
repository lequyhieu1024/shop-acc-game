import React from "react";
import { Drawer, Button } from "antd";
import { useViewport } from "@/app/hook/useViewport";

interface DrawerCommonProps {
  open: boolean; // Updated from 'visible' to 'open'
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  titleButton?: string;
  onTitleButtonClick?: () => void;
  screenSize?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | string;
}

const DrawerCommon: React.FC<DrawerCommonProps> = ({
  open, // Updated from 'visible' to 'open'
  onClose,
  title,
  children,
  placement = "right",
  titleButton = "Lưu",
  onTitleButtonClick,
  screenSize
}) => {
  const maxWidthMap: Record<string, string> = {
    xs: "390px", // Max-width for xs
    sm: "418px", // Max-width for sm
    md: "540px", // Max-width for md
    lg: "640px", // Max-width for lg
    xl: "768px", // Max-width for xl
    xxl: "920px" // Max-width for xxl
  };

  const maxWidth = maxWidthMap[screenSize!] || "calc(100% - 12px)";
  return (
    <Drawer
      width={maxWidth}
      title={title}
      placement={placement}
      onClose={onClose}
      open={open} // Updated from 'visible' to 'open'
      extra={
        onTitleButtonClick && (
          <Button type="primary" onClick={onTitleButtonClick}>
            {titleButton}
          </Button>
        )
      }
    >
      {children}
    </Drawer>
  );
};

export default DrawerCommon;
