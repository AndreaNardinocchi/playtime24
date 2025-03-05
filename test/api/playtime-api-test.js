import { EventEmitter } from "events";
import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { playtimeService } from "./playtime-service.js";
import { mozart, testPlaylists, maggie, maggieCredentials } from "../fixtures.js";
import { db } from "../../src/models/db.js";

EventEmitter.setMaxListeners(25);

suite("Playlist API tests", () => {
  let user = null;
  setup(async () => {
    // db.init("json");
    playtimeService.clearAuth();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    mozart.userid = user._id;
  });
  teardown(async () => {});

  test("create a playlist", async () => {
    const playlistNew = await playtimeService.createPlaylist(mozart);
    assert.isNotNull(playlistNew);
    assertSubset(mozart, playlistNew);
    // assert.isDefined(playlistNew._id);
  });

  test("delete a playlist", async () => {
    const playlist = await playtimeService.createPlaylist(mozart);
    const response = await playtimeService.deletePlaylist(playlist._id);
    assert.equal(response.status, 204);
    try {
      const returnedPlaylist = await playtimeService.getPlaylist(playlist.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id", "Incorrect Response Message");
    }
  });

  test("create multiple playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      testPlaylists[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlaylist(testPlaylists[i]);
    }
    let returnedPlaylist = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylist.length, testPlaylists.length);
    await playtimeService.deleteAllPlaylists();
    returnedPlaylist = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylist.length, 0);
  });

  test("remove non-existant playlist", async () => {
    try {
      const response = await playtimeService.deletePlaylist("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id", "Incorrect Response Message");
    }
  });
});
