import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/full/FullLayout.vue"),
      children: [
        {
          name: "Home",
          path: "/",
          component: () => import("@/views/TransactionView.vue"),
        },
      ],
    },
    {
      path: "/",
      redirect: "landing",
      component: () => import("@/layouts/blank/BlankLayout.vue"),
      children: [
        {
          name: "Donations",
          path: "donations",
          component: () => import("@/views/donations.vue"),
        },
      ],
    },
  ],
});

export default router;
