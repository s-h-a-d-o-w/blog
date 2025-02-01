import { NUM_CHARACTERS_DESCRIPTION } from "./consts";
import { stripHtmlTags } from "./stripHtmlTags";
import { truncateHtml } from "./truncateHtml";

export function parseDescription(compiledContent: string) {
  return stripHtmlTags(truncateHtml(
    compiledContent.slice(0, NUM_CHARACTERS_DESCRIPTION),
  ));
}