import { useEffect } from "react";
import { Modal, Form } from "antd";
import UserForm from "../UserForm";

const defaultValues = {
  // Personal
  status: "ACTIVE",
  tags: [],
  // Professional
  jobCategory: "OTHER",
  yearsExperience: 0,
};

interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate?: (values: any) => Promise<void>;
  confirmLoading?: boolean;
  defaults?: any;
}

export default function AddUserModal({ 
  open, 
  onCancel, 
  onCreate, 
  confirmLoading, 
  defaults = defaultValues 
}: AddUserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.setFieldsValue(defaults);
    else form.resetFields();
  }, [open, defaults, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onCreate?.(values);
  };

  return (
    <Modal
      title="Add User"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Create"
      confirmLoading={confirmLoading}
      destroyOnClose
      maskClosable={false}
      width={800}
    >
      <UserForm form={form} initialValues={defaults} />
    </Modal>
  );
}