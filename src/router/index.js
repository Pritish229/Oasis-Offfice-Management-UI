// router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// ✅ Export routes separately
export const routes = [
	{
		path: "/",
		redirect: "/login"
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/Auth/Login.vue")
	},
	{
		path: "/reset-password/new/:useremail",
		component: () => import("@/views/Auth/SetNewPassword.vue"),
		beforeEnter: (to, from, next) => {
			const verified = localStorage.getItem("otp_verified") === "true";
			if (verified) {
				next();
			} else {
				next("/reset-password");
			}
		}
	},
	{
		path: "/Reset-Password",
		name: "Reset-password",
		component: () => import("@/views/Auth/ResetPassword.vue")
	},
	{
		path: "/unauthorized",
		name: "Unauthorized",
		component: () => import("@/views/Auth/Unauthorized.vue")
	},
	{
		path: "/app",
		component: () => import("@/components/LAYOUT/APPLayout.vue"),
		redirect: "/app/dashboard",
		meta: { requiresAuth: true },
		children: [
			{
				path: "dashboard",
				name: "Dashboard",
				component: () => import("@/views/Dashboard/Home.vue"),
				meta: {
					requiresAuth: true,
					permissions: ["view-dashboard"],
					title: "Dashboard",
					breadcrumb: [
						{ label: "Home", to: "/" },
						{ label: "Dashboard", to: "/app/dashboard" }
					]
				}
			},
			{
				path: "users",
				meta: { requiresAuth: true },
				children: [
					{
						path: "manage",
						name: "ManageUsers",
						component: () =>
							import("@/views/Dashboard/ManageUsers/UserList.vue"),
						meta: {
							permissions: ["view-users","manage-users"],
							title: "Manage Users",
							breadcrumb: [
								{ label: "Home", to: "/app/dashboard" },
								{ label: "Manage Users", to: "/app/users/manage" }
							]
						}
					},
					{
						path: "add",
						name: "AddUsers",
						component: () =>
							import("@/views/Dashboard/ManageUsers/Addusers.vue"),
						meta: {
							permissions: ["manage-users", "create-users"],
							title: "Add Users",
							breadcrumb: [
								{ label: "Home", to: "/app/dashboard" },
								{ label: "Manage Users", to: "/app/users/manage" },
								{ label: "Add Users", to: "/app/users/add" }
							]
						}
					},
					{
						path: "Update/:id",
						name: "UpdateUsers",
						component: () =>
							import("@/views/Dashboard/ManageUsers/UpdateUser.vue"),
						meta: {
							permissions: ["manage-users", "update-users"],
							title: "Update User",
							breadcrumb: [
								{ label: "Home", to: "/app/dashboard" },
								{ label: "Manage Users", to: "/app/users/manage" },
								{ label: "Update User", to: "/app/users/Update/:id" }
							]
						}
					},
					{
						path: "Details/:id",
						name: "UserDetails                                                                                                                                                                                              ",
						component: () =>
							import("@/views/Dashboard/ManageUsers/UserDetails.vue"),
						meta: {
							permissions: ["manage-users", "view-users-details"],
							title: "User Details",
							breadcrumb: [
								{ label: "Home", to: "/app/dashboard" },
								{ label: "Manage Users", to: "/app/users/manage" },
								{ label: "User Details", to: "/app/users/Details/:id" }
							]
						}
					}
				]
			},
			{
				path: "managerole",
				name: "managerole",
				component: () =>
					import("@/views/Dashboard/ManageRolePermission/RolePermission.vue"),
				meta: {
					permissions: ["manage-role"],
					title: "Manage Roles",
					breadcrumb: [
						{ label: "Home", to: "/app/dashboard" },
						{ label: "Manage Roles", to: "/app/managerole" }
					]
				}
			},
			{
				path: "profile",
				name: "profile",
				component: () => import("@/views/Dashboard/ManageProfile/Profile.vue"),
				meta: {
					permissions: ["manage-profile"],
					title: "Manage Profile",
					breadcrumb: [
						{ label: "Home", to: "/app/dashboard" },
						{ label: "Manage Profile", to: "/app/profile" }
					]
				}
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

router.afterEach((to) => {
	const defaultTitle = "My App"; // Change this to your app's default title
	document.title = to.meta.title || defaultTitle;
});

function hasAnyPermission(requiredPermissions = [], userPermissions = []) {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

router.beforeEach(async (to, from, next) => {
	const auth = useAuthStore();
	const token = localStorage.getItem("token");

	if (token && !auth.user) {
		try {
			await auth.fetchProfile();
		} catch (e) {
			auth.logout();
			return next("/login");
		}
	}

	if (to.meta.requiresAuth && !auth.isAuthenticated) {
		return next("/login");
	}

	if (to.path === "/login" && auth.isAuthenticated) {
		return next("/app/dashboard");
	}

	if (
		to.meta.permissions &&
		to.meta.permissions.length > 0 &&
		!hasAnyPermission(to.meta.permissions, auth.permissions)
	) {
		return next("/unauthorized");
	}

	next();
});

export { router };
export default router;
