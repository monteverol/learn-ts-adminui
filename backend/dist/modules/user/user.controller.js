import { UserService } from './user.service.js';
const seedUsers = [
    {
        key: "1",
        name: "John Brown",
        address: "New York No. 1 Lake Park",
        age: 32,
        status: "Active",
        tags: ["Maintenance", "Gardening", "Housekeeping"],
        jobTitle: "Maintenance Technician",
        jobCategory: "Maintenance",
        yearsExperience: 6,
        bio: "Detail-oriented tech keeping facilities in top shape.",
        description: "Specializes in preventive maintenance and scheduling.",
        workExperience: [
            {
                id: "exp1",
                company: "Metropolitan Facilities Inc.",
                position: "Senior Maintenance Technician",
                startDate: "2020-03",
                endDate: null,
                isCurrent: true,
                description: "Lead maintenance operations for 50+ residential buildings. Implemented preventive maintenance schedules that reduced emergency repairs by 40%.",
                responsibilities: [
                    "Supervise team of 5 maintenance staff",
                    "Coordinate with vendors and contractors",
                    "Manage inventory and equipment procurement",
                    "Conduct safety inspections and training"
                ]
            },
            {
                id: "exp2",
                company: "City Housing Authority",
                position: "Maintenance Technician",
                startDate: "2018-01",
                endDate: "2020-02",
                isCurrent: false,
                description: "Performed routine maintenance and repairs on public housing units. Specialized in plumbing, electrical, and HVAC systems.",
                responsibilities: [
                    "Responded to maintenance requests within 24 hours",
                    "Maintained accurate work order documentation",
                    "Collaborated with residents to schedule repairs"
                ]
            }
        ]
    },
    {
        key: "2",
        name: "Jim Green",
        address: "London No. 1 Lake Park",
        age: 34,
        status: "Active",
        tags: ["Logistics"],
        jobTitle: "Logistics Coordinator",
        jobCategory: "Operations",
        yearsExperience: 8,
        bio: "Ops-minded coordinator.",
        description: "Focus on route planning and inventory accuracy.",
        workExperience: [
            {
                id: "exp3",
                company: "Global Supply Chain Ltd.",
                position: "Senior Logistics Coordinator",
                startDate: "2019-06",
                endDate: null,
                isCurrent: true,
                description: "Oversee logistics operations for international shipping routes. Manage relationships with carriers and optimize delivery schedules.",
                responsibilities: [
                    "Coordinate shipments across 15+ countries",
                    "Optimize route planning using advanced software",
                    "Negotiate contracts with shipping partners",
                    "Monitor KPIs and improve delivery times"
                ]
            },
            {
                id: "exp4",
                company: "Regional Transport Co.",
                position: "Logistics Assistant",
                startDate: "2016-09",
                endDate: "2019-05",
                isCurrent: false,
                description: "Supported logistics operations for regional deliveries. Maintained inventory tracking systems and coordinated with drivers.",
                responsibilities: [
                    "Processed shipping documentation",
                    "Tracked inventory levels and reorder points",
                    "Coordinated with warehouse staff"
                ]
            }
        ]
    },
    {
        key: "3",
        name: "Joe Black",
        address: "Sidney No. 1 Lake Park",
        age: 32,
        status: "Archived",
        tags: ["Handyman", "Laundry"],
        jobTitle: "Handyman",
        jobCategory: "Maintenance",
        yearsExperience: 5,
        bio: "All-around fixer.",
        description: "Handles general repairs and laundry equipment upkeep.",
        workExperience: [
            {
                id: "exp5",
                company: "Residential Services Plus",
                position: "General Handyman",
                startDate: "2019-01",
                endDate: "2024-08",
                isCurrent: false,
                description: "Provided comprehensive handyman services for residential properties. Specialized in small repairs, installations, and maintenance tasks.",
                responsibilities: [
                    "Performed carpentry, plumbing, and electrical repairs",
                    "Installed fixtures and appliances",
                    "Maintained laundry equipment in apartment complexes",
                    "Provided excellent customer service to tenants"
                ]
            }
        ]
    }
];
export const create = async (req, res) => {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
};
export const list = async (_req, res) => {
    const users = await UserService.findAll();
    res.json(users);
};
export const getById = async (req, res) => {
    const user = await UserService.findById(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'NotFound' });
    res.json(user);
};
export const update = async (req, res) => {
    const user = await UserService.update(req.params.id, req.body);
    res.json(user);
};
export const remove = async (req, res) => {
    await UserService.softDelete(req.params.id);
    res.status(204).end();
};
