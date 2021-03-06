const mapdata = {
  ary: [] as any,
  hash: {} as any
}

function setData (data: Array<any>) {
  if (Array.isArray(data)) {
    const nextHash = {}
    mapdata.ary = data.map(d => {
      if (typeof d.route === 'string') { d.route = d.route.split(',').map((_:any) => parseInt(_)) }
      nextHash[d.id] = d
      return d
    })
    mapdata.hash = nextHash
  } else {
    mapdata.hash = data
    mapdata.ary = Object.values(data)
    mapdata.ary.sort((a: any, b: any) => a.id - b.id)
  }
  return true
}

function getAllowedPosition (nowId: any, moveEnergy = 1, countryId = 0) {
  const _hash = mapdata.hash
  const _now = _hash[nowId]
  const stpeRoutes = {}
  const allRoutes: Array<number> = []
  const checkCountry = countryId > 0
  let _step = 0
  if (_now) {
    while (_step++ < moveEnergy) {
      const lastRoutes = stpeRoutes[_step - 1]
      let nextRoutes = []
      if (lastRoutes) {
        lastRoutes.map((rs: any) => {
          const _loc = _hash[rs]
          let _routes = _loc.route
          if (checkCountry) {
            _routes = _routes.filter(r => _hash[r].ownCountryId === countryId);
          }
          _routes.map((_next: any) => {
            if (!allRoutes.includes(_next) && _next !== nowId) {
              nextRoutes.push(_next)
              allRoutes.push(_next)
            }
          })
        })
      } else {
        nextRoutes = _now.route.slice()
        if (checkCountry) {
          nextRoutes = nextRoutes.filter(r => _hash[r].ownCountryId === countryId);
        }
        nextRoutes.map((r: any) => {
          allRoutes.push(r)
        })
      }
      stpeRoutes[_step] = nextRoutes
    }
  }
  return { all: allRoutes, steps: stpeRoutes }
}

export default {
  setData,
  getAllowedPosition
}
