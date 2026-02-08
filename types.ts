
export interface Lead {
  name: string;
  phone: string;
  address: string;
  lead_score: number;
  reasoning: string;
  website_prompt: string;
  maps_url: string;
}

export interface SearchParams {
  keyword: string;
  location: string;
  maxResults: number;
}

export interface ApiResponse {
  leads: Lead[];
  error?: string;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}
