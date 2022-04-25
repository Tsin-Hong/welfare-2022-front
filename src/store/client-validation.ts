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

function isUserRoleNotEmperor(userId, global) {
  const user = hash.getUser(userId, global.users);
  return user && user.role != enums.ROLE_EMPEROR ? '' : '不能是主公.';
}

function isRoleNotFree(user) {
  return user.role !== enums.ROLE_FREEMAN ? '' : '你是浪人.';
}

function isRoleFreeMan(userId, global) {
  const user = hash.getUser(userId, global.users);
  return user && user.role == enums.ROLE_FREEMAN ? '' : '不是浪人.';
}

function isRoleFree(user) {
  return user.role == enums.ROLE_FREEMAN ? '' : '不是浪人.';
}

function isRoleWarrier(user) {
  return user.role == enums.ROLE_GENERMAN ? '' : '不是武將.';
}

function isNotLoyal(user) {
  return user.loyalUserId == 0 ? '' : '你是元老.';
}

function isAllowedShareUser(user, global) {
  if (user.role == enums.ROLE_EMPEROR) return '';
  const _myOccupation = global.occupationMap[user.occupationId];
  return _myOccupation && _myOccupation.isAllowedShare ? '' : '沒有配給權力';
}

function isNotBeCaptived(user) {
  return !user.captiveDate ? '' : `被俘虜中. [${new Date(user.captiveDate).toLocaleDateString()}]`
}

function isBeCaptived(user) {
  return user.captiveDate ? '' : `不是俘虜.`
}

function isCaptived(userId, global) {
  const user = hash.getUser(userId, global.users);
  return user && user.captiveDate ? '' : '不是俘虜.';
}

function isExistMap(mapId, global) {
  return hash.getMap(mapId, global.maps) ? '' : '地圖選取錯誤'
}

function isEnemyMap(user, mapId, global) {
  const _map = hash.getMap(mapId, global.maps)
  return user.countryId > 0 && user.countryId != _map.ownCountryId ? '' : '指定地圖非敵陣營'
}

function isInCity(user, global) {
  const _map = hash.getMap(user.mapNowId, global.maps);
  const _city = hash.getCity(_map.cityId, global.cities);
  return _map && _city ? '' : '所在不是城池';
}

function isExistCity(cityId, global) {
  return hash.getCity(cityId, global.cities) ? '' : '城池不存在';
}

function isExistConstuction(conName) {
  return enums.CHINESE_CONSTRUCTION_NAMES[conName] ? '' : '不存在的建築';
}

function isInWild(user, global) {
  const _map = hash.getMap(user.mapNowId, global.maps);
  return _map && _map.cityId == 0 ? '' : '所在不是野區';
}

function isInCountryHere(user, global) {
  const _map = global.maps.find((item) => item.id == user.mapNowId);
  return _map && user.countryId == _map.ownCountryId ? '' : '不是此國家的人';
}

function isInMyCountry(userId, userinfo, global) {
  const user = hash.getUser(userId, global.users);
  const location = hash.getMap(user.mapNowId, global.maps);
  return location && location.ownCountryId == userinfo.countryId ? '' : '不在國家內';
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

function hasRecordBattle(battleId, global) {
  return global.warRecords.find((w: any) => w.id == battleId) ? '' : '戰役不存在.';
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

function haveMoney(user, money = 0) {
  return 0 <= money && money <= user.money ? '' : '黃金不足.';
}

function haveBasicBattleResource(user) {
  return user.money >= enums.NUM_BATTLE_MONEY_MIN && user.soldier >= enums.NUM_BATTLE_SOLDIER_MIN ? '' : '資源不足以出征'
}

function isOccupationEnoughContribution(userId, occupationId, global) {
  const _occu = global.occupationMap[occupationId];
  const _user = global.users.find(user => user.id == userId);
  return _occu && _user && _user.contribution >= _occu.contributionCondi ? '' : '貢獻值不足.';
}

function isSameCountryPartner(user, partnerId, global) {
  const _partent = hash.getUser(partnerId, global.users)
  return _partent && user.countryId == _partent.countryId ? '' : '不同的國家.';
}

function isExistOriginCity(user, global) {
  const country = hash.getCountry(user.countryId, global.countries);
  return country && isExistCity(country.originCityId, global) == '' ? '' : '不存在主城.';
}

function isNoOriginCity(user, global) {
  const country = hash.getCountry(user.countryId, global.countries);
  return country && isExistCity(country.originCityId, global) != '' ? '' : '已有主城.';
}

function isOriginCity(mapId, global) {
  const map = hash.getMap(mapId, global.maps);
  const country = hash.getCountry(map.ownCountryId, global.countries);
  return isExistCity(map.cityId, global) == '' && country.originCityId == map.cityId ? '' : '此地點不是主城.';
}

function isExistGame(gameId, global) {
  return global.gameMap[gameId] ? '' : '不存在的遊戲項目.';
}

function availableSetGameInBattle(gameId, mapId, global) {
  const game = global.gameMap[gameId];
  const battle = global.battlefieldMap[mapId];
  const now = new Date();
  now.setDate(now.getDate()+3);
  if (now < new Date(battle.timestamp)) {
      return '戰役還未進入備戰期間';
  }
  const vsAry = [battle.atkUserIds.filter((u: number)=> u > 0).length, battle.defUserIds.filter((u: number) => u > 0).length];
  vsAry.sort((a,b) => a-b);
  const vs = `b${vsAry.join('v')}`;
  return battle.gameId == 0 && game[vs] ? '' : '不予許設置.';
}

function isAllowedRecurit(user, global) {
  if (user.role == enums.ROLE_EMPEROR) return '';
  const _myOccupation = global.occupationMap[user.occupationId];
  return _myOccupation && _myOccupation.isAllowedRecurit ? '' : '不能招募.';
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
        return havePoint(user, 1) || isInCity(user, global) || isNotBeCaptived(user)
      }
      case enums.ACT_MOVE: {
        return isNoTarget(user) || havePoint(user, 1) || isNotBeCaptived(user)
      }
      case enums.ACT_SEARCH_WILD: {
        return havePoint(user, 1) || isInWild(user, global) || isNotBeCaptived(user)
      }
      case enums.ACT_LEAVE_COUNTRY: {
        return havePoint(user, 1) || isRoleWarrier(user) || isNotLoyal(user)
      }
      case enums.ACT_ENTER_COUNTRY: {
        return havePoint(user, 1) || isRoleFree(user) || isExistMap(user.mapNowId, global) || isInCity(user, global)
      }
      case enums.ACT_BATTLE: {
        const mapId = payload.mapId;
        return isNoTarget(user) || isExistMap(mapId, global) || isEnemyMap(user, mapId, global) || hasNoBattlefield(mapId, global)
            || havePoint(user) || haveBasicBattleResource(user) || isNotBeCaptived(user)
      }
      case enums.ACT_BATTLE_JOIN: {
        const mapId = payload.mapId;
        const battleId = payload.battleId;
        const position = payload.position;
        return (position <= 3 ? isNoTarget(user) || haveMoney(user, 100) || havePoint(user, mapId == user.mapNowId ? 0 : 1) : haveNoWorking(user, global) || havePoint(user, 1)) || hasBattle(mapId, battleId, global)
            || isEmptyBattlePosition(user, position, mapId, global) || isNotInvolvedBattle(user, position, mapId, global) || isNotBeCaptived(user)
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
        return isNotBeCaptived(user) || isRoleEmperor(user) || havePoint(user, 3) || isOccupationEnoughContribution(userId, occupationId, global);
      }
      case enums.ACT_DISMISS: {
        return isNotBeCaptived(user) || isRoleEmperor(user) || havePoint(user, 1);
      }
      case enums.ACT_LEVELUP_CITY: {
        const cityId = payload.cityId;
        const constructionName = payload.constructionName;
        return isNotBeCaptived(user) || havePoint(user, 1) || isInCity(user, global) || isInCountryHere(user, global) || isExistCity(cityId, global) || isExistConstuction(constructionName)
      }
      case enums.ACT_SHARE: {
        const userId = payload.userId;
        // const soldier = payload.soldier;
        // const money = payload.money;
        // const packetId = payload.packetId;
        return isNotBeCaptived(user) || havePoint(user, 1) || isAllowedShareUser(user, global) || isSameCountryPartner(user, userId, global)
      }
      case enums.ACT_ESCAPE: {
        const money = payload.money;
        return havePoint(user, 1) || isBeCaptived(user) || haveMoney(user, money) || isExistOriginCity(user, global)
      }
      case enums.ACT_BATTLE_SELECT_GAME: {
        const battleId = payload.battleId;
        const mapId = payload.mapId;
        const gameId = payload.gameId;
        return isExistMap(mapId, global) || hasBattle(mapId, battleId, global) || isOriginCity(mapId, global) || isInCountryHere(user, global) || isExistGame(gameId, global) || availableSetGameInBattle(gameId, mapId, global);
      }
      case enums.ACT_GET_BATTLE_DETAIL: {
        const battleId = payload.battleId;
        return hasRecordBattle(battleId, global);
      }
      case enums.ACT_RECRUIT: {
        const userId = payload.userId;
        return isAllowedRecurit(user, global) || isRoleFreeMan(userId, global) || havePoint(user, 3) || isExistOriginCity(user, global);
      }
      case enums.ACT_RECRUIT_CAPTIVE: {
        const userId = payload.userId;
        return isRoleEmperor(user) || havePoint(user, 3) || isExistOriginCity(user, global) || isCaptived(userId, global) || isInMyCountry(userId, user, global) || isUserRoleNotEmperor(userId, global);
      }
      case enums.ACT_RELEASE_CAPTIVE: {
        const userId = payload.userId;
        return isRoleEmperor(user) || havePoint(user, 1) || isCaptived(userId, global) || isInMyCountry(userId, user, global);
      }
      case enums.ACT_SET_ORIGIN_CITY: {
        const cityId = payload.cityId;
        return isRoleEmperor(user) || havePoint(user, 1) || isNoOriginCity(user, global) || isExistCity(cityId, global);
      }
    }
    return ''
  }
}