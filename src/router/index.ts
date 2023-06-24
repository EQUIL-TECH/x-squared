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
          path: "/reconcile",
          component: () => import("@/views/TransactionView.vue"),
        },
        {
          name: "Landing",
          path: "/",
          component: () => import("@/views/landing.vue"),
        },
      ],
    },
  ],
});

export default router;
