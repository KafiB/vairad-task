import {
  LayoutDashboard,
  ListTodo,
  PenTool,
  Images,
  Users,
  Tag,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    functional: true,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
    functional: true,
  },

  {
    label: "Annotate",
    href: "/annotate",
    icon: PenTool,
    functional: true,
  },

  {
    label: "Images",
    href: "/images",
    icon: Images,
    functional: true,
  },
  
  
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    functional: true,
  },
  
];