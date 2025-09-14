import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "",
    name: "mainRoute",
    children: [{ path: "", redirect: "/home" }],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "Home",
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
