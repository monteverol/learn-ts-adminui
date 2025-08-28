import { Form, Input, Select, InputNumber, Divider, Typography, Button, Card, Switch, DatePicker, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, BuildOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

const jobCategories = [
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OPERATIONS", label: "Operations" },
  { value: "OTHER", label: "Other" },
];

interface UserFormProps {
  form: any;
  initialValues?: any;
}

export default function UserForm({ form, initialValues }: UserFormProps) {
  const [workExperienceCount, setWorkExperienceCount] = useState(
    (initialValues?.workExperience || []).length || 0
  );
  const [currentJobs, setCurrentJobs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialValues?.workExperience) {
      const convertedWorkExperience = initialValues.workExperience.map((exp: any) => ({
        ...exp,
        startDate: exp.startDate && typeof exp.startDate === 'string' && !dayjs.isDayjs(exp.startDate) 
          ? dayjs(exp.startDate, 'YYYY-MM') 
          : exp.startDate,
        endDate: exp.endDate && typeof exp.endDate === 'string' && !dayjs.isDayjs(exp.endDate) 
          ? dayjs(exp.endDate, 'YYYY-MM') 
          : exp.endDate,
      }));
      
      form.setFieldsValue({ workExperience: convertedWorkExperience });
      setWorkExperienceCount(convertedWorkExperience.length);
      
      // Set current job states
      const currentJobStates: Record<number, boolean> = {};
      convertedWorkExperience.forEach((exp: any, index: number) => {
        if (exp.isCurrent) {
          currentJobStates[index] = true;
        }
      });
      setCurrentJobs(currentJobStates);
    }
  }, [initialValues, form]);

  const addWorkExperience = () => {
    const currentWorkExp = form.getFieldValue('workExperience') || [];
    const newExperience = {
      id: `temp_${Date.now()}`,
      company: '',
      position: '',
      startDate: null,
      endDate: null,
      isCurrent: false,
      description: '',
      responsibilities: []
    };
    
    form.setFieldsValue({
      workExperience: [...currentWorkExp, newExperience]
    });
    setWorkExperienceCount(prev => prev + 1);
  };

  const removeWorkExperience = (index: number) => {
    const currentWorkExp = form.getFieldValue('workExperience') || [];
    const updatedWorkExp = currentWorkExp.filter((_: any, i: number) => i !== index);
    form.setFieldsValue({ workExperience: updatedWorkExp });
    setWorkExperienceCount(prev => prev - 1);
    
    // Clean up current job state
    const newCurrentJobs = { ...currentJobs };
    delete newCurrentJobs[index];
    setCurrentJobs(newCurrentJobs);
  };

  const handleCurrentJobChange = (checked: boolean, index: number) => {
    const workExperience = form.getFieldValue('workExperience') || [];
    const updatedExp = [...workExperience];
    updatedExp[index] = {
      ...updatedExp[index],
      isCurrent: checked,
      endDate: checked ? null : updatedExp[index].endDate
    };
    form.setFieldsValue({ workExperience: updatedExp });
    
    // Update local state to control end date field
    setCurrentJobs(prev => ({
      ...prev,
      [index]: checked
    }));
    
    // Clear the end date field when current is checked
    if (checked) {
      form.setFieldValue(['workExperience', index, 'endDate'], null);
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      requiredMark="optional" 
      initialValues={{
        ...initialValues,
        workExperience: initialValues?.workExperience || []
      }}
    >
      <Title level={5}>Personal Info</Title>

      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: "Name is required" },
          { min: 2, message: "Name must be at least 2 characters" },
        ]}
      >
        <Input placeholder="e.g., Jane Doe" allowClear />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true, message: "Age is required" },
          { type: "number", min: 18, max: 120, message: "Age must be between 18 and 120" },
        ]}
      >
        <InputNumber className="w-full" placeholder="e.g., 30" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Address" name="address">
        <Input placeholder="e.g., 123 Main St, City" allowClear />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Select a status" }]}
      >
        <Select
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Tags" name="tags">
        <Select mode="tags" tokenSeparators={[","]} placeholder="Type and press enter (e.g., Handyman, Laundry)" />
      </Form.Item>

      <Divider />

      <Title level={5}>Professional Info</Title>

      <Form.Item
        label="Job Title"
        name="jobTitle"
        rules={[{ required: true, message: "Job title is required" }]}
      >
        <Input placeholder="e.g., Maintenance Technician" allowClear />
      </Form.Item>

      <Form.Item
        label="Job Category"
        name="jobCategory"
        rules={[{ required: true, message: "Select a job category" }]}
      >
        <Select options={jobCategories} placeholder="Select category" />
      </Form.Item>

      <Form.Item
        label="Years of Experience"
        name="yearsExperience"
        rules={[
          { required: true, message: "Years of experience is required" },
          { type: "number", min: 0, max: 80, message: "Enter a valid number" },
        ]}
      >
        <InputNumber className="w-full" placeholder="e.g., 5" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Short Bio" name="bio">
        <TextArea placeholder="1–2 sentences about the user" autoSize={{ minRows: 2, maxRows: 4 }} />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea placeholder="Longer description of responsibilities, skills, etc." autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item>

      <Divider />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BuildOutlined />
          Work Experience
        </Title>
        <Button 
          type="dashed" 
          onClick={addWorkExperience}
          icon={<PlusOutlined />}
          size="small"
        >
          Add Experience
        </Button>
      </div>

      <Form.List name="workExperience">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}
                title={`Experience ${index + 1}`}
                extra={
                  <Popconfirm
                    title="Remove this work experience?"
                    onConfirm={() => {
                      remove(field.name);
                      removeWorkExperience(index);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small"
                    />
                  </Popconfirm>
                }
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'company']}
                    key={`${field.key}-company`}
                    label="Company"
                    rules={[{ required: true, message: 'Company is required' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input placeholder="e.g., ABC Corporation" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'position']}
                    key={`${field.key}-position`}
                    label="Position"
                    rules={[{ required: true, message: 'Position is required' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input placeholder="e.g., Senior Technician" />
                  </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px', alignItems: 'end' }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'startDate']}
                    key={`${field.key}-startDate`}
                    label="Start Date"
                    rules={[{ required: true, message: 'Start date is required' }]}
                  >
                    <DatePicker.MonthPicker 
                      placeholder="Select month"
                      style={{ width: '100%' }}
                      format="MMM YYYY"
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'endDate']}
                    key={`${field.key}-endDate`}
                    label="End Date"
                  >
                    <DatePicker.MonthPicker 
                      placeholder="Select month"
                      style={{ width: '100%' }}
                      format="MMM YYYY"
                      disabled={currentJobs[field.name] || false}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'isCurrent']}
                    key={`${field.key}-isCurrent`}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch 
                      checkedChildren="Current"
                      unCheckedChildren="Past"
                      onChange={(checked) => handleCurrentJobChange(checked, field.name)}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  {...field}
                  name={[field.name, 'description']}
                  key={`${field.key}-description`}
                  label="Job Description"
                  style={{ marginBottom: '16px' }}
                >
                  <TextArea 
                    placeholder="Brief description of your role and achievements..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'responsibilities']}
                  key={`${field.key}-responsibilities`}
                  label="Key Responsibilities"
                  tooltip="Add your main responsibilities and achievements in this role"
                >
                  <Select
                    mode="tags"
                    placeholder="Type responsibility and press enter..."
                    tokenSeparators={[',']}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Card>
            ))}
            
            {fields.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                border: '1px dashed #d9d9d9', 
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                <BuildOutlined style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '12px' }} />
                <br />
                <span style={{ color: '#8c8c8c' }}>No work experience added yet</span>
                <br />
                <Button 
                  type="link" 
                  onClick={addWorkExperience}
                  style={{ padding: 0, marginTop: '8px' }}
                >
                  Add your first work experience
                </Button>
              </div>
            )}
          </>
        )}
      </Form.List>
    </Form>
  );
}