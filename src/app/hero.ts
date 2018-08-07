export class Hero {
    // ! means "definite assigment assertion"
    // we need it since TS checks to ensure that each instance property of a class
    // gets initialized in the constructor body, or by a property initializer
    id!: number;
    name!: string;
}
