import { Document, Model, model, ObjectId, Schema } from 'mongoose';



const timezoneSchema = new Schema({
    abbreviation: {
        type: String,
      },
    gmtOffset: {
        type: Number,
      },
    gmtOffsetName:  {
        type: String,
    },
    tzName: {
        type: String,
    },
    zoneName: {
        type: String,
    },
  });


  const citiesSchema = new Schema({
    id: {
      type: Number,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    name: {
      type: String,
    }
  });


  const stateSchema = new Schema({
    id: {
      type: Number,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    name: {
      type: String,
    },
    cities: [citiesSchema],
    state_code: {
      type: String,
    },
    type: {
      type: String,
      default: null
    }
  });


  const countrySchema = new Schema({
    id: {
      type: Number,
    },
    iso2: {
      type: String,
    },
    iso3: {
      type: String,
    },
    name: {
      type: String,
    },
    phone_code: {
      type: String,
    },
    states: [stateSchema],
    timezones: [timezoneSchema]
  });

  const CountryStateCity = model('country_state_city', countrySchema);
  export default CountryStateCity;

 

