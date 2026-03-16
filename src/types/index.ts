export type Severity = 'red' | 'yellow' | 'green';

export type Category =
  | 'engine'
  | 'brakes'
  | 'lights'
  | 'electrical'
  | 'safety'
  | 'transmission'
  | 'fluids'
  | 'body'
  | 'climate'
  | 'other';

export interface CategoryInfo {
  id: Category;
  nameAr: string;
  icon: string;
  color: string;
}

export interface WarningLight {
  id: string;
  nameAr: string;
  nameEn: string;
  category: Category;
  severity: Severity;
  icon: string;
  descriptionAr: string;
  actionAr: string;
  canDrive: boolean;
  commonCausesAr: string[];
}

export type Screen =
  | { name: 'home' }
  | { name: 'browse'; category?: Category }
  | { name: 'search' }
  | { name: 'detail'; lightId: string };
