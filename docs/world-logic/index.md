# World behaviour rules

Doors, locks, lamps and spinners are mostly **state over time**, and state over
time is where behaviour goes subtly wrong: a door that opens the long way round,
a flicker that stalls when a frame is late, a lock that opens for the wrong key
because someone compared a missing key to a missing key.

So the rules live here as pure functions and the bindings stay thin. None of
this needs a scene, so all of it is tested without one.

## Everything is driven by ELAPSED TIME, not by frames

A behaviour that advances "a bit each frame" runs at a different speed on a
144 Hz monitor than on a 30 fps laptop, and stops entirely when the scene
pauses. Each function here takes elapsed seconds and returns the state that
elapsed time implies, so a dropped frame is a bigger step rather than a
different outcome.
