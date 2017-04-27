import { JsonApiModel, JsonApiDatastoreConfig, Attribute } from 'angular2-jsonapi';

@JsonApiDatastoreConfig({
  type: 'countries'
})
export class Country extends JsonApiModel {

  @Attribute() name: string;
  @Attribute() iso: string;
  @Attribute() region_iso?: string;
  @Attribute() region_name?: string;
  @Attribute() country_centroid?: any;
  @Attribute() region_centroid?: any;
  @Attribute() is_active?: boolean;

}
