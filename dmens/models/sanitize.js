// https://gomakethings.com/how-to-sanitize-html-strings-with-vanilla-js-to-reduce-your-risk-of-xss-attacks/
/*!
 * Sanitize an HTML string
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String}          str   The HTML string to sanitize
 * @param  {Boolean}         nodes If true, returns HTML nodes instead of a string
 * @return {String|NodeList}       The sanitized string or nodes
 */
export function sanitizeHTML(str, returnNodes) {
    // Convert the string to HTML
    let html = stringToHTML(str);
    // Sanitize it
    removeScripts(html);
    cleanHtmlNode(html);
    // If the user wants HTML nodes back, return them
    // Otherwise, pass a sanitized string back
    return returnNodes ? html.childNodes : html.innerHTML;
}
/**
 * Convert the string to an HTML document
 * @return {Node} An HTML document
 */
function stringToHTML(str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body || document.createElement('body');
}
/**
 * Remove <script> elements
 * @param  {Node} html The HTML
 */
function removeScripts(html) {
    let scripts = html.querySelectorAll('script');
    scripts && scripts.forEach((script) => script.remove());
}
/**
 * Check if the attribute is potentially dangerous
 * @param  {String}  name  The attribute name
 * @param  {String}  value The attribute value
 * @return {Boolean}       If true, the attribute is potentially dangerous
 */
function isDangerous(name, value) {
    let val = value.replace(/\s+/g, '').toLowerCase();
    if (['src', 'href', 'xlink:href'].includes(name)) {
        return val.includes('javascript:') || val.includes('data:text/html');
    }
    return name.startsWith('on');
}
/**
 * Remove potentially dangerous attributes from an element
 * @param  {Node} elem The element
 */
function removeAttributes(elem) {
    // Loop through each attribute
    // If it's dangerous, remove it
    if (elem) {
        let atts = elem.attributes;
        for (let e in atts) {
            if (!isDangerous(atts[e].name, atts[e].value))
                continue;
            elem.removeAttribute(atts[e].name);
        }
    }
}
/**
* Remove dangerous stuff from the HTML document's nodes
* @param  {Node} html The HTML document
*/
function cleanHtmlNode(html) {
    let nodes = html.children;
    for (let n in nodes) {
        removeAttributes(nodes[n]);
        cleanHtmlNode(nodes[n]);
    }
}
//======================================================================================
// using it
// Get the element to inject into
//var app = document.querySelector('#app');
// Malicious third-party code
//let thirdPartyString = `<img src=x onerror="alert('XSS Attack')">`;
//let thirdPartyURL = `javascript:alert('Another XSS Attack')`;
// Create an HTML string
//let htmlStr =
//	`<p>${thirdPartyString}</p>
//	<p><a href="${thirdPartyURL}">View My Profile</a></p>`;
// app.innerHTML = cleanHTML(htmlStr);
//app.append(...cleanHTML(htmlStr, true));
