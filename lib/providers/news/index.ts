import { newsHub } from "./NewsHub";
import { rssNewsProvider } from "./RSSNewsProvider";

newsHub.register(
  rssNewsProvider,
);

export { newsHub };

export * from "./NewsProvider";
export * from "./RSSNewsProvider";
