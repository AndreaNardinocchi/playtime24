import { v4 } from "uuid";
import { trackMemStore } from "./track-mem-store.js";

let playlists = [];

export const playlistMemStore = {
  async getAllPlaylists() {
    return playlists;
  },

  async addPlaylist(playlist) {
    playlist._id = v4();
    playlists.push(playlist);
    return playlist;
  },

  // This was updated to ensure the list-tracks.hbs would work
  async getPlaylistById(id) {
    let list = playlists.find((playlist) => playlist._id === id);
    // Retrieving all tracks of the playlist
    // The 'if' condition will fix the bug
    if (list) {
      list.tracks = await trackMemStore.getTracksByPlaylistId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  // This method returns playlists by userid - assuming each playlist has this userid field.
  async getUserPlaylists(userid) {
    return playlists.filter((playlist) => playlist.userid === userid);
  },

  async deletePlaylistById(id) {
    const index = playlists.findIndex((playlist) => playlist._id === id);
    if (index !== -1) playlists.splice(index, 1);
  },

  async deleteAllPlaylists() {
    playlists = [];
  },
};
