import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { playlistController } from "./controllers/playlist-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addplaylist", config: dashboardController.addPlaylist },

  { method: "GET", path: "/playlist/{id}", config: playlistController.index },
  { method: "POST", path: "/playlist/{id}/addtrack", config: playlistController.addTrack },
  { method: "GET", path: "/dashboard/deleteplaylist/{id}", config: dashboardController.deletePlaylist },

  { method: "POST", path: "/playlist/{playlistid}/deletetrack/{id}", config: playlistController.deleteTrack },
  { method: "GET", path: "/playlist/{id}/deletetrack/{trackid}", config: playlistController.deleteTrack },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
  { method: "POST", path: "/playlist/{id}/uploadimage", config: playlistController.uploadImage },
  { method: "GET", path: "/playlist/{id}/deleteimage", config: playlistController.deleteImage },
];
