import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { TagsOutlined } from '@ant-design/icons';
import { Input, Button, Table, Tag, Space, message, Popconfirm, Tooltip, Avatar } from "antd";
import type { ColumnsType } from 'antd/es/table';
import AddJobCategoryModal from "../components/modals/AddJobCategoryModal";
import EditJobCategoryModal from "../components/modals/EditJobCategoryModal";
import { useJobCategories } from "../hooks/jobCategories/useJobCategories";
import { useJobCategoryModals } from "../hooks/jobCategories/useJobCategoryModals";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { CreateJobCategoryData, UpdateJobCategoryData } from "../hooks/jobCategories/types";

interface JobCategoryTableRow {
  key: string;
  id: string;
  name: string;
  description?: string;
  status: string;
  jobsCount: number;
  avgPrice?: number;
  icon?: string;
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function JobCategories() {
  const { jobCategories, isMutating, createJobCategory, updateJobCategory, changeStatus, getByKey } = useJobCategories();
  const { addOpen, editOpen, editingKey, openAdd, closeAdd, openEdit, closeEdit } = useJobCategoryModals();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Suppress ResizeObserver warnings
  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
        const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    };
    window.addEventListener('error', handleResizeObserverError);
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  const editingJobCategory = useMemo(() => getByKey(editingKey), [getByKey, editingKey]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) return jobCategories;

    const lowerSearch = debouncedSearchTerm.toLowerCase();

    return jobCategories.filter(category =>
      category.name.toLowerCase().includes(lowerSearch) ||
      category.description?.toLowerCase().includes(lowerSearch) ||
      category.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }, [jobCategories, debouncedSearchTerm]);

  const columns: ColumnsType<JobCategoryTableRow> = [
    { 
      title: "Category", 
      dataIndex: "name", 
      key: "name", 
      render: (text: string, record: JobCategoryTableRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar 
            style={{ 
              backgroundColor: record.color || '#1890ff',
              fontSize: '16px'
            }}
            size="small"
          >
            {record.icon || text.charAt(0).toUpperCase()}
          </Avatar>
          <a href="#!" onClick={(e) => e.preventDefault()}>{text}</a>
        </div>
      )
    },
    { 
      title: "Description", 
      dataIndex: "description", 
      key: "description", 
      ellipsis: true,
      width: 200
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "gray"}>
          {status}
        </Tag>
      )
    },
    { 
      title: "Jobs Count", 
      dataIndex: "jobsCount", 
      key: "jobsCount",
      render: (count: number) => (
        <Tag color="blue">{count || 0}</Tag>
      )
    },
    { 
      title: "Avg Price", 
      dataIndex: "avgPrice", 
      key: "avgPrice",
      render: (price: number | undefined) => price ? `$${price}` : '-'
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      width: 200,
      render: (tags: string[] = []) => {
        if (!tags.length) return '-';
        
        const visibleTags = tags.slice(0, 2);
        const remainingCount = tags.length - 2;
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {visibleTags.map((tag, i) => (
              <Tag color="purple" key={`${tag}-${i}`} style={{ margin: 0 }}>
                {tag.toUpperCase()}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tooltip title={tags.slice(2).join(', ')}>
                <Tag color="default" style={{ margin: 0 }}>
                  +{remainingCount}
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    { 
      title: "Created", 
      dataIndex: "createdAt", 
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: any, record: JobCategoryTableRow) => (
        <Space size="middle">
          <Button type="link" onClick={() => openEdit(record.key)}>
            Edit
          </Button>
          {record.status === "Archived" ? (
            <Popconfirm 
              title="Activate this category?" 
              description="This will make the category available for new jobs."
              onConfirm={() => handleStatusChange(record.key, "Active", "activated")}
              okText="Yes, Activate"
              cancelText="Cancel"
              placement="topRight"
            >
              <Button type="link" style={{ color: "green" }}>
                Activate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm 
              title="Archive this category?" 
              description="This will hide it from service providers and customers."
              onConfirm={() => handleStatusChange(record.key, "Archived", "archived")}
              okText="Yes, Archive" 
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button type="link" danger>
                Archive
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateJobCategory = async (values: CreateJobCategoryData) => {
    try {
      await createJobCategory(values);
      message.success("Job category created successfully");
      closeAdd();
    } catch (error) {
      message.error("Failed to create job category");
    }
  };

  const handleUpdateJobCategory = async (id: string, values: UpdateJobCategoryData) => {
    try {
      await updateJobCategory(id, values);
      message.success("Job category updated successfully");
      closeEdit();
    } catch (error) {
      message.error("Failed to update job category");
    }
  };

  const handleStatusChange = async (key: string, newStatus: string, actionName: string) => {
    try {
      await changeStatus(key, newStatus);
      message.success(`Category ${actionName.toLowerCase()} successfully`);
    } catch (error) {
      message.error(`Failed to ${actionName.toLowerCase()} category`);
    }
  };

  // Summary statistics
  const stats = useMemo(() => {
    const active = jobCategories.filter(cat => cat.status === "Active").length;
    const totalJobs = jobCategories.reduce((sum, cat) => sum + (cat.jobsCount || 0), 0);
    const avgPrice = jobCategories.length > 0 
      ? (jobCategories.reduce((sum, cat) => sum + (cat.avgPrice || 0), 0) / jobCategories.length).toFixed(0)
      : 0;

    return { total: jobCategories.length, active, totalJobs, avgPrice };
  }, [jobCategories]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            Job Categories Management
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Manage service categories for your home service platform
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<TagsOutlined className="text-xl" />} 
          size="large" 
          onClick={openAdd}
        >
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '16px' 
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
            {stats.total}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Categories</div>
        </div>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
            {stats.active}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Active Categories</div>
        </div>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#722ed1' }}>
            {stats.totalJobs}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Jobs</div>
        </div>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
            ${stats.avgPrice}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Avg Price</div>
        </div>
      </div>

      {/* Search */}
      <Input 
        prefix={<Search />} 
        placeholder="Search categories by name, description, or tags..." 
        allowClear 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '400px' }}
      />

      {/* Table */}
      <Table 
        columns={columns} 
        dataSource={filteredCategories} 
        rowKey="key"
        scroll={{ x: 'max-content' }}
        size="middle"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} categories`,
        }}
      />

      {/* Modals */}
      <AddJobCategoryModal 
        open={addOpen} 
        onCancel={closeAdd} 
        confirmLoading={isMutating} 
        onCreate={handleCreateJobCategory} 
      />
      <EditJobCategoryModal 
        open={editOpen} 
        initialData={editingJobCategory}
        onCancel={closeEdit} 
        onUpdate={handleUpdateJobCategory} 
        confirmLoading={isMutating} 
      />
    </div>
  );
}

export default JobCategories;