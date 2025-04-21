import React from "react";

const socials = [
  { name: "Facebook", url: (slug: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(slug)}`, icon: "facebook" },
  { name: "Twitter", url: (slug: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(slug)}`, icon: "twitter" },
  { name: "LinkedIn", url: (slug: string) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(slug)}`, icon: "linkedin" },
  { name: "Pinterest", url: (slug: string) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(slug)}`, icon: "pinterest" },
];

export function SocialShare({ url, title }: { url: string, title: string }) {
  // Note: Place SVG icons (facebook.svg, twitter.svg, linkedin.svg, pinterest.svg) in /public/icons/
  // Fallback: If icon is missing, show a colored circle with the first letter
  return (
    <div className="flex gap-3 mt-2">
      {socials.map(s => (
        <a
          key={s.name}
          href={s.url(url)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${s.name}`}
          className="hover:scale-110 transition"
        >
          <img
            src={`/icons/${s.icon}.svg`}
            alt={s.name}
            className="w-9 h-9 inline-block bg-white border border-gray-300 rounded-full shadow-sm p-1"
            onError={e => {
              // fallback if icon missing
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.background = '#2563eb';
              (e.target as HTMLImageElement).style.color = 'white';
              (e.target as HTMLImageElement).style.display = 'flex';
              (e.target as HTMLImageElement).style.alignItems = 'center';
              (e.target as HTMLImageElement).style.justifyContent = 'center';
              (e.target as HTMLImageElement).style.fontWeight = 'bold';
              (e.target as HTMLImageElement).style.fontSize = '1.25rem';
              (e.target as HTMLImageElement).alt = s.name;
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%232563eb'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='white' font-size='18' font-family='Arial' dy='.3em'%3E${s.name[0]}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </a>
      ))}
    </div>
  );
}
