import * as cloudinary from "cloudinary";
import { db } from "../models/db.js";
import { TrackSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const playlistController = {
  index: {
    handler: async function (request, h) {
      // We are retrieving/extracting the playlist
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      // We are showing/passing the playlist in the view
      const viewData = {
        title: "Playlist",
        playlist: playlist,
      };
      return h.view("playlist-view", viewData); // plalist-view.hbs is returned
    },
  },

  addTrack: {
    validate: {
      payload: TrackSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("playlist-view", { title: "Add track error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      // We are retrieving/extracting the playlist
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      const newTrack = {
        /** The inputted data from the form will get here (payload),
         * and we stick them to a track object (title, artist, duration), and
         * finally we add the track to the database (trackStore) via the playlist
         * with its specific 'id' */
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration),
      };
      await db.trackStore.addTrack(playlist._id, newTrack);
      return h.redirect(`/playlist/${playlist._id}`);
    },
  },

  deleteTrack: {
    handler: async function (request, h) {
      // We are retrieving/extracting the playlist
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      // await db.trackStore.getTracksByPlaylistId(playlist, track._id);
      await db.trackStore.deleteTrack(request.params.trackid);
      return h.redirect(`/playlist/${playlist._id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.getPlaylistById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          playlist.img = url;
          await db.playlistStore.updatePlaylist(playlist);
        }
        return h.redirect(`/playlist/${playlist._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/playlist/${playlist._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.getPlaylistById(request.params.id);
        console.log("Playlist before delete:", playlist); // Check the playlist object
        if (playlist.img) {
          console.log("Image URL to delete:", playlist.img);
          const b = await imageStore.getAllImages();
          console.log(b);
          const a = await imageStore.deleteImage(playlist.img);
          console.log(a);
          playlist.img = null;
          await db.playlistStore.updatePlaylist(playlist);
          console.log("Image deleted and playlist updated");
        } else {
          console.log("No image found to delete");
        }
        return h.redirect(`/playlist/${playlist._id}`);
      } catch (err) {
        console.log("Error during image deletion:", err);
        return h.redirect(`/playlist/${request.params.id}`); // Redirect even in case of error
      }
    },
  },
};

// deleteImage: {
//   handler: async function (request, h) {
//     try {
//       const playlist = await db.playlistStore.getPlaylistById(request.params.id);
//       console.log("Playlist before delete:", playlist); // Check the playlist object
//       if (playlist.img) {
//         console.log("Image URL to delete:", playlist.img);
//         const b = await imageStore.getAllImages();
//         console.log(b);
//         const a = await imageStore.deleteImage(playlist.img);
//         console.log(a);
//         playlist.img = null;
//         await db.playlistStore.updatePlaylist(playlist);
//         console.log("Image deleted and playlist updated");
//       } else {
//         console.log("No image found to delete");
//       }
//       return h.redirect(`/playlist/${playlist._id}`);
//     } catch (err) {
//       console.log("Error during image deletion:", err);
//       return h.redirect(`/playlist/${request.params.id}`); // Redirect even in case of error
//     }
// //   },
// },
