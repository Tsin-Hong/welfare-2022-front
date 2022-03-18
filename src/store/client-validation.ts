import enums from "@/unit/enum"

const hash = {
  map: {},
  user: {},
  city: {},
  country: {},
  getMap: function (id, maps) { return maps[String(this.map[id])] },
  getUser: function (id, users) { return users[String(this.user[id])] },
  getCity: function (id, c) { return c[String(this.city[id])] },
  getCountry: function (id, c) { return c[String(this.country[id])] }
}



function isNoTarget(user) {
  return user.mapTargetId == 0 ? '' : '已經有其他目標'
}

function isRoleEmperor(user) {
  return user.role == enums.ROLE_EMPEROR ? '' : '不是主公.';
}

function isRoleNotFree(user) {
  return user.role !== enums.ROLE_FREEMAN ? '' : '你是浪人.';
}

function isExistMap(mapId, global) {
  return hash.getMap(mapId, global.maps) ? '' : '地圖選取錯誤'
}

function isEnemyMap(user, mapId, global) {
  const _map = hash.getMap(mapId, global.maps)
  return user.countryId > 0 && _map.ownCountryId > 0 && user.countryId != _map.ownCountryId ? '' : '指定地圖非敵陣營'
}

function isInCity(user, global) {
  const _map = hash.getMap(user.mapNowId, global.maps);
  const _city = hash.getCity(_map.cityId, global.cities);
  return _map && _city ? '' : '所在不是城市';
}

function isInCountryHere(user, global) {
  const _map = global.mapIdMap[user.mapNowId];
  return _map && user.countryId == _map.ownCountryId ? '' : '不是此國家的人';
}

function haveNoWorking(user, global) {
  const _uid = user.id;
  const _bm = global.battlefieldMap;
  return _uid > 0 && Object.keys(_bm).map(k => _bm[k].judgeId == _uid || _bm[k].toolmanId == _uid).filter(e => e).length == 0 ? '' : '已經擔任裁判或工作人員.';
}

function hasNoBattlefield(mapId, globa) {
  return !globa.battlefieldMap[mapId] ? '' : '該地點已經有戰役.';
}

function hasBattle(mapId, battleId, globa) {
  const _battle = globa.battlefieldMap[mapId];
  return _battle && _battle.id == battleId ? '' : '戰役不存在.';
}

function isEmptyBattlePosition(user, position, mapId, global) {
  const _battle = global.battlefieldMap[mapId];
  const _countryId = user.countryId;
  let _pb = false;
  // console.log('_battle: ', _battle);
  switch (position) {
    case 4: _pb =  _battle.judgeId == 0; break
    case 5: _pb =  _battle.toolmanId == 0; break
    default:
        _pb = (_battle.defenceCountryId == _countryId && _battle.defUserIds[position] == 0) || (_battle.attackCountryIds.includes(_countryId) && _battle.atkUserIds[position] == 0);
  }
  return _pb ? '' : '此戰役位置已經有人.';
}

function isNotInvolvedBattle(user, position, mapId, global) {
  const _battle = global.battlefieldMap[mapId];
  if ([4,5].includes(position)) {
    const _countryId = user.countryId;
    return _countryId != _battle.defenceCountryId && !_battle.attackCountryIds.includes(_countryId) ? '' : '國家正在打仗.'
  } else {
    const _userId = user.id;
    return !_battle.defUserIds.includes(_userId) && !_battle.atkUserIds.includes(_userId) ? '' : '已經加入戰役.'
  }
}

function isJudge(user, mapId, globa) {
  return globa.battlefieldMap[mapId].judgeId == user.id ? '' : '不是裁判'
}

function havePoint(user, point = 1) {
  return user.actPoint >= point ? '' : '行動點數不足'
}

function haveBasicBattleResource(user) {
  return user.money >= enums.NUM_BATTLE_MONEY_MIN && user.soldier >= enums.NUM_BATTLE_SOLDIER_MIN ? '' : '資源不足以出征'
}

function isOccupationEnoughContribution(userId, occupationId, global) {
  const _occu = global.occupationMap[occupationId];
  const _user = global.userMap[userId];
  return _occu && _user && _user.contribution >= _occu.contributionCondi ? '' : '貢獻值不足.';
}



export default {
  cacheGlobal(global) {
    global.maps.map((map, idx) => { hash.map[map.id] = idx })
    global.users.map((user, idx) => { hash.user[user.id] = idx })
    global.cities.map((city, idx) => { hash.city[city.id] = idx })
    global.countries.map((country, idx) => { hash.country[country.id] = idx })
  },
  validate(user, args, global) {
    const act = args.act
    const payload = args.payload || {}
    switch (act) {
      case enums.ACT_INCREASE_SOLDIER: {
        return havePoint(user, 1) || isInCity(user, global)
      }
      case enums.ACT_MOVE: {
        return isNoTarget(user)
      }
      case enums.ACT_BATTLE: {
        const mapId = payload.mapId;
        return isNoTarget(user) || isExistMap(mapId, global) || isEnemyMap(user, mapId, global) || hasNoBattlefield(mapId, global) || haveNoWorking(user, global)
            || havePoint(user) || haveBasicBattleResource(user)
      }
      case enums.ACT_BATTLE_JOIN: {
        const mapId = payload.mapId;
        const battleId = payload.battleId;
        const position = payload.position;
        return isNoTarget(user) || haveNoWorking(user, global) || hasBattle(mapId, battleId, global) || isEmptyBattlePosition(user, position, mapId, global) || isNotInvolvedBattle(user, position, mapId, global);
      }
      case enums.ACT_BATTLE_JUDGE: {
        const mapId = payload.mapId;
        const battleId = payload.battleId;
        return hasBattle(mapId, battleId, global) || isJudge(user, mapId, global);
      }
      case enums.ACT_BUSINESS: {
        return havePoint(user) || isRoleNotFree(user) || isInCity(user, global) || isInCountryHere(user, global);
      }
      case enums.ACT_APPOINTMENT: {
        const userId = payload.userId;
        const occupationId = payload.occupationId;
        return isRoleEmperor(user) || havePoint(user, 3) || isOccupationEnoughContribution(userId, occupationId, global);
      }
      case enums.ACT_DISMISS: {
        return isRoleEmperor(user) || havePoint(user, 1);
      }
    }
    return ''
  }
}