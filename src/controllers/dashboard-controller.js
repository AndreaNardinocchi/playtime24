/* Model–view–controller (MVC) is a software design pattern commonly used for developing 
user interfaces that divide the related program logic into three interconnected elements. */

import { db } from "../models/db.js";
import { PlaylistSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      /**
       * When adding a playlist we include the users ID,
       * we recover the user from the session, and use
       * the user ID as the userid property of the new playlist
       * const loggedInUser = request.auth.credentials;
       * */
      const loggedInUser = request.auth.credentials;
      const playlists = await db.playlistStore.getUserPlaylists(loggedInUser._id);
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        playlists: playlists,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlaylist: {
    validate: {
      payload: PlaylistSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Playlist error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlayList = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.playlistStore.addPlaylist(newPlayList);
      return h.redirect("/dashboard");
    },
  },

  deletePlaylist: {
    handler: async function (request, h) {
      // We are retrieving/extracting the playlist
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      await db.playlistStore.deletePlaylistById(playlist._id);
      return h.redirect("/dashboard");
    },
  },
};
