export abstract class Dto {
    // tslint:disable-next-line:no-any

    // Static abstract methods aren't implemented in typescript, so we'll have to rely
    // on convention for the implementation of these methods downstream
    // public static abstract build(body: any): Dto | undefined;

    public abstract isValid(): boolean;
}
