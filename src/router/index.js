import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/view/login.vue';
import Text2 from '../components/view/Text2.vue';
import Text3 from '../components/view/Text3.vue';
import ReportWork from '../components/view/ReportWork.vue';
const routes = [
 
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/text2',
    name: 'Text2',
    component: Text2,
  },
  {
    path: '/text3',
    name: 'Text3',
    component: Text3,
  },
  {
    path: '/ReportWork',
    name: 'ReportWork',
    component: ReportWork,
  },
  {
    path: '/',
    redirect: '/ReportWork',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

