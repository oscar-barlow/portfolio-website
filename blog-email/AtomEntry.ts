import type { AtomLink } from "./AtomLink.ts";

export interface AtomEntry {
  id?: string;
  title?: string | { "#text"?: string };
  link?: AtomLink | AtomLink[];
  published?: string;
  content?: string | { "#text"?: string };
}
