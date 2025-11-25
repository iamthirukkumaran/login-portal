// lib/auth/permissions.ts
// Role-based access control definitions

export type UserRole = "student" | "teacher" | "superadmin";

// Role definitions with their capabilities
export const ROLE_DEFINITIONS = {
  student: {
    canView: ["profile", "marks"],
    canEdit: ["profile"],
    canAccess: ["/dashboard/profile"],
  },
  teacher: {
    canView: ["students", "marks", "profile"],
    canEdit: ["marks"],
    canAccess: ["/dashboard/students", "/dashboard/profile"],
  },
  superadmin: {     
    canView: ["students", "teachers", "marks", "profile"],
    canEdit: ["students", "teachers", "marks"],
    canAccess: ["/dashboard/students", "/dashboard/teachers", "/dashboard/profile"],
  },
};

// Route access matrix
export const ROUTE_ACCESS = {
  "/dashboard/students": ["teacher", "superadmin"],
  "/dashboard/teachers": ["superadmin"],
  "/dashboard/profile": ["student", "teacher", "superadmin"],
  "/dashboard": ["student", "teacher", "superadmin"],
};

// Check if user has access to route
export function hasRouteAccess(pathname: string, userRole?: UserRole): boolean {
  if (!userRole) return false;

  // Check exact route match first
  if (ROUTE_ACCESS[pathname as keyof typeof ROUTE_ACCESS]) {
    return ROUTE_ACCESS[pathname as keyof typeof ROUTE_ACCESS].includes(userRole);
  }

  // Check route prefix for nested routes
  for (const [route, roles] of Object.entries(ROUTE_ACCESS)) {
    if (pathname.startsWith(route)) {
      return roles.includes(userRole);
    }
  }

  return false;
}

// Check if user can perform an action
export function canPerformAction(
  action: string,
  userRole?: UserRole
): boolean {
  if (!userRole) return false;

  const rolePerms = ROLE_DEFINITIONS[userRole];
  if (action === "view") {
    return true; // All roles can view their allowed pages
  }

  if (action === "edit" || action === "create" || action === "delete") {
    return rolePerms.canEdit && rolePerms.canEdit.length > 0;
  }

  return false;
}

// Get user's accessible routes
export function getAccessibleRoutes(userRole?: UserRole): string[] {
  if (!userRole) return ["/login"];
  return ROLE_DEFINITIONS[userRole].canAccess;
}

// Redirect destination based on role
export function getDefaultDashboard(userRole?: UserRole): string {
  if (!userRole) return "/login";

  switch (userRole) {
    case "student":
      return "/dashboard/profile";
    case "teacher":
      return "/dashboard/students";
    case "superadmin":
      return "/dashboard/students"; // or /dashboard/teachers
    default:
      return "/login";
  }
}
