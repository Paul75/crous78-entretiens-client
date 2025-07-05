import { HttpResponse } from '@angular/common/http';

function extractFilename(header: string | null, defaultName: string): string {
  if (!header) return defaultName;
  const match = header.match(/filename="?([^"]+)"?/);
  return match?.[1] ?? defaultName;
}

export function toBlob(response: HttpResponse<Blob>): { blob: Blob; filename: string } {
  const header = response.headers.get('Content-Disposition');
  const filename = extractFilename(header, 'entretien.pdf');
  const blob = new Blob([response.body!], { type: 'application/pdf' });
  return { blob, filename };
}
