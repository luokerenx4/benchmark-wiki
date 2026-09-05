export type Status =
  | "active"
  | "foundational"
  | "superseded"
  | "contested"
  | "live";

export type Kind =
  | "benchmark"
  | "suite"
  | "harness"
  | "leaderboard"
  | "index"
  | "org";

export type FamilyId =
  | "knowledge"
  | "coding"
  | "math"
  | "agents"
  | "multimodal"
  | "chinese"
  | "longcontext"
  | "safety"
  | "harnesses"
  | "orgs";

export type LinkRel =
  | "paper"
  | "repo"
  | "dataset"
  | "homepage"
  | "leaderboard"
  | "harness"
  | "index";

export interface CatalogLink {
  rel: LinkRel;
  label: string;
  href: string;
}

export interface Lineage {
  parents: string[];
  children: string[];
  related: string[];
}

export interface Benchmark {
  slug: string;
  name: string;
  shortName: string;
  accession: string;
  year: number;
  status: Status;
  kind: Kind;
  family: FamilyId;
  domains: string[];
  org: string;
  authors: string;
  summary: string;
  origin: string;
  architecture: string;
  content: string;
  format: string;
  metrics: string[];
  size?: string;
  lineage: Lineage;
  caveats: string;
  links: CatalogLink[];
  /** In-house eval loop, if they run scores on their own track. */
  houseHarness?: string;
}

export interface Family {
  id: FamilyId;
  name: string;
  nameEn: string;
  drawer: string;
  thesis: string;
  blurb: string;
}

export interface IndexSource {
  slug: string;
  name: string;
  kind: Kind;
  blurb: string;
  href: string;
  goodFor: string;
}
