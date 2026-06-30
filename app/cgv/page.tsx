import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions générales de vente — PokeJap',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-white font-black text-xl mb-3 border-l-4 border-pokemon-red pl-4">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
      <p className="text-pokemon-red text-xs tracking-[0.3em] uppercase mb-2">Légal</p>
      <h1 className="text-4xl font-black text-white mb-2">Conditions générales <span className="text-pokemon-red">de vente</span></h1>
      <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : juin 2025</p>

      <Section title="1. Objet">
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes de cartes Pokémon
          effectuées sur le site PokeJap entre Laurent Romano (le vendeur) et tout acheteur (le client).
        </p>
      </Section>

      <Section title="2. Produits">
        <p>
          Les cartes Pokémon proposées à la vente sont des singles (cartes à l'unité), principalement
          importées du Japon. Chaque carte est décrite avec son état (Neuf, Quasi-Neuf, Excellent, etc.).
        </p>
        <p>
          Les photos et descriptions sont données à titre indicatif. PokeJap s'engage à proposer des
          produits authentiques et conformes à leur description.
        </p>
      </Section>

      <Section title="3. Prix">
        <p>
          Les prix sont indiqués en euros (€) toutes taxes comprises. PokeJap se réserve le droit de
          modifier ses prix à tout moment, sans préavis. Les prix appliqués sont ceux en vigueur au
          moment de la validation de la commande.
        </p>
      </Section>

      <Section title="4. Commandes">
        <p>
          Toute commande passée sur PokeJap constitue un contrat de vente entre le client et PokeJap.
          La confirmation de commande est envoyée par email dès réception du paiement.
        </p>
        <p>
          PokeJap se réserve le droit d'annuler une commande en cas de stock insuffisant ou d'erreur
          manifeste sur le prix, avec remboursement intégral du client.
        </p>
      </Section>

      <Section title="5. Paiement">
        <p>
          Le paiement s'effectue exclusivement en ligne, via la plateforme sécurisée <strong className="text-white">Stripe</strong>.
          Les données bancaires ne transitent pas par nos serveurs et sont entièrement gérées par Stripe.
        </p>
        <p>Modes de paiement acceptés : carte bancaire (Visa, Mastercard, American Express).</p>
      </Section>

      <Section title="6. Livraison">
        <p>
          Les commandes sont expédiées sous <strong className="text-white">1 à 2 jours ouvrés</strong> après confirmation du paiement,
          via Colissimo ou lettre suivie selon le montant de la commande.
        </p>
        <p>
          <strong className="text-white">Livraison offerte</strong> dès 30 € d'achat. En dessous, les frais de port s'élèvent à 5,99 €.
        </p>
        <p>
          PokeJap ne peut être tenu responsable des retards ou pertes imputables au transporteur.
        </p>
      </Section>

      <Section title="7. Droit de rétractation">
        <p>
          Conformément à l'article L.221-18 du Code de la consommation, le client dispose d'un délai
          de <strong className="text-white">14 jours</strong> à compter de la réception de sa commande pour exercer son droit de
          rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
        </p>
        <p>
          Pour exercer ce droit, contactez-nous à <strong className="text-white">contact@pokejap.fr</strong>.
          Les frais de retour sont à la charge du client. Le remboursement sera effectué sous 14 jours
          à compter de la réception du retour.
        </p>
        <p>
          <em>Exception :</em> le droit de rétractation ne s'applique pas aux cartes dont le
          scellé a été ouvert ou dont l'état diffère de celui à la livraison.
        </p>
      </Section>

      <Section title="8. Garanties">
        <p>
          PokeJap garantit l'authenticité de toutes les cartes vendues. En cas de carte contrefaite
          avérée, un remboursement intégral sera effectué.
        </p>
      </Section>

      <Section title="9. Litiges">
        <p>
          En cas de litige, nous vous invitons à nous contacter en premier lieu à <strong className="text-white">contact@pokejap.fr</strong>.
          En l'absence de résolution amiable, les tribunaux français compétents seront saisis.
          Le droit français est applicable.
        </p>
        <p>
          Vous pouvez également recourir à la plateforme de résolution des litiges en ligne de la
          Commission Européenne : <a href="https://ec.europa.eu/consumers/odr" className="text-pokemon-red hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>
        </p>
      </Section>
    </div>
  )
}
