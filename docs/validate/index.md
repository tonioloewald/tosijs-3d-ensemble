# Validation

`validate(ensemble, { meshes })` returns problems and **never throws**. The two
consumers want different things from the same call: an editor shows everything
and keeps working, while a generator must decide whether to emit.

A bare `string[]` forces the generator to either reject on cosmetic warnings or
parse prose to tell them apart — and it will parse prose. So a problem is
structured:

```typescript
import { validate } from 'tosijs-3d-ensemble'

const problems = validate(ensemble, { meshes: new Set(library.getNames()) })
const fatal = problems.filter((p) => p.severity === 'error')
```

`path` is a JSON Pointer into the ensemble, which is what lets the editor put a
message **on the field** rather than in a list at the bottom of the screen.

## Two checks worth more than the rest

- **An unreachable shield.** A piece with a `protector` feature and no incoming
  link is an unsolvable objective — and it looks entirely normal until a player
  spends five minutes failing to kill something. The check is keyed on the
  FEATURE rather than the `shield` role, so a consumer's own role gets it too.
- **Unknown meshes, only when the library is loaded.** A validation error that
  is really a loading race is worse than none, because it accuses good content.
  Pass `meshes` when you have it and omit it when you don't.
