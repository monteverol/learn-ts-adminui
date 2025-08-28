import { useEffect } from "react";
import { Modal, Form } from "antd";
import UserForm from "../UserForm";
import dayjs from 'dayjs';

interface User {
  id: string;
  name: string;
  age?: number;
  address?: string;
  status: string;
  tags?: any[];
  jobTitle?: string;
  jobCategory?: string;
  yearsExperience?: number;
  bio?: string;
  description?: string;
  workExperience?: any[];
}

interface EditUserModalProps {
  open: boolean;
  user?: User;
  onCancel: () => void;
  onSave?: (values: any) => Promise<void>;
  confirmLoading?: boolean;
}

export default function EditUserModal({ 
  open, 
  user, 
  onCancel, 
  onSave, 
  confirmLoading 
}: EditUserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && user) {
      // Convert string dates to dayjs objects for the form
      const convertedWorkExperience = (user.workExperience || []).map((exp: any) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate && typeof exp.startDate === 'string' && !dayjs.isDayjs(exp.startDate) 
          ? dayjs(exp.startDate, 'YYYY-MM') 
          : exp.startDate,
        endDate: exp.endDate && typeof exp.endDate === 'string' && !dayjs.isDayjs(exp.endDate) 
          ? dayjs(exp.endDate, 'YYYY-MM') 
          : exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description,
        // Convert responsibilities from objects to strings
        responsibilities: exp.responsibilities?.map((r: any) => r.title || r) ?? []
      }));
      
      form.setFieldsValue({
        // Personal
        name: user.name ?? "",
        age: user.age ?? undefined,
        address: user.address ?? "",
        status: user.status ?? "ACTIVE",
        tags: user.tags?.map(tag => tag.name) ?? [],
        // Professional
        jobTitle: user.jobTitle ?? "",
        jobCategory: user.jobCategory ?? "OTHER",
        yearsExperience: user.yearsExperience ?? 0,
        bio: user.bio ?? "",
        description: user.description ?? "",
        // Work Experience with converted dates
        workExperience: convertedWorkExperience
      });
    } else {
      // Clear the form completely when modal is closed
      form.resetFields();
      form.setFieldsValue({
        workExperience: []
      });
    }
  }, [open, user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Convert dayjs objects back to string format for storage
      const formattedValues = {
        ...values,
        workExperience: (values.workExperience || []).map((exp: any) => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate && dayjs.isDayjs(exp.startDate) ? exp.startDate.format('YYYY-MM') : exp.startDate,
          endDate: exp.endDate && dayjs.isDayjs(exp.endDate) ? exp.endDate.format('YYYY-MM') : exp.endDate,
          isCurrent: exp.isCurrent,
          description: exp.description,
          responsibilities: exp.responsibilities,
        }))
      };
      
      await onSave?.(formattedValues);
    } catch (error) {
      console.error('Error saving user:', error);
      // Form validation errors will be shown automatically by Ant Design
    }
  };

  const handleCancel = () => {
    // Clear the form completely before closing
    form.resetFields();
    form.setFieldsValue({
      workExperience: []
    });
    onCancel?.();
  };

  return (
    <Modal
      title={`Edit User${user?.name ? `: ${user.name}` : ""}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save changes"
      confirmLoading={confirmLoading}
      destroyOnClose
      maskClosable={false}
      width={800}
    >
      <UserForm form={form} initialValues={user} />
    </Modal>
  );
}