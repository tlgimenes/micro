const newVersion = () => crypto.randomUUID().split("-")[0]

const createCache = () => {
  let versionHash = newVersion()

  const reset = () => {
    versionHash = newVersion()
  }

  const version = () => versionHash

  return {
    version,
    reset
  }
}

export const cache = createCache()
