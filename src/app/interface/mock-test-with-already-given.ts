import { MockTest } from "./mockTest";

export interface MockTestWithAlreadyGiven {
    test: MockTest;
    isAlreadyGiven: boolean;
}
