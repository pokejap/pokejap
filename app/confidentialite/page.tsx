import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — PokeJap',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-white font-black text-xl mb-3 border-l-4 border-pokemon-red pl-4">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
      <p className="text-pokemon-red text-xs tracking-[0.3em] uppercase mb-2">Légal</p>
      <h1 className="text-4xl font-black text-white mb-2">Politique de <span className="text-pokemon-red">confidentialité</span></h1>
      <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : juin 2025</p>

      <Section title="1. Données collectées">
        <p>Lors d'une commande, nous collectons les données suivantes :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Prénom, nom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone (optionnel)</li>
          <li>Adresse de livraison</li>
        </ul>
        <p>
          Les données bancaires sont traitées exclusivement par <strong className="text-white">Stripe</strong> et ne sont jamais
          stockées sur nos serveurs.
        </p>
        <p>
          Si vous créez un compte, vos informations sont stockées localement dans votre navigateur
          (localStorage) et ne sont pas transmises à des tiers.
        </p>
      </Section>

      <Section title="2. Finalité du traitement">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Traiter et expédier vos commandes</li>
          <li>Vous envoyer un email de confirmation de commande (via Stripe)</li>
          <li>Répondre à vos demandes de service après-vente</li>
        </ul>
        <p>Vos données ne sont <strong className="text-white">jamais vendues ni partagées</strong> avec des tiers à des fins commerciales.</p>
      </Section>

      <Section title="3. Cookies">
        <p>PokeJap utilise uniquement des cookies strictement nécessaires au fonctionnement du site :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong className="text-white">Panier (pokemon-cart) :</strong> conserve votre panier entre les sessions</li>
          <li><strong className="text-white">Compte (pokejap-auth) :</strong> maintient votre connexion si vous avez un compte</li>
          <li><strong className="text-white">Cookies Stripe :</strong> nécessaires au traitement sécurisé du paiement</li>
        </ul>
        <p>Aucun cookie publicitaire ou de suivi (Google Analytics, Meta Pixel, etc.) n'est utilisé.</p>
      </Section>

      <Section title="4. Vos droits (RGPD)">
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement («droit à l'oubli»)</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à <strong className="text-white">contact@pokemon-cartes.fr</strong>.
          Nous répondrons dans un délai de 30 jours.
        </p>
      </Section>

      <Section title="5. Conservation des données">
        <p>
          Les données de commande sont conservées pendant <strong className="text-white">3 ans</strong> à compter de la date
          d'achat, conformément aux obligations légales comptables françaises.
        </p>
        <p>
          Les données de compte stockées dans votre navigateur peuvent être supprimées à tout moment
          en effaçant les données du site dans les paramètres de votre navigateur.
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          Pour toute question relative à la protection de vos données personnelles :<br />
          <strong className="text-white">contact@pokemon-cartes.fr</strong>
        </p>
        <p>
          Vous avez également le droit de déposer une réclamation auprès de la{' '}
          <a href="https://www.cnil.fr" className="text-pokemon-red hover:underline" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </p>
      </Section>
    </div>
  )
}
