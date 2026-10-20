const TOPICS = [
  { slug: "banana-matcha-san-francisco", label: "banana matcha" },
  { slug: "matcha-cold-foam-san-francisco", label: "cold foam" },
  { slug: "soy-milk-matcha-san-francisco", label: "soy milk" },
];

export function GuideDiscovery({ guides }) {
  const available = new Set(guides.map(guide => guide.slug));
  return (
    <nav className="guide-discovery" aria-label="Matcha guides">
      <div className="guide-discovery-row">
        <a className="guide-discovery-all" href="/guides/"><strong>{guides.length} matcha guides →</strong></a>
        <div className="guide-discovery-topics">
          {TOPICS.filter(topic => available.has(topic.slug)).map(topic => (
            <a key={topic.slug} href={`/guides/${topic.slug}/`} aria-label={`${topic.label} guide`}>{topic.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
