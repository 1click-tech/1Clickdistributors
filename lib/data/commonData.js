export const roles = [
  "superAdmin",
  "businessAdmin",
  "salesMember",
  "salesManager",
  "accountsManager",
  "accountsMember",
  "serviceMember",
  "serviceManager",
];

export const panelRoles = [
  {
    department: "management",
    hierarchy: [
      "superAdmin",
      "Director",
      "Founder & CEO",
      "Co - Founder & COO",
      "Chief Financial Officer",
      "Chief Strategy Officer",
      "Complaince Officer",
      "General Manager",
      "Assistant General Manager",
    ],
  },
  {
    department: "sales",
    hierarchy: [
      "Vice President",
      "Assistant Vice President",
      "Branch Manager",
      "Manager",
      "Team Manager",
      "Assistant Manager",
      "Sr.Executive",
      "Executive",
      "Intern",
    ],
  },
  {
    department: "Clients Service",
    hierarchy: [
      "Vice President",
      "Assistant Vice President",
      "Branch Manager",
      "Sr. Manager",
      "Manager",
      "Team Manager",
      "Customer Success Manager",
      "Sr. Executive",
      "Executive",
      "Intern",
    ],
  },
  {
    department: "Human Resource",
    hierarchy: [
      "HR Head",
      "Vice President",
      "Assistant Vice President",
      "Sr.Manager HR",
      "HR Manager",
      "Sr.Executive",
      "Executive",
      "Intern",
    ],
  },
  {
    department: "Accounts",
    hierarchy: [
      "Chief Financial Officer",
      "Vice President",
      "Assistant Vice President",
      "Sr. Manager",
      "Manager",
      "Executive",
      "Intern",
    ],
  },
  {
    department: "Technology",
    hierarchy: [
      "IT Head",
      "Vice President",
      "Assistant Vice President",
      "Product Manager",
      "Manager Web Development",
      "Web Developer",
      "Wordpress Developer",
      "MIS Manager",
      "MIS Executive",
      "Manager Digital Marketing",
      "Social Media Marketing Manager",
      "Social Media Marketing Executive",
      "Manager Graphic Design",
      "Graphic Design Executive",
      "Intern",
    ],
  },
  {
    department: "Administration",
    hierarchy: [
      "Admin Head",
      "Sr.Manager",
      "Manager",
      "Executive",
      "Housekeeping Manager",
      "House Keeping Executive",
    ],
  },
];

export const panels = [
  {
    panel: "allocate_leads",
  },
  {
    panel: "sales_panel",
  },
  // {
  //   panel: "service_panel",
  // },
  {
    panel: "manage_users",
  },
  {
    panel: "roles_and_permissions",
  },
  {
    panel: "panel_settings",
  },
];

export const panelNames = {
  allocate_leads: "allocate leads",
  sales_panel: "sales",
  service_panel: "services",
  manage_users: "manage users",
  roles_and_permissions: "roles and permissions",
  panel_settings: "panel settings",
};

export const panelPermissions = [
  {
    panelName: "sales_panel",
    permissions: ["view", "update", "delete", "re-update"],
  },
  {
    panelName: "allocate_leads",
    permissions: ["view", "update", "delete", "allocate_leads"],
  },
  {
    panelName: "HRMS",
    permissions: [
      "view_attendance",
      "view_allusers_attendance",
      "manipulate_attendance",
    ],
  },
  {
    panelName: "manage_users",
    permissions: ["view_users", "edit_users", "edit_password"],
  },
];

export const dispositions = [
  "Not Open",
  "No Response",
  "Call Back",
  "Presentation",
  "FollowUp",
  "Prospect",
  "Payment",
  "Not Interested",
  "Presentation NI",
  "Prospect NI",
  "No Contactable",
  "Become Distributor",
  "Deal Done",
  "Already Paid",
];

export const subDispositions = {
  "Not Open": ["Hot Lead"],
  "No Response": ["Ringing", "S.Off", "Not Reachable", "Hung Up"],
  "Call Back": ["Call Back"],
  Presentation: [
    "Present-Digi Pro",
    "Present-Grow Max",
    "Present-SMM",
    "Present-Website",
    "Present-Other",
  ],
  FollowUp: ["Presentation-Followup"],
  Prospect: ["Prospect-Followup"],
  Payment: ["Payment-Followup"],
  "Not Interested": ["Opted for Competition", "Price Issue", "Not Now"],
  "Presentation NI": ["Opted for Competition", "Price Issue", "Not Now"],
  "Prospect NI": ["Opted for Competition", "Price Issue", "Not Now"],
  "Become Distributor": ["None"],
  "No Contactable": ["Wrong Number", "None"],
  "Deal Done": [
    "Present - Digi Pro",
    "Present - Grow Max",
    "Present - SMM",
    "Present - Website",
    "Present - Other",
  ],
  "Already Paid": ["Already Paid"],
};

export const salesPanelColumns = {
  source: "Source",
  createdAt: "Creation",
  dataTag: "Data Tag",
  profileId: "ProfileId",
  looking_for: "Looking For",
  company_name: "Company Name",
  full_name: "Name",
  your_mobile_number: "Mobile",
  email: "Email",
  city: "City",
  followUpDate: "Followup",
  disposition: "Disposition",
  remarks: "Remarks",
  adType: "Ad Type",
  phone_number: "Phone",
  leadId: "Lead Id",
  assignedAt: "Assigned At",
  createdAt: "Created",
  updatedAt: "Updated",
  subDisposition: "Sub Disposition",
  salesExecutiveName: "Executive",
  "whats_is_your_requirement_?_write_in_brief": "Query",
};

export const leadsPanelColumns = {
  source: "Source",
  createdAt: "Creation",
  dataTag: "Data Tag",
  profileId: "ProfileId",
  looking_for: "Looking For",
  company_name: "Company Name",
  full_name: "Name",
  your_mobile_number: "Mobile",
  email: "Email",
  city: "City",
  followUpDate: "Followup",
  disposition: "Disposition",
  remarks: "Remarks",
  adType: "Ad Type",
  phone_number: "Phone",
  leadId: "Lead Id",
  assignedAt: "Assigned At",
  createdAt: "Created",
  updatedAt: "Updated",
  subDisposition: "Sub Disposition",
  salesExecutiveName: "Executive",
  "whats_is_your_requirement_?_write_in_brief": "Query",
};

export const designations = [
  "Owner",
  "Founder",
  "Co-founder",
  "Director",
  "Proprietor",
  "Partner",
  "Sales officer",
  "Executive",
  "AM",
  "Marketing Manager",
  "Manager",
  "Business Head",
];

export const cellColors = {
  "Not Open": "#cca0a0",
  "No Response": "#ffc491",
  "Call Back": "#8e90c6",
  Presentation: "#87c69a",
  FollowUp: "#f8bec0",
  Prospect: "#32c934",
  Payment: "#a88e1f",
  "Not Interested": "#f8634e",
  "Presentation NI": "#7D3C98",
  "Prospect NI": "#13856D",
  "No Contactable": "#e4e0e0",
  "Become Distributor": "#f8bea5",
  "Deal Done": "#12f628",
  Today_Followup: "#AF7AC5",
  "Presentation-Followup": "#2874A6",
  "Prospect-Followup": "#117A65",
  "Video Meet": "#f690a8",
  "Payment-Followup": "#864507",
  "Hot Lead": "#E52020",
};
