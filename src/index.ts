import { Application } from "./Application";

(async (): Promise<void> => {
    await Application.build().serve();
})();
