// Create routing for all pages
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import SignupPage from "./pages/SignupPage.vue";

const NotFoundPage = () => import("./pages/PageNotFound.vue");

const routes = [
  {
    path: "/",
    component: HomePage,
    meta: { title: "Home", auth: true},
  },
  {
    path: "/signup",
    component: SignupPage,
    meta: { title: "SignUp" },
  },
  {
    path: "/:catchAll(.*)",
    component: NotFoundPage,
  },
];

const history = createWebHistory();

// create router instance
const router = createRouter({
  history,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    if (savedPosition) {
      return { top: 0 };
      // return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});


router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
 if (nearestWithTitle) {
   document.title = nearestWithTitle.meta.title + " - Messaging Assignment";
 }
 const token = sessionStorage.getItem('gett') ? decodeURIComponent(window.atob(sessionStorage.getItem('gett') as string)) : undefined
 if (to.meta.auth && !token) {
  return next("/signup");
}
  next();
});



export default router;