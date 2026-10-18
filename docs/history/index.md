# Undo

A bounded two-stack history, kept **pure** so the part with the off-by-one in it
can be tested without a browser.

## Snapshots, not diffs

An ensemble is a small JSON document and an edit is coarse — one drag release,
one typed field, one insert. Cloning the whole thing costs less than the rebuild
that follows it, and unlike a diff it cannot get out of step with a mutation it
did not model. Undo was a v1 non-goal on the strength of "everything goes
through one mutation path, so adding it later is cheap"; this is that promise
being cashed.

## A new edit forks the timeline

Undo three times, then edit: the three redos are gone. That is what every editor
does, and the alternative — keeping them and letting a later redo overwrite work
done since — is a data-loss bug wearing a feature's clothes.
