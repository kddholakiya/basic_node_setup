import { Document, Model, model, ObjectId, Schema } from 'mongoose';


export interface ItimeZone extends Document {
    abbreviation: string;
    gmtOffset: number;
    gmtOffsetName: string;
    tzName: string;
    zoneName: string;
}

export interface ICity extends Document {
    id: number;
    latitude: string;
    longitude: string;
    name: string;
}

export interface IState extends Document {
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    cities: ICity[];
    state_code: string;
    type?: string | null;
}

export interface ICountry extends Document {
    _id : String;
    id: number; 
    iso2: string;
    iso3: string;
    name: string;
    phone_code: string;
    states: IState[];
    timezones: ItimeZone[];
}



const timezoneSchema: Schema = new Schema({
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


  const citiesSchema: Schema = new Schema({
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


  const stateSchema: Schema = new Schema({
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


  const countrySchema: Schema = new Schema({
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

  const CountryStateCity: Model<ICountry> = model<ICountry>('country_state_city', countrySchema);
  export default CountryStateCity;

 

