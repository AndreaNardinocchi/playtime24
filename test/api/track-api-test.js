import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { playtimeService } from "./playtime-service.js";
import { testPlaylists, testTracks, mozart, maggie, concerto, maggieCredentials } from "../fixtures.js";
import { db } from "../../src/models/db.js";

suite("Track API tests", () => {
  let user = null;
  let beethovenSonatas = null;

  setup(async () => {
    // db.init("json");
    playtimeService.clearAuth();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllTracks();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    mozart.userid = user._id;
    beethovenSonatas = await playtimeService.createPlaylist(mozart);
  });

  teardown(async () => {});

  test("create track", async () => {
    const returnedTrack = await playtimeService.createTrack(beethovenSonatas._id, concerto);
    // assert.isNotNull(trackNew);
    assertSubset(concerto, returnedTrack);
  });

  test("create Multiple tracks", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // trackTests[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(beethovenSonatas._id, testTracks[i]);
    }
    const returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);
    for (let i = 0; i < returnedTracks.length; i += 1) {
      // await playtimeService.deleteAllTracks();
      // returnedTrack = await playtimeService.getAllTracks();
      // eslint-disable-next-line no-await-in-loop
      const track = await playtimeService.getTrack(returnedTracks[i]._id);
      assertSubset(track, returnedTracks[i]);
    }
  });

  test("Delete Track", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(beethovenSonatas._id, testTracks[i]);
    }
    let returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);
    for (let i = 0; i < returnedTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const track = await playtimeService.deleteTrack(returnedTracks[i]._id);
    }
    returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("test denormalised playlist", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(beethovenSonatas._id, testTracks[i]);
    }
    const returnedPlaylist = await playtimeService.getPlaylist(beethovenSonatas._id);
    assert.equal(returnedPlaylist.tracks.length, testTracks.length);
    for (let i = 0; i < testTracks.length; i += 1) {
      assertSubset(testTracks[i], returnedPlaylist.tracks[i]);
    }
  });
});
