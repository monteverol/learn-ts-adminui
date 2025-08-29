import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import type { UpdateJobCategoryData } from '../../hooks/jobCategories/types';

interface EditJobCategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onUpdate: (id: string, values: UpdateJobCategoryData) => Promise<void>;
  confirmLoading: boolean;
  initialData?: {
    id: string;
    name: string;
    description?: string;
    status: string;
    jobsCount: number;
    avgPrice?: number;
    icon?: string;
    color: string;
    tags: string[];
  };
}

const { Option } = Select;
const { TextArea } = Input;

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ARCHIVED', label: 'Archived' }
];

const colorOptions = [
  { value: '#1890ff', label: 'Blue' },
  { value: '#52c41a', label: 'Green' },
  { value: '#faad14', label: 'Orange' },
  { value: '#f5222d', label: 'Red' },
  { value: '#722ed1', label: 'Purple' },
  { value: '#eb2f96', label: 'Magenta' },
  { value: '#13c2c2', label: 'Cyan' }
];

const iconOptions = [
  { value: '🔧', label: '🔧 Tools' },
  { value: '⚡', label: '⚡ Electric' },
  { value: '🏠', label: '🏠 Home' },
  { value: '🎨', label: '🎨 Paint' },
  { value: '🚛', label: '🚛 Moving' },
  { value: '🌱', label: '🌱 Garden' },
  { value: '🧹', label: '🧹 Cleaning' },
  { value: '🔨', label: '🔨 Repair' },
  { value: '💡', label: '💡 Ideas' },
  { value: '🏗️', label: '🏗️ Construction' }
];

export default function EditJobCategoryModal({
  open,
  onCancel,
  onUpdate,
  confirmLoading,
  initialData
}: EditJobCategoryModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialData) {
      // Convert backend status format to form format
      const backendStatus = initialData.status === 'Active' ? 'ACTIVE' : 'ARCHIVED';
      
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description || '',
        status: backendStatus,
        jobsCount: initialData.jobsCount,
        avgPrice: initialData.avgPrice,
        icon: initialData.icon,
        color: initialData.color,
        tags: initialData.tags.join(', ')
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    if (!initialData) return;
    
    try {
      const values = await form.validateFields();
      
      // Convert tags string to array
      const formattedValues: UpdateJobCategoryData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []
      };
      
      await onUpdate(initialData.id, formattedValues);
      form.resetFields();
    } catch (error) {
      console.error('Error updating job category:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Job Category"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      okText="Update Category"
      cancelText="Cancel"
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter category name!' },
                { min: 2, message: 'Name must be at least 2 characters!' }
              ]}
            >
              <Input placeholder="e.g., Plumbing, Electrical" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select placeholder="Select status">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: 'Description cannot exceed 500 characters!' }]}
        >
          <TextArea 
            rows={3}
            placeholder="Brief description of this job category..."
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="icon"
              label="Icon"
            >
              <Select placeholder="Select icon" allowClear>
                {iconOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="color"
              label="Color"
            >
              <Select placeholder="Select color">
                {colorOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: option.value, 
                          borderRadius: '2px' 
                        }} 
                      />
                      {option.label}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="jobsCount"
              label="Jobs Count"
              rules={[{ type: 'number', min: 0, message: 'Jobs count must be 0 or positive!' }]}
            >
              <InputNumber 
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="avgPrice"
              label="Average Price ($)"
              rules={[{ type: 'number', min: 0, message: 'Price must be positive!' }]}
            >
              <InputNumber 
                min={0}
                precision={2}
                placeholder="0.00"
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tags"
              label="Tags (comma-separated)"
            >
              <Input 
                placeholder="e.g., urgent, licensed, residential"
                maxLength={200}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}