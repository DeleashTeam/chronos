const { HolidayAPI } = require('holidayapi');
const { lookup } = require('geoip-lite');

const key = 'f2fd499e-66fb-48ce-a5f6-efdcdbffbe27';
const holidayApi = new HolidayAPI({ key });

/**
 * @desc Finds a country code depending on ip
 * @param {String} ip user ipv4 address
 * @returns country code or null
 */
const getCountry = ip => lookup(ip).country;

/**
 * @desc Finds holidays depending on country code
 * @param {Number | String} the year the year to get holidays for
 * @param {String} country the country to get holidays for
 * @param {String} language the language for holiday names
 * @returns an array of holidays
 */
async function getHolidays(year, country = 'US', language = 'en') {
  if (!country) country = 'US';
  const { holidays } = await holidayApi.holidays({ year, country, language });
  return holidays;
}

module.exports = { getHolidays, getCountry };
