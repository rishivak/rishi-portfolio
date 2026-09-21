# Asset redaction — required before deployment

**Status: NOT DONE.** Every file below is the unsanitised original.

These screenshots ship to the browser exactly as they are on disk. There is no CSS
mask layer, deliberately: a mask is an opaque rectangle drawn *over* an image, so the
original pixels still arrive in the network response and can be read by anyone who
opens devtools or disables CSS. That is not redaction.

The only real fix is to crop the files themselves. Apply the rectangles below, save
**over** the originals so `src/data/images.js` needs no change, and the test suite will
stop warning.

Percentages are of each image's own width and height.

---

## `clarifi1.png`

`1916×1150` · 143 KB · unsanitised SHA-256 `bb088a6fe959fc45…`

- **Title bar** — `y 0 → 2.2%`  
  removes the internal build string "S&P | ClariFI 5.6.1RC23"

- **Left panel** — `x 0 → 17.5%`  
  removes the licensed Compustat/IBES data dictionary, item mnemonics and basket names

## `Clarifi_2.png`

`1918×1150` · 197 KB · unsanitised SHA-256 `21938bde6e8f1c69…`

- **Crop to right canvas** — `keep x ≥ 38%`  
  keeps your compounded-return and cumulative-return concept graphs; drops the title bar and the 354-transform library

## `Clarifi_3.png`

`1918×1155` · 162 KB · unsanitised SHA-256 `33e13c953e8492f0…`

- **Title bar** — `y 0 → 2.2%`  
  removes the internal build string

- **Left panel** — `x 0 → 17.5%`  
  removes the data dictionary

## `Clarifi_4.png`

`1915×1146` · 643 KB · unsanitised SHA-256 `0936cc6f219eb22f…`

- **Title bar** — `y 0 → 2.2%`  
  removes the internal build string

- **Left panel** — `x 0 → 17.5%`  
  removes the data dictionary

## `foreseer.png`

`1906×939` · 190 KB · unsanitised SHA-256 `0a0dd3dc5f19443a…`

- **Top band** — `y 0 → 13%`  
  removes your rishi.sharma2@spglobal.com session, the QA ENV badge, and the KeyInst / Keydoc / Keyfile identifiers and issuer name

## `foreseer2.png`

`1906×937` · 337 KB · unsanitised SHA-256 `04a6ce21eaaee1eb…`

- **Top band** — `y 0 → 13%`  
  same header: session, QA badge, internal identifiers, issuer name

## `plan4healthcare.png`

`1600×816` · 340 KB · unsanitised SHA-256 `fbe9d70b1eadefae…`

- **Review before publishing** — `—`  
  client-owned government platform; confirm no real patient, hospital or budget data is visible

## `plan4healthcare2.png`

`736×454` · 201 KB · unsanitised SHA-256 `dee0b334be2dc692…`

- **Review before publishing** — `—`  
  as above

## `DOE.png`

`1392×690` · 431 KB · unsanitised SHA-256 `b5e3462d2a576e76…`

- **Review before publishing** — `—`  
  client-owned government platform; confirm no real applicant or licence data is visible

## `DOE1.png`

`1000×750` · 307 KB · unsanitised SHA-256 `c3788ffd2609cdf9…`

- **Review before publishing** — `—`  
  as above

## `doe2.png`

`1280×720` · 328 KB · unsanitised SHA-256 `b24bc845ed6b5489…`

- **Review before publishing** — `—`  
  as above

---

## Verified hashes

`.smoke/assets.mjs` compares each file against these. While a file still matches, the
suite prints `ASSETS NOT SANITISED — do not deploy`.

```
bb088a6fe959fc45e432531a97db0fae8cbd2b327d6f15ef72796c803f1f9f55  clarifi1.png
21938bde6e8f1c6996ce0718fd04f9deac4f4e744ff748a44ff311d9c163bf88  Clarifi_2.png
33e13c953e8492f0b1970ccf21718a6005f3f07ff085b31edd4de92ad8ed60f4  Clarifi_3.png
0936cc6f219eb22f3c91edc82cbf130c62c688774fa141510413fdf60579634e  Clarifi_4.png
0a0dd3dc5f19443a77420b9a01becce9ccfbd986bc1811de61c1003eedebdb34  foreseer.png
04a6ce21eaaee1eb680cd5b91d422f1707c052ed494c4c48e5b8fefeeffaac13  foreseer2.png
fbe9d70b1eadefae05d855dc44d4ccaa93dadb400619b6f2744569db5455e480  plan4healthcare.png
dee0b334be2dc69210d460936b3a2cf447ee80d26bf2ed1f8653e65459da7d6b  plan4healthcare2.png
b5e3462d2a576e76b89179d099aeb9cc3e6279f391dc01915774860ca0a83926  DOE.png
c3788ffd2609cdf9bc49633fbd30a40a1cc0a4dd63de7cf7494bf8d00868a428  DOE1.png
b24bc845ed6b5489ea5e463437bd16d801c85c9144007db60daf7208bcd3bbb7  doe2.png
```
