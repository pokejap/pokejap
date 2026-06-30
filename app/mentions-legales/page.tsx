import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — PokeJap',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-white font-black text-xl mb-3 border-l-4 border-pokemon-red pl-4">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
      <p className="text-pokemon-red text-xs tracking-[0.3em] uppercase mb-2">Légal</p>
      <h1 className="text-4xl font-black text-white mb-10">Mentions <span className="text-pokemon-red">légales</span></h1>

      <Section title="Éditeur du site">
        <p>Le site PokeJap est édité à titre personnel.</p>
        <p><strong className="text-white">Responsable de publication :</strong> Laurent Romano</p>
        <p><strong className="text-white">Email :</strong> contact@pokejap.fr</p>
      </Section>

      <Section title="Hébergement">
        <p>Ce site est hébergé par <strong className="text-white">Vercel Inc.</strong></p>
        <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
        <p><a href="https://vercel.com" className="text-pokemon-red hover:underline">vercel.com</a></p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          Le nom et les images Pokémon® sont des marques déposées de Nintendo / Creatures Inc. / GAME FREAK inc.
          PokeJap n'est pas affilié à ces sociétés. Les images de cartes sont utilisées à des fins d'identification des produits vendus.
        </p>
      </Section>

      <Section title="Responsabilité">
        <p>
          PokeJap s'efforce d'assurer l'exactitude des informations diffusées sur ce site.
          Toutefois, PokeJap ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées.
        </p>
      </Section>

      <Section title="Droit applicable">
        <p>Les présentes mentions légales sont soumises au droit français.</p>
        <p>En cas de litige, les tribunaux français seront seuls compétents.</p>
      </Section>
    </div>
  )
}
