import { useParams, useNavigate } from "react-router-dom";
import useGetUser from "../hooks/users/useGetUser";
import { Card, Tag, Avatar, Typography, Row, Col, Divider, Button, Space, Descriptions, Badge, Statistic, Alert, Timeline, Spin } from "antd";
import { UserOutlined, EditOutlined, ArrowLeftOutlined, BuildOutlined, EnvironmentOutlined, ClockCircleOutlined, CalendarOutlined, ProjectOutlined, TagsOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Tag {
  id: string;
  name: string;
}

interface Responsibility {
  id: string;
  title: string;
  workExperienceId: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: Responsibility[];
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
  workExperience: WorkExperience[];
  createdAt: string;
  updatedAt: string;
}

interface RouteParams {
  id: string;
}

export default function UserProfile() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { user, loading, error, refetch } = useGetUser(id);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Alert
          message={error || "User Not Found"}
          description={error || "The requested user profile could not be found."}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => refetch()}>
                Retry
              </Button>
              <Button size="small" onClick={() => navigate('/users')}>
                Back to Users
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  const getStatusColor = (status: string): 'success' | 'default' | 'processing' => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'ARCHIVED': return 'default';
      default: return 'processing';
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const calculateDuration = (startDate: string, endDate: string | null): string => {
    if (!startDate) return '';
    
    const start = new Date(startDate + '-01');
    const end = endDate ? new Date(endDate + '-01') : new Date();
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/users')}
          >
            Back to Users
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Overview */}
        <Col xs={24} lg={8}>
          {/* Main Profile Card */}
          <Card
            style={{ textAlign: 'center', marginBottom: '24px' }}
            bodyStyle={{ padding: '40px 24px' }}
          >
            <Avatar 
              size={120} 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: user.status === 'ACTIVE' ? '#52c41a' : '#8c8c8c',
                marginBottom: '16px'
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            
            <Title level={2} style={{ marginBottom: '8px', marginTop: '16px' }}>
              {user.name}
            </Title>
            
            <Space direction="vertical" size="small">
              <Badge 
                status={getStatusColor(user.status)} 
                text={
                  <Text strong style={{ fontSize: '16px' }}>
                    {user.status}
                  </Text>
                } 
              />
              
              <Space>
                <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary">{user.address}</Text>
              </Space>
              
              <Space>
                <CalendarOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary">{user.age} years old</Text>
              </Space>
            </Space>

            {user.bio && (
              <>
                <Divider />
                <Paragraph 
                  style={{ 
                    fontStyle: 'italic', 
                    color: '#666',
                    margin: 0 
                  }}
                >
                  "{user.bio}"
                </Paragraph>
              </>
            )}
          </Card>

          {/* Quick Stats Card */}
          <Card title="Quick Stats" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Experience"
                  value={user.yearsExperience || 0}
                  suffix="years"
                  valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Skills"
                  value={(user.tags || []).length}
                  suffix="tags"
                  valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Jobs"
                  value={(user.workExperience || []).length}
                  suffix="roles"
                  valueStyle={{ color: '#722ed1', fontSize: '18px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Detailed Information */}
        <Col xs={24} lg={16}>
          {/* Professional Information */}
          <Card 
            title={
              <Space>
                <ProjectOutlined />
                Professional Information
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item 
                label="Job Title"
                labelStyle={{ fontWeight: 600, width: '200px' }}
              >
                {user.jobTitle ? (
                  <Text strong style={{ color: '#1890ff' }}>
                    {user.jobTitle}
                  </Text>
                ) : (
                  <Text type="secondary">Not specified</Text>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Category"
                labelStyle={{ fontWeight: 600 }}
              >
                {user.jobCategory ? (
                  <Tag color="blue" style={{ fontSize: '13px' }}>
                    {user.jobCategory}
                  </Tag>
                ) : (
                  <Text type="secondary">Not specified</Text>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Years of Experience"
                labelStyle={{ fontWeight: 600 }}
              >
                <Space>
                  <Badge 
                    count={user.yearsExperience || 0} 
                    style={{ backgroundColor: '#52c41a' }} 
                  />
                  <Text>
                    {user.yearsExperience ? 
                      `${user.yearsExperience} ${user.yearsExperience === 1 ? 'year' : 'years'}` : 
                      'No experience specified'
                    }
                  </Text>
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Description"
                labelStyle={{ fontWeight: 600 }}
              >
                {user.description ? (
                  <Paragraph style={{ margin: 0 }}>
                    {user.description}
                  </Paragraph>
                ) : (
                  <Text type="secondary">No description provided</Text>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Work Experience */}
          <Card 
            title={
              <Space>
                <BuildOutlined />
                Work Experience
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            {user.workExperience && user.workExperience.length > 0 ? (
              <Timeline mode="left">
                {user.workExperience
                  .sort((a, b) => {
                    // Sort by start date, most recent first
                    if (a.isCurrent && !b.isCurrent) return -1;
                    if (!a.isCurrent && b.isCurrent) return 1;
                    return new Date(b.startDate + '-01') - new Date(a.startDate + '-01');
                  })
                  .map((exp, index) => (
                    <Timeline.Item 
                      key={exp.id}
                      dot={exp.isCurrent ? 
                        <ClockCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} /> : 
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: '#d9d9d9', 
                          borderRadius: '50%' 
                        }} />
                      }
                      color={exp.isCurrent ? 'green' : 'gray'}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        {/* Header */}
                        <div style={{ marginBottom: '8px' }}>
                          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            {exp.position}
                          </Title>
                          <Text strong style={{ fontSize: '15px', color: '#666' }}>
                            {exp.company}
                          </Text>
                          {exp.isCurrent && (
                            <Tag color="green" style={{ marginLeft: '8px', fontSize: '11px' }}>
                              Current
                            </Tag>
                          )}
                        </div>
                        
                        {/* Duration */}
                        <Space style={{ marginBottom: '12px' }}>
                          <CalendarOutlined style={{ color: '#8c8c8c' }} />
                          <Text type="secondary">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            ({calculateDuration(exp.startDate, exp.endDate)})
                          </Text>
                        </Space>
                        
                        {/* Description */}
                        {exp.description && (
                          <Paragraph style={{ marginBottom: '12px', color: '#555' }}>
                            {exp.description}
                          </Paragraph>
                        )}
                        
                        {/* Responsibilities */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div>
                            <Text strong style={{ fontSize: '13px', color: '#666' }}>
                              Key Responsibilities:
                            </Text>
                            <ul style={{ 
                              marginTop: '6px', 
                              marginBottom: '0',
                              paddingLeft: '20px',
                              color: '#666'
                            }}>
                              {exp.responsibilities.map((responsibility) => (
                                <li key={responsibility.id} style={{ marginBottom: '4px', fontSize: '13px' }}>
                                  {responsibility.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Timeline.Item>
                  ))
                }
              </Timeline>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <BuildOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <br />
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  No work experience recorded
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Work history will appear here once added
                </Text>
              </div>
            )}
          </Card>

          {/* Skills & Tags */}
          <Card 
            title={
              <Space>
                <TagsOutlined />
                Skills & Tags
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            {user.tags && user.tags.length > 0 ? (
              <div>
                <Space wrap size="middle">
                  {user.tags.map((tag) => (
                    <Tag 
                      key={tag.id} 
                      color="green" 
                      style={{ 
                        fontSize: '13px',
                        padding: '4px 12px',
                        borderRadius: '16px'
                      }}
                    >
                      {tag.name.toUpperCase()}
                    </Tag>
                  ))}
                </Space>
                <Divider style={{ margin: '16px 0 8px 0' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user.tags.length} skill{user.tags.length !== 1 ? 's' : ''} listed
                </Text>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <TagsOutlined style={{ fontSize: '24px', color: '#d9d9d9', marginBottom: '8px' }} />
                <br />
                <Text type="secondary">No skills or tags specified</Text>
              </div>
            )}
          </Card>

          {/* Personal Information */}
          <Card 
            title={
              <Space>
                <InfoCircleOutlined />
                Personal Information
              </Space>
            }
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item 
                label="Full Name"
                span={2}
                labelStyle={{ fontWeight: 600 }}
              >
                <Text strong>{user.name}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Age"
                labelStyle={{ fontWeight: 600 }}
              >
                {user.age} years old
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Status"
                labelStyle={{ fontWeight: 600 }}
              >
                <Badge 
                  status={getStatusColor(user.status)} 
                  text={user.status}
                />
              </Descriptions.Item>
              
              <Descriptions.Item 
                label="Address"
                span={2}
                labelStyle={{ fontWeight: 600 }}
              >
                <Space>
                  <EnvironmentOutlined style={{ color: '#1890ff' }} />
                  {user.address}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}