import { NUM_CHARACTERS_DESCRIPTION } from "./consts";

export function truncateHtml(html: string): string {
  const doInsertEllipsis = html.length === NUM_CHARACTERS_DESCRIPTION

  // We have to add a </p> in case the first thing is a belong paragraph. Otherwise, we would get an empty description.
  html = html + '</p>'

  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
  let stack: string[] = [];
  let result = '';
  let pos = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    let tag = match[1];
    if (!tag) {
      continue
    }

    let isClosingTag = match[0][1] === '/';
    let tagIndex = match.index;

    if (!isClosingTag) {
      if (voidTags.indexOf(tag.toLowerCase()) === -1) {
        stack.push(tag);
      }
    } else {
      if (stack.length > 0 && stack[stack.length - 1] === tag) {
        stack.pop();
      }
    }

    result += html.substring(pos, tagIndex + match[0].length);
    pos = tagIndex + match[0].length;
  }

  result += html.substring(pos);

  while (stack.length > 0) {
    let tag = stack.pop();
    result = result.substring(0, result.lastIndexOf('<' + tag));
  }

  // Get rid of the potentially excessive </p>
  const openingTags = result.match(/<p>/gi)?.length
  const closingTags = result.match(/<\/p>/gi)?.length
  if (openingTags !== undefined && closingTags !== undefined) {
    if (closingTags - openingTags === 1) {
      result = result.substring(0, result.length - 4)
    } else if (closingTags - openingTags !== 0) {
      throw new Error("HTML seems malformed: " + result)
    }
  }

  if (doInsertEllipsis && result.slice(-4) === '</p>') {
    result = result.slice(0, -4) + ' ...</p>'
  }

  return result;
}
