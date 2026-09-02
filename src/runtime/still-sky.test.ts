import { describe, expect, it } from "bun:test";
import { featureRegistration } from "../format/registry";
import { registerSceneFeatures, stillSky } from "./features-scene";

/*
  A SKY THAT DRIFTS IS A LIGHT METER THAT WILL NOT HOLD STILL.

  `b3d-skybox` defaults `realtimeScale` to 10 and advances `timeOfDay` on a
  100 ms interval — 0.001 h per tick, which is a full day/night cycle every
  FORTY MINUTES. So an ensemble that says `timeOfDay: 11` rendered dusk if you
  had it open long enough, reported as "is it night time?" after a session.
  Measured drift with nothing touching it: 10.06 → 10.23 → 10.29.

  An ensemble describes an arrangement, so the same file must produce the same
  light every time it loads. Motion is opt-in.
*/

registerSceneFeatures();

describe("the sky holds still", () => {
  it("defaults realtimeScale to 0, against the upstream default of 10", () => {
    expect(stillSky({ timeOfDay: 11 }).realtimeScale).toBe(0);
  });

  it("still lets an ensemble ask for a moving sky", () => {
    expect(stillSky({ timeOfDay: 11, realtimeScale: 60 }).realtimeScale).toBe(
      60
    );
  });

  it("leaves every other key alone", () => {
    expect(stillSky({ timeOfDay: 11, turbidity: 6 })).toEqual({
      realtimeScale: 0,
      timeOfDay: 11,
      turbidity: 6,
    });
  });

  it("declares realtimeScale so an author can reach it", () => {
    const props = (
      featureRegistration("skybox")!.schema as {
        properties?: Record<string, unknown>;
      }
    ).properties;
    expect(props).toHaveProperty("realtimeScale");
  });
});
