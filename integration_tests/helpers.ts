export function sleep(ms: number) {
    // tslint:disable-next-line:typedef
    return new Promise(resolve => setTimeout(resolve, ms));
}
