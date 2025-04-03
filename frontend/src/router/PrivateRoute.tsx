import About from "../pages/About";
import Application from "../pages/Application";
import Provider from "../pages/Provider";
import Token from "../pages/Token";
import Message from "../pages/Message";
import User from "../pages/User";
import Role from "../pages/Role";
import Group from "../pages/Group";
import Permission from "../pages/Permission";
import Dashboard from "../pages/Dashboard";
import Log from "../pages/Log";
import Notification from "../pages/Dashboard";
import ProtectedRoute from "../pages/Route";
import Forward from "../pages/Forward";
import ConfigViewPage from "../pages/ConfigView";
import GuestUser from "../pages/GuestUser";
import TemplateView from "../pages/TemplateView";

const PrivateRoute = {
  home: {
    path: "/",
    component: Dashboard,
  },
  about: {
    path: "/about",
    component: About,
  },
  route: {
    path: "/route",
    component: ProtectedRoute,
  },
  forward: {
    path: "/forward",
    component: Forward,
  },
  application: {
    path: "/application",
    component: Application,
  },
  provider: {
    path: "/provider",
    component: Provider,
  },
  token: {
    path: "/token",
    component: Token,
  },
  message: {
    path: "/message",
    component: Message,
  },
  log: {
    path: "/log",
    component: Log,
  },
  notification: {
    path: "/notification",
    component: Notification,
  },
  user: {
    path: "/user",
    component: User,
  },
  myUser: {
    path: "/my-user",
    component: GuestUser,
  },
  role: {
    path: "/role",
    component: Role,
  },
  group: {
    path: "/group",
    component: Group,
  },
  permission: {
    path: "/permission",
    component: Permission,
  },
  config: {
    path: "/database-config",
    component: ConfigViewPage,
  },
  template: {
    path: "/template",
    component: TemplateView,
  },
};

export default PrivateRoute;
