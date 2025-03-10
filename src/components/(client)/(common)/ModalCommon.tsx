import React from "react";
import { Modal, Button } from "antd";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  customStyle?: {
    modal?: React.CSSProperties;
    body?: React.CSSProperties;
    title?: React.CSSProperties;
  };
  titleFooter?: string;
  onFooterAction?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
  customStyle,
  titleFooter,
  onFooterAction
}) => {
  return (
    <Modal
      title={<div style={customStyle?.title}>{title}</div>}
      open={open}
      onCancel={onClose}
      footer={
        <>
          {titleFooter && onFooterAction && (
            <Button key="action" type="primary" onClick={onFooterAction}>
              {titleFooter}
            </Button>
          )}
          <Button key="back" onClick={onClose}>
            Đóng
          </Button>
        </>
      }
      styles={{
        body: customStyle?.body
      }}
      style={customStyle?.modal}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
