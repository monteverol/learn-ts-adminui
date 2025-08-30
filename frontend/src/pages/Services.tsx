import React, { useState } from 'react';
import { Table, Card, Tabs, Input, Select, Button, Tag, Space, Row, Col, Statistic, Dropdown, Modal, Typography, Avatar, Spin, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, MoreOutlined, UserOutlined, CalendarOutlined, DollarOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import type { Service, Booking } from "./Services.types";
import type { Booking as BookingAPI } from "../types/booking";
import type { ColumnsType, TableProps } from 'antd/es/table';
import useGetAllServices from '../hooks/services/useGetAllServices';
import useGetAllBookings from '../hooks/bookings/useGetAllBookings';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  // Use the hook for services data
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    page: servicesPage,
    pageSize: servicesPageSize,
    total: servicesTotal,
    search: servicesSearch,
    setSearch: setServicesSearch,
    status: servicesStatus,
    setStatus: setServicesStatus,
    sort: servicesSort,
    setSort: setServicesSort,
    setPage: setServicesPage,
    setPageSize: setServicesPageSize,
    refetch: refetchServices,
    resetFilters: resetServicesFilters
  } = useGetAllServices();

  // Use the hook for bookings data
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    page: bookingsPage,
    pageSize: bookingsPageSize,
    total: bookingsTotal,
    search: bookingsSearch,
    setSearch: setBookingsSearch,
    status: bookingsStatus,
    setStatus: setBookingsStatus,
    sort: bookingsSort,
    setSort: setBookingsSort,
    setPage: setBookingsPage,
    setPageSize: setBookingsPageSize,
    refetch: refetchBookings,
    resetFilters: resetBookingsFilters
  } = useGetAllBookings();

  // Transform services data to match the expected format
  const transformedServices: Service[] = services.map(service => ({
    key: service.id,
    id: service.id,
    name: service.name,
    category: service.category,
    price: service.price,
    duration: service.duration,
    status: service.status.toLowerCase() as 'active' | 'inactive',
    description: service.description || '',
    providersCount: service.providersCount
  }));

  // Transform bookings data to match the expected format
  const transformedBookings: Booking[] = bookings.map(booking => ({
    key: booking.id,
    id: booking.id,
    serviceName: booking.serviceName,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    date: booking.date,
    time: booking.time,
    status: booking.status.toLowerCase().replace('_', '-') as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
    provider: booking.provider,
    price: booking.price,
    address: booking.address
  }));

  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'inactive':
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'processing';
      default:
        return 'default';
    }
  };

  const serviceActions = (record: Service) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
      onClick: () => console.log('View', record)
    },
    {
      key: 'edit',
      label: 'Edit Service',
      icon: <EditOutlined />,
      onClick: () => console.log('Edit', record)
    },
    {
      key: 'delete',
      label: 'Delete Service',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => console.log('Delete', record)
    }
  ];

  const bookingActions = (record: Booking) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
      onClick: () => console.log('View', record)
    },
    {
      key: 'edit',
      label: 'Edit Booking',
      icon: <EditOutlined />,
      onClick: () => console.log('Edit', record)
    }
  ];

  const serviceColumns: ColumnsType<Service> = [
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Service) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
      sorter: true,
      sortOrder: servicesSort.field === 'name' ? (servicesSort.order === 'ascend' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Cleaning', value: 'Cleaning' },
        { text: 'Maintenance', value: 'Maintenance' },
        { text: 'Gardening', value: 'Gardening' },
        { text: 'Pet Care', value: 'Pet Care' }
      ],
      onFilter: (value, record) => record.category === String(value)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
      sorter: true,
      sortOrder: servicesSort.field === 'price' ? (servicesSort.order === 'ascend' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => (
        <Space>
          <ClockCircleOutlined />
          {duration}
        </Space>
      )
    },
    {
      title: 'Providers',
      dataIndex: 'providersCount',
      key: 'providersCount',
      render: (count: number) => (
        <Space>
          <UserOutlined />
          {count}
        </Space>
      ),
      sorter: true,
      sortOrder: servicesSort.field === 'providersCount' ? (servicesSort.order === 'ascend' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === String(value)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{ items: serviceActions(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  const bookingColumns: ColumnsType<Booking> = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => <Text strong>{id}</Text>
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      filteredValue: bookingsSearch ? [bookingsSearch] : null,
      onFilter: (value, record) => {
        const v = String(value).toLowerCase();
        return(
          record.serviceName.toLowerCase().includes(v) ||
          record.customerName.toLowerCase().includes(v) ||
          record.provider.toLowerCase().includes(v)
        );
      }
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
            <UserOutlined style={{ marginRight: 6 }} />
            {record.customerName}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.customerPhone}
          </Text>
        </div>
      )
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 2 }}>
            <CalendarOutlined style={{ marginRight: 6 }} />
            {record.date}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {record.time}
          </Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {provider}
        </Space>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Space>
          <DollarOutlined />
          ${price}
        </Space>
      ),
      sorter: (a: Booking, b: Booking) => a.price - b.price
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase().replace('-', ' ')}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === String(value)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{ items: bookingActions(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Handle services table change events (pagination, sorting, filtering)
  const handleServicesTableChange: TableProps<Service>['onChange'] = (pagination, filters, sorter) => {
    // Handle pagination
    if (pagination.current && pagination.current !== servicesPage) {
      setServicesPage(pagination.current);
    }
    if (pagination.pageSize && pagination.pageSize !== servicesPageSize) {
      setServicesPageSize(pagination.pageSize);
    }

    // Handle sorting
    if (sorter && !Array.isArray(sorter)) {
      if (sorter.field && sorter.order) {
        setServicesSort({
          field: String(sorter.field),
          order: sorter.order
        });
      } else {
        setServicesSort({});
      }
    }
  };

  // Handle bookings table change events (pagination, sorting, filtering)
  const handleBookingsTableChange: TableProps<Booking>['onChange'] = (pagination, filters, sorter) => {
    // Handle pagination
    if (pagination.current && pagination.current !== bookingsPage) {
      setBookingsPage(pagination.current);
    }
    if (pagination.pageSize && pagination.pageSize !== bookingsPageSize) {
      setBookingsPageSize(pagination.pageSize);
    }

    // Handle sorting
    if (sorter && !Array.isArray(sorter)) {
      if (sorter.field && sorter.order) {
        setBookingsSort({
          field: String(sorter.field),
          order: sorter.order
        });
      } else {
        setBookingsSort({});
      }
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>Services Management</Title>
          <Text type="secondary">Manage your home services and track bookings</Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Services"
                value={servicesTotal}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={bookingsTotal}
                prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Bookings"
                value={transformedBookings.filter(b => b.status === 'pending').length}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={transformedBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)}
                prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
                precision={0}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarExtraContent={
              activeTab === 'services' ? (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Add Service
                </Button>
              ) : null
            }
          >
            <TabPane tab="Manage Services" key="services">
              <div style={{ marginBottom: '16px' }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <Input
                      placeholder="Search services..."
                      prefix={<SearchOutlined />}
                      value={servicesSearch}
                      onChange={(e) => setServicesSearch(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      placeholder="Filter by status"
                      style={{ width: '100%' }}
                      value={servicesStatus || 'all'}
                      onChange={(value) => setServicesStatus(value === 'all' ? null : value)}
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="ACTIVE">Active</Option>
                      <Option value="INACTIVE">Inactive</Option>
                    </Select>
                  </Col>
                </Row>
              </div>
              
              {servicesError && (
                <Alert
                  message="Error"
                  description={servicesError.message}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              
              <Table
                columns={serviceColumns}
                dataSource={transformedServices}
                loading={servicesLoading}
                pagination={{
                  current: servicesPage,
                  pageSize: servicesPageSize,
                  total: servicesTotal,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} services`
                }}
                onChange={handleServicesTableChange}
                scroll={{ x: 1200 }}
              />
            </TabPane>

            <TabPane tab="Bookings & Requests" key="bookings">
              <div style={{ marginBottom: '16px' }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <Input
                      placeholder="Search bookings..."
                      prefix={<SearchOutlined />}
                      value={bookingsSearch}
                      onChange={(e) => setBookingsSearch(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      placeholder="Filter by status"
                      style={{ width: '100%' }}
                      value={bookingsStatus || 'all'}
                      onChange={(value) => setBookingsStatus(value === 'all' ? null : value)}
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="PENDING">Pending</Option>
                      <Option value="CONFIRMED">Confirmed</Option>
                      <Option value="IN_PROGRESS">In Progress</Option>
                      <Option value="COMPLETED">Completed</Option>
                      <Option value="CANCELLED">Cancelled</Option>
                    </Select>
                  </Col>
                </Row>
              </div>

              {bookingsError && (
                <Alert
                  message="Error"
                  description={bookingsError.message}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              <Table
                columns={bookingColumns}
                dataSource={transformedBookings}
                loading={bookingsLoading}
                pagination={{
                  current: bookingsPage,
                  pageSize: bookingsPageSize,
                  total: bookingsTotal,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`
                }}
                onChange={handleBookingsTableChange}
                scroll={{ x: 1400 }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Add Service Modal */}
        <Modal
          title="Add New Service"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary">
              Add Service
            </Button>
          ]}
        >
          <p>Add service form would go here...</p>
        </Modal>
      </div>
    </div>
  );
};

export default Services;