export const rolePermissions = {
    admin: ["GET", "POST", "PUT", "DELETE"],
    staff: ["GET", "POST", "PUT", "DELETE"],
    branchmanager: ["GET", "POST", "PUT", "DELETE"],
    superadmin: ["GET", "POST", "PUT", "DELETE"]
};


export const routePermissions = {
    admin: ["/admin", "/permission"],
    staff: ["/staff", "/transport"],
    branchmanager: ["/branch", "/transport"],
    superadmin: ["/branch", "/staff", "/transport"]
};

export const hasMethodPermission = (role, method) => {
    return rolePermissions[role]?.includes(method) || false;
};

export const hasRoutePermission = (role, route) => {
    return routePermissions[role]?.some(r => route.startsWith(r)) || false;
};

export default {
    rolePermissions,
    routePermissions,
    hasMethodPermission,
    hasRoutePermission
};