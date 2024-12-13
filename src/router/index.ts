import { API_URL } from "@/global/constants";
import DashboardView from "@/views/DashboardView.vue";
import LoginView from "@/views/LoginView.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("authToken") || "";

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("authToken");
      return false;
    }
  };

  if (to.meta.requiresAuth) {
    if (token) {
      const isValid = await verifyToken();
      if (isValid) {
        next();
      } else {
        next({ path: "/" });
      }
    } else {
      next({ path: "/" });
    }
  } else {
    next();
  }
});

export default router;
