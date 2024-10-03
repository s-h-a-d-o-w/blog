import { NUM_CHARACTERS_DESCRIPTION } from "./consts";

export function truncateHtml(html: string): string {
  const doInsertEllipsis = html.length === NUM_CHARACTERS_DESCRIPTION

  // We have to add a </p> in case the first thing is a long paragraph. Otherwise, we would get an empty description.
  // if (html.includes("<p>") && !html.includes("</p>")) {
  //   return `${html}${doInsertEllipsis ? ' ...' : ''}</p>`
  // }

  // Remove first <p> if it's never closed
  if (html.includes("<p>") && !html.includes("</p>")) {
    html=html.substring(3)
  }

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

  // Remove potentially cut off tags from the end of the result
  const lastTagStart = result.lastIndexOf('<')
  const lastTagEnd = result.lastIndexOf('>')
  if ((lastTagStart >= 0 && lastTagEnd === -1) || (lastTagStart >= 0 &&  lastTagStart > lastTagEnd)) {
    result = result.substring(0, result.lastIndexOf('<')).trim();
  }

  if (doInsertEllipsis) {
    result += ' ...'
  }

  return `<p>${result}</p>`;
}
