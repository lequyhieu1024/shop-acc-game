import React from "react";
import { Drawer, Button } from "antd";

interface DrawerCommonProps {
  open: boolean; // Updated from 'visible' to 'open'
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  titleButton?: string;
  onTitleButtonClick?: () => void;
}

const DrawerCommon: React.FC<DrawerCommonProps> = ({
  open, // Updated from 'visible' to 'open'
  onClose,
  title,
  children,
  placement = "right",
  titleButton = "Lưu",
  onTitleButtonClick
}) => {
  return (
    <Drawer
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
