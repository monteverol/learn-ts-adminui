import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { 
  Input, 
  Button, 
  Table, 
  Tag, 
  Space, 
  message, 
  Popconfirm, 
  Tooltip, 
  Row, 
  Col, 
  Select,
  Typography 
} from "antd";
import useGetAllUsers from "../hooks/users/useGetAllUsers";
import useCreateUser from "../hooks/users/useCreateUser";
import useUpdateUser from "../hooks/users/useUpdateUser";
import AddUserModal from "../components/modals/AddUserModal";
import EditUserModal from "../components/modals/EditUserModal";
interface Tag {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  age?: number;
  address?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  jobTitle?: string;
  jobCategory?: 'MAINTENANCE' | 'OPERATIONS' | 'OTHER';
  yearsExperience?: number;
  bio?: string;
  description?: string;
  tags: Tag[];
  workExperience: any[];
  createdAt: string;
  updatedAt: string;
}

const { Title } = Typography;

const STATUS_OPTIONS = ["ACTIVE", "ARCHIVED"];
const JOB_CATEGORIES = ["MAINTENANCE", "OPERATIONS", "OTHER"];

function Users(): React.JSX.Element {
  const { users, loading, error, filter, updateFilter, meta, setPage, setLimit, refetch } = useGetAllUsers();
  const { createUser, loading: createLoading } = useCreateUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user: User) => {
      const matchesSearch = !searchQuery || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesCategory = !categoryFilter || user.jobCategory === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [users, searchQuery, statusFilter, categoryFilter]);

  // CRUD handlers
  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      setAddModalOpen(false);
      refetch();
    } catch (error) {
      // Error message is handled in the hook
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, userData);
      setEditModalOpen(false);
      setSelectedUser(undefined);
      refetch();
    } catch (error) {
      // Error message is handled in the hook
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUser(userId, { status: newStatus });
      refetch();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <Link to={`/users/${record.id}`} style={{ color: "#1890ff" }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "gray"}>
          {status === "ACTIVE" ? "Active" : "Archived"}
        </Tag>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age: number | undefined) => age || '-',
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address: string | undefined) => address || '-',
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      ellipsis: true,
      render: (jobTitle: string | undefined) => jobTitle || '-',
    },
    {
      title: "Category",
      dataIndex: "jobCategory",
      key: "jobCategory",
      render: (category: string | undefined) => category || '-',
    },
    {
      title: "Yrs Exp.",
      dataIndex: "yearsExperience",
      key: "yearsExperience",
      render: (years: number | undefined) => years || '-',
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      width: 200,
      render: (tags: any[] = []) => {
        if (!tags || !tags.length) return '-';
        
        const visibleTags = tags.slice(0, 2);
        const remainingCount = tags.length - 2;
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {visibleTags.map((tag) => (
              <Tag color="green" key={tag.id} style={{ margin: 0 }}>
                {tag.name.toUpperCase()}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tooltip title={tags.slice(2).map(t => t.name).join(', ')}>
                <Tag color="blue" style={{ margin: 0 }}>
                  +{remainingCount}
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            disabled={updateLoading}
          >
            Edit
          </Button>
          {record.status === "ARCHIVED" ? (
            <Popconfirm
              title="Activate user?"
              onConfirm={() => handleStatusChange(record.id, "ACTIVE")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" style={{ color: "green" }} disabled={updateLoading}>
                Activate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Archive user?"
              okText="Archive"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleStatusChange(record.id, "ARCHIVED")}
            >
              <Button type="link" danger disabled={updateLoading}>
                Archive
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading users: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <Title level={3} style={{ margin: 0 }}>
          User Management
        </Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          size="large"
          onClick={() => setAddModalOpen(true)}
          disabled={createLoading}
        >
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={12}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, address, job, tags, bio…"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search users"
          />
        </Col>
        <Col xs={12} md={6}>
          <Select
            allowClear
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS.map((s) => ({ 
              value: s, 
              label: s === "ACTIVE" ? "Active" : "Archived" 
            }))}
            className="w-full"
          />
        </Col>
        <Col xs={12} md={6}>
          <Select
            allowClear
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={JOB_CATEGORIES.map((c) => ({ 
              value: c, 
              label: c.charAt(0) + c.slice(1).toLowerCase() 
            }))}
            className="w-full"
          />
        </Col>
      </Row>
      
      {/* Table */}
      <Table 
        columns={columns} 
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        size="middle"
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.limit || 10,
          total: meta?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} users`,
          onChange: (page, pageSize) => {
            if (pageSize !== meta.limit) {
              setLimit(pageSize);
            } else {
              setPage(page);
            }
          },
        }}
      />

      {/* Modals */}
      <AddUserModal
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onCreate={handleCreateUser}
        confirmLoading={createLoading}
      />

      <EditUserModal
        open={editModalOpen}
        user={selectedUser}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSave={handleUpdateUser}
        confirmLoading={updateLoading}
      />
    </div>
  );
}

export default Users;