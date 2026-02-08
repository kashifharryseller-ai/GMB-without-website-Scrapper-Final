
import { Lead } from "../types";

export const exportToCSV = (leads: Lead[], filename: string = "gmb_leads.csv") => {
  if (leads.length === 0) return;

  const headers = ["Business Name", "Phone", "Address", "Lead Score", "GMB Link", "Reasoning", "AI Website Prompt"];
  const rows = leads.map(lead => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.phone.replace(/"/g, '""')}"`,
    `"${lead.address.replace(/"/g, '""')}"`,
    lead.lead_score,
    `"${(lead.maps_url || "").replace(/"/g, '""')}"`,
    `"${(lead.reasoning || "").replace(/"/g, '""')}"`,
    `"${(lead.website_prompt || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
