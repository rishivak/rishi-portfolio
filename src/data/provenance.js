import { certifications as certs, education as edu } from './experience';

/**
 * The credential ledger. Derived from the career data so education and
 * certifications have exactly one definition on the site.
 */
export const education = edu;
export const certifications = certs;
export const languages = [{ name: 'English', level: 'Professional working proficiency' }];
