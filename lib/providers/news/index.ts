import { newsHub } from "./NewsHub";

import { MockNewsProvider } from "./MockNewsProvider";

newsHub.register(
  new MockNewsProvider()
);

export { newsHub };
export * from "./NewsProvider";
