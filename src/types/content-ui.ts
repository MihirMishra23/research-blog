import type {
  ArticleType,
  ConceptMaturity,
  DifficultyLevel,
  PublicationStatus,
} from '../content/schemas';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TopicReference {
  id: string;
  label: string;
  href?: string;
  maturity?: ConceptMaturity;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  date: Date | string;
  updated?: Date | string;
  topics: TopicReference[];
  level: DifficultyLevel;
  type: ArticleType;
  status: PublicationStatus;
  github?: string | null;
}

export interface ContentLink {
  title: string;
  href: string;
  description?: string;
}

export interface ArticleNavigationData {
  previous?: ContentLink;
  next?: ContentLink;
  related?: ContentLink[];
}
