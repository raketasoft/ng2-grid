import { Country } from './country';
import { Interest } from './interest';

/**
 * Person model class.
 *
 * Used for transforming row data into specific model via data item callback.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta
 */
export class Person {
  public id: number;
  public name: string;
  public age: number;
  public address: string;
  public country: Country;
  public isMarried: boolean;
  public interests: Array<Interest>;

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
    this.age = params.age;
    this.address = params.address;
    this.country = new Country(params.country);
    this.isMarried = params.isMarried;
    this.interests = _.map(params.interests, (interest: any) => new Interest(interest));
  }

  get isRetired(): boolean {
    return this.age > 60;
  }
}
