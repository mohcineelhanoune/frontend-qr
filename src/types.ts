export type Card = {
  id: number;
  title: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  photo_url?: string | null;
  qr_url?: string | null;
  fields_json?: unknown;
};
