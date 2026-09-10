import type { Metadata } from "next";
import tenant from "@/fixtures/tenant.json";
import { resolveLocale, buildHreflang, buildCanonical } from "@/lib/resolve-locale";
import { buildChurchEntity, buildBreadcrumb } from "@/lib/json-ld";

const locales = ["lt", "en", "ru"] as const;

export function generateMetadata(): Metadata {
  const name = resolveLocale(tenant.name, "lt");
  return {
    title: `${name} — Cathedral Landing | ${tenant.slug}`,
    alternates: {
      canonical: buildCanonical(tenant.identity.domain),
      languages: buildHreflang(tenant.identity.domain, locales),
    },
  };
}

export default function CathedralPage() {
  const locale = "lt";
  const t = (obj: Record<string, string>) => resolveLocale(obj, locale);
  const churchEntity = buildChurchEntity({
    name: t(tenant.name),
    address: tenant.identity.address,
    phone: tenant.identity.phone,
    geo: { lat: 54.6872, lng: 25.2797 },
    parentOrganization: tenant.identity.jurisdiction || "",
    additionalProperty: [{ name: "designation", value: "cathedral" }]
  });
  const breadcrumb = buildBreadcrumb([
    { name: t(tenant.name), url: `https://${tenant.identity.domain}/` },
  ]);
  const page = tenant.pages[0];

  const hero = page.contentBlocks[0] as any;
  const kv = page.contentBlocks[1] as any;
  const cta = page.contentBlocks[2] as any;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(churchEntity) } }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumb) } }
      />

      {/* Hero */}
      <section aria-label="Hero" className="bg-liturgical-gold/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t(hero.heading)}</h1>
          {hero.subheading && <p className="text-xl text-gray-700 mb-2">{t(hero.subheading)}</p>}
          <p className="text-lg text-gray-600">{t(hero.body)}</p>
          <span className="inline-block mt-4 px-3 py-1 bg-liturgical-gold/20 rounded text-sm font-medium">Diocesan seat</span>
        </div>
      </section>

      {/* Contact + Facts */}
      <section aria-label="Contact information" className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t(kv.heading)}</h2>
            <dl className="space-y-2">
              {kv.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-2">
                  <dt className="font-medium text-gray-700 min-w-[120px]">{t(item.label)}:</dt>
                  <dd className="text-gray-600">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Quick facts</h2>
            <ul className="space-y-1 text-gray-600">
              <li>Diocese: {tenant.identity.jurisdiction}</li>
              <li>Established: {tenant.identity.established}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Quick links" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <nav className="flex flex-wrap gap-4 justify-center">
            {cta.links.map((link: any, i: number) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-liturgical-gold/20 rounded-lg hover:bg-liturgical-gold/30 transition-colors font-medium">{t(link.label)}</a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
