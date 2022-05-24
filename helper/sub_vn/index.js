"use strict";

const provinces = require('./provinces.json')
const districts = require('./districts.json')
const wards = require('./wards.json')

/**
 * @returns {[Object]}  { code:"", name:""}
 */
const getProvinces = () => provinces;
/**
 * @param {string} province_code 
 * @returns {[Object]} { code:"", name:""}
 */
const getDistrictsByProvince = (province_code) => districts[province_code];

/**
 * @param {string} province_code 
 * @param {string} district_code 
 * @returns {[Object]}  { code:"", name:""}
 */
const getWardsByProvinceCodeAndDistrictCode = (province_code, district_code) => wards[province_code][district_code];


module.exports = {
    getProvinces,
    getDistrictsByProvince,
    getWardsByProvinceCodeAndDistrictCode
}
