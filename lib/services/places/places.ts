// @ts-nocheck

import axios from "axios";

import config from "../../config";

interface IGeoLocation {
  lat: number | null;
  lng: number | null;
  address: string;
  error?: string;
}

const constants = {
  DEFAULT_PROVINCE: "QC",
  DEFAULT_COUNTRY: "CA"
};

const extractPostalCode = (text: string = ""): string => {
  const regex = /[A-Z]\d[A-Z] ?\d[A-Z]\d/gi;
  const matches = text.match(regex);
  return matches && matches.length > 0 ? matches[0].replace(" ", "") : "";
};

const places = {
  geocodeAddress: async (
    address: string = "",
    countryCode: string = "",
    provinceCode: string = ""
  ): Promise<IGeoLocation> => {
    try {
      const postalCode = extractPostalCode(address);

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: config.services.googleMap,
            components: [
              `administrative_area:${encodeURIComponent(provinceCode || constants.DEFAULT_PROVINCE)}`,
              `country:${constants.DEFAULT_COUNTRY}`
            ].join("|")
          }
        }
      );

      const { lat, lng } = response.data.results[0].geometry.location;
      return { address, lat, lng };
    } catch (error) {
      return {
        address,
        lat: null,
        lng: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  geocodeAddresses: async (
    addresses: string[] = [],
    countryCode: string = "",
    provinceCode: string = ""
  ): Promise<IGeoLocation[]> => {
    return await Promise.all(
      addresses.map(address =>
        this.geocodeAddress(address, countryCode, provinceCode)
      )
    );
  }
};

export default places;
