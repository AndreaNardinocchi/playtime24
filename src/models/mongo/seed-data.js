export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret",
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret",
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret",
    },
  },
  playlists: {
    _model: "Playlist",
    mozart: {
      title: "Mozart Favourites",
      userid: "->users.bart",
    },
    beethoven: {
      title: "Beethoven Favourites",
      userid: "->users.homer",
    },
  },
  tracks: {
    _model: "Track",
    track_1: {
      title: "Violin Concerto No. 1",
      artist: "Mozart",
      duration: 15,
      playlistid: "->playlists.mozart",
    },
    track_2: {
      title: "Violin Concerto No. 1",
      artist: "Beethoven",
      duration: 15,
      playlistid: "->playlists.beethoven",
    },
  },
};
