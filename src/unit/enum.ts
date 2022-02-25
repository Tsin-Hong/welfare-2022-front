const enums = {
  AUTHORIZE: 'AUTHORIZE',
  MESSAGE: 'MESSAGE',
  FAILED: 'FAILED',
  ALERT: 'ALERT',
  ROLE_EMPEROR: 1,
  ROLE_GENERMAN: 2,
  ROLE_FREEMAN: 3,
  TYPE_CITY: 1,
  TYPE_WILD: 2,
  ACT_GET_GLOBAL_USERS_INFO: 11,
  ACT_GET_GLOBAL_DATA: 12,
  ACT_GET_GLOBAL_CHANGE_DATA: 13,
  ACT_MOVE: 14,
  ACT_LEAVE_COUNTRY: 15,
  ACT_ENTER_COUNTRY: 16,
  ACT_SEARCH_WILD: 17,
  ACT_INCREASE_SOLDIER: 18,
  UserGlobalAttributes: ['id', 'code', 'nickname', 'countryId', 'loyalty', 'loyalUserId', 'contribution', 'occupationId', 'role', 'mapNowId', 'soldier', 'captiveDate'],
  MapsGlobalAttributes: ['id', 'name', 'x', 'y', 'route', 'cityId', 'ownCountryId'],
  CityGlobalAttributes: ['id', 'money', 'addResource', 'timeBeAttacked', 'jsonConstruction'],
  CountryGlobalAttributes: ['id', 'name', 'money', 'emperorId', 'peopleMax', 'color', 'originCityId']
}

export default enums
