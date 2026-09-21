/**
 * Project imagery.
 *
 * Filenames are verified against src/assets and are case-sensitive — note that
 * `clarifi1` is lowercase while `Clarifi_2/3/4` are capitalised, and `DOE`/`DOE1`
 * are upper while `doe2` is lower. The harness asserts every one of these
 * resolves, so a rename cannot silently blank a sequence.
 *
 * `alt` is per-image and distinct: a screen reader should learn something
 * different from each one rather than hearing "screenshot" five times.
 *
 * ── DEPLOYMENT WARNING ────────────────────────────────────────────────────
 * These are unsanitised originals. docs/REDACTION.md lists the crop rectangles
 * that must be applied to the files themselves before this site is deployed.
 * There is no CSS mask layer — a mask would leave the original pixels in the
 * network response, which is not redaction. The test suite prints a warning
 * while the assets still match their recorded unsanitised hashes.
 */
import clarifi1 from '../assets/clarifi1.png';
import clarifi2 from '../assets/Clarifi_2.png';
import clarifi3 from '../assets/Clarifi_3.png';
import clarifi4 from '../assets/Clarifi_4.png';
import foreseer1 from '../assets/foreseer.png';
import foreseer2 from '../assets/foreseer2.png';
import p4h1 from '../assets/plan4healthcare.png';
import p4h2 from '../assets/plan4healthcare2.png';
import doe1 from '../assets/DOE.png';
import doe2 from '../assets/DOE1.png';
import doe3 from '../assets/doe2.png';

export const imagery = {
  phoenix: [
    { src: clarifi1, w: 1916, h: 1150, alt: 'The platform workspace, showing the data library and the analytical modules available to a researcher.' },
    { src: clarifi2, w: 1918, h: 1150, alt: 'The concept editor, with the compounded return and cumulative return transforms wired as node graphs from price and dividend inputs.' },
    { src: clarifi3, w: 1918, h: 1155, alt: 'The data export configuration, showing export modes, identifier options and formatting controls.' },
    { src: clarifi4, w: 1915, h: 1146, alt: 'A multi-series time-series chart rendered from the platform’s computed output.' },
  ],
  foreseer: [
    { src: foreseer1, w: 1906, h: 939, alt: 'The extraction workspace with a filing open, showing candidate financial fields detected alongside the source document.' },
    { src: foreseer2, w: 1906, h: 937, alt: 'The tagging view, mapping extracted short and long labels against a balance sheet from the source filing.' },
  ],
  plan4healthcare: [
    { src: p4h1, w: 1600, h: 816, alt: 'The hospital budgeting interface, showing budget lines and their tracked allocations.' },
    { src: p4h2, w: 736, h: 454, alt: 'A budget detail view with the supporting figures behind a single allocation.' },
  ],
  doe: [
    { src: doe1, w: 1392, h: 690, alt: 'The licensing portal used by energy-plant operators to submit and track applications.' },
    { src: doe2, w: 1000, h: 750, alt: 'A licence application record with its document exchange history.' },
    { src: doe3, w: 1280, h: 720, alt: 'The partner integration view, showing documents exchanged across the organisational boundary.' },
  ],
  // OI Pulse has no screenshots in the repository. The sequence component skips
  // itself entirely when an images array is empty, so this needs no placeholder.
  'oi-pulse': [],
};

export const imageCount = Object.values(imagery).reduce((n, list) => n + list.length, 0);
