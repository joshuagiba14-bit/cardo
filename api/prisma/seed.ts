import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.offering.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  await prisma.offering.createMany({
    data: [
      {
        slug: "meta-ads",
        titleFr: "Publicité Meta",
        titleEn: "Meta Ads",
        summaryFr:
          "Facebook et Instagram pour être vu par les gens de votre quartier au moment où ils décident.",
        summaryEn:
          "Facebook and Instagram to get in front of people in your area right as they're deciding.",
        bodyFr:
          "Meta Ads fonctionne pour de la demande qu'on crée : quelqu'un ne cherche pas encore votre service, mais il vit dans votre secteur et correspond au profil de votre meilleur client. On construit des audiences à partir de vos clients existants, on teste des créatifs qui ressemblent à du contenu et non à de la pub, et on optimise pour des appels et des soumissions, pas pour des \"j'aime\". Idéal pour les salons, restaurants et cliniques qui vivent du volume et de la notoriété locale.",
        bodyEn:
          "Meta Ads works for demand you create: nobody's searching for you yet, but they live in your area and match your best customer's profile. We build lookalike audiences from your existing clients, test creative that reads like content instead of an ad, and optimize for calls and booked jobs, not likes. Built for salons, restaurants and clinics that live on local volume and awareness.",
        priceFrom: 1500,
        isActive: true,
        displayOrder: 1,
      },
      {
        slug: "google-ads",
        titleFr: "Google Ads",
        titleEn: "Google Ads",
        summaryFr:
          "Search pour capter la demande qui existe déjà — les gens qui cherchent votre service maintenant.",
        summaryEn:
          "Search to capture demand that already exists — people looking for your service right now.",
        bodyFr:
          "Google Ads fonctionne pour de la demande existante : un client a un tuyau qui coule ou une rage de dents et il cherche \"plombier urgence Montréal\" ce soir. On structure les campagnes par service et par secteur, on élimine les mots-clés qui gaspillent votre budget avec des négatifs serrés, et on relie chaque clic à un appel ou une soumission réelle pour qu'on sache ce qui rapporte. Idéal pour les métiers, les entrepreneurs et les cliniques où le client cherche activement une solution.",
        bodyEn:
          "Google Ads works for demand that already exists: a customer has a leaking pipe or a toothache and is searching \"emergency plumber Montreal\" tonight. We structure campaigns by service and by area, cut budget-wasting keywords with tight negatives, and tie every click to a real call or booked job so we know what's actually paying off. Built for trades, contractors and clinics where the customer is actively looking for a fix.",
        priceFrom: 1500,
        isActive: true,
        displayOrder: 2,
      },
      {
        slug: "landing-pages",
        titleFr: "Pages d'atterrissage",
        titleEn: "Landing Pages",
        summaryFr:
          "Une page conçue pour convertir le clic, pas un site vitrine qui le laisse partir sans agir.",
        summaryEn:
          "A page built to convert the click, not a brochure site that lets it wander off.",
        bodyFr:
          "La plupart des sites d'entreprises de services perdent la moitié de leur budget publicitaire avant même que le client ait vu l'offre : trop de menus, pas de numéro visible, formulaire à sept champs. On construit une page par offre, avec un seul appel à l'action, un numéro cliquable et un formulaire qui prend quinze secondes à remplir. Chaque page est reliée au suivi pour qu'on voie exactement combien de soumissions elle génère.",
        bodyEn:
          "Most service-business websites burn through half the ad budget before the customer even sees the offer — too many menus, no visible phone number, a seven-field form. We build one page per offer, one call to action, a tap-to-call number, and a form that takes fifteen seconds to fill in. Every page is wired into tracking so we see exactly how many leads it produces.",
        priceFrom: 800,
        isActive: true,
        displayOrder: 3,
      },
      {
        slug: "tracking-reporting",
        titleFr: "Suivi et rapports",
        titleEn: "Tracking & Reporting",
        summaryFr:
          "Un rapport mensuel avec de vrais chiffres : coût par lead, pas des \"impressions\".",
        summaryEn:
          "A monthly report with real numbers: cost per lead, not \"impressions\".",
        bodyFr:
          "On installe le suivi des appels, des soumissions et des conversions avant de dépenser un dollar en publicité, parce qu'une campagne qu'on ne peut pas mesurer est une campagne qu'on ne peut pas améliorer. Chaque mois, vous recevez un rapport court : combien de leads, à quel coût, et ce qu'on change ensuite. Pas de jargon, pas de tableau de 40 pages.",
        bodyEn:
          "We install call tracking, form tracking and conversion tracking before a single ad dollar goes out, because a campaign you can't measure is a campaign you can't improve. Every month you get a short report: how many leads, at what cost, and what we're changing next. No jargon, no 40-page deck.",
        priceFrom: 400,
        isActive: true,
        displayOrder: 4,
      },
    ],
  });

  await prisma.caseStudy.createMany({
    data: [
      {
        slug: "plomberie-rive-sud",
        clientName: "Plomberie Rive-Sud",
        industry: "trades",
        adSpend: 2200,
        titleFr: "Plomberie Rive-Sud : coût par lead de 80 $ à 22 $",
        titleEn: "Plomberie Rive-Sud: cost per lead from $80 to $22",
        summaryFr:
          "Un plombier de Longueuil payait 80 $ par lead avec son ancienne agence. On l'a fait descendre à 22 $ en six semaines.",
        summaryEn:
          "A Longueuil plumber was paying $80 per lead with his last agency. We got it to $22 in six weeks.",
        challengeFr:
          "Le client dépensait 2 200 $/mois en Google Ads gérés par une agence généraliste. Les campagnes ciblaient des mots-clés génériques comme \"plombier\" partout dans le Grand Montréal, sans suivi des appels — impossible de savoir quels clics devenaient des clients payants.",
        challengeEn:
          "The client was spending $2,200/month on Google Ads run by a generalist agency. Campaigns targeted broad keywords like \"plumber\" across all of greater Montreal, with no call tracking — there was no way to know which clicks turned into paying jobs.",
        approachFr:
          "On a restructuré les campagnes par service à haute marge (débouchage, chauffe-eau, urgence) et par secteur (Longueuil, Brossard, Saint-Lambert), ajouté 140 mots-clés négatifs, et branché le suivi d'appels sur chaque numéro affiché. Résultat : le budget arrête d'aller vers des recherches qui ne paient jamais.",
        approachEn:
          "We restructured campaigns by high-margin service (drain clearing, water heaters, emergency calls) and by neighborhood (Longueuil, Brossard, Saint-Lambert), added 140 negative keywords, and wired call tracking to every number shown. The budget stopped flowing to searches that never pay.",
        resultMetricFr: "Coût par lead réduit de 80 $ à 22 $ en 6 semaines",
        resultMetricEn: "Cost per lead cut from $80 to $22 in 6 weeks",
        isPublished: true,
        publishedAt: new Date("2025-11-03T00:00:00.000Z"),
      },
      {
        slug: "clinique-dentaire-papineau",
        clientName: "Clinique Dentaire Papineau",
        industry: "clinic",
        adSpend: 3000,
        titleFr: "Clinique Dentaire Papineau : 46 nouveaux patients en 90 jours",
        titleEn: "Clinique Dentaire Papineau: 46 new patients in 90 days",
        summaryFr:
          "Une clinique du Plateau qui n'avait jamais fait de publicité a rempli son agenda d'hygiène en trois mois.",
        summaryEn:
          "A Plateau clinic that had never advertised filled its hygiene schedule in three months.",
        challengeFr:
          "La clinique comptait uniquement sur les références et Google Maps. Les plages d'hygiène du mardi et du jeudi étaient à moitié vides, et le propriétaire ne voulait pas d'une agence qui \"fait de tout\" sans comprendre les cycles de rendez-vous dentaires.",
        challengeEn:
          "The clinic relied entirely on referrals and Google Maps. Tuesday and Thursday hygiene slots were half-empty, and the owner didn't want a jack-of-all-trades agency that didn't understand dental appointment cycles.",
        approachFr:
          "Campagnes Google Ads sur \"dentiste [quartier] rendez-vous aujourd'hui\" combinées à du Meta Ads pour promouvoir les blanchiments et les évaluations gratuites auprès des résidents du Plateau et de Rosemont. Chaque annonce pointait vers une page de prise de rendez-vous en ligne, pas vers le site général de la clinique.",
        approachEn:
          "Google Ads campaigns on \"dentist [neighborhood] appointment today\" paired with Meta Ads promoting whitening and free assessments to Plateau and Rosemont residents. Every ad pointed to an online booking page, not the clinic's general website.",
        resultMetricFr: "46 nouveaux patients en 90 jours, agenda du jeudi complet",
        resultMetricEn: "46 new patients in 90 days, Thursdays fully booked",
        isPublished: true,
        publishedAt: new Date("2025-12-01T00:00:00.000Z"),
      },
      {
        slug: "restaurant-le-vieux-port",
        clientName: "Restaurant Le Vieux-Port",
        industry: "restaurant",
        adSpend: 1200,
        titleFr: "Restaurant Le Vieux-Port : les mardis et mercredis remplis",
        titleEn: "Restaurant Le Vieux-Port: Tuesdays and Wednesdays filled up",
        summaryFr:
          "Un restaurant du Vieux-Montréal avait des fins de semaine pleines et des soirs de semaine vides. On a ciblé le problème, pas le restaurant au complet.",
        summaryEn:
          "A Old Montreal restaurant had packed weekends and dead weeknights. We targeted the problem, not the whole restaurant.",
        challengeFr:
          "Les vendredis et samedis étaient déjà complets sans aucune publicité. Le vrai problème : les mardis et mercredis, la salle était à 30 % de capacité, et le propriétaire perdait de l'argent sur le personnel en place pour rien.",
        challengeEn:
          "Fridays and Saturdays were already full with zero advertising. The real problem: on Tuesdays and Wednesdays the dining room sat at 30% capacity, and the owner was losing money on staff scheduled for nothing.",
        approachFr:
          "Une seule campagne Meta Ads ciblant un rayon de 3 km, diffusée uniquement le lundi et le mardi, annonçant une offre table d'hôte valide en semaine seulement. Pas de dépense les jours déjà pleins.",
        approachEn:
          "A single Meta Ads campaign targeting a 3 km radius, running only on Mondays and Tuesdays, promoting a weeknight-only prix fixe offer. No spend on the days that were already full.",
        resultMetricFr: "Taux d'occupation du mardi passé de 30 % à 78 %",
        resultMetricEn: "Tuesday occupancy went from 30% to 78%",
        isPublished: true,
        publishedAt: new Date("2026-01-15T00:00:00.000Z"),
      },
      {
        slug: "salon-coiffure-mile-end",
        clientName: "Salon Coiffure Mile End",
        industry: "salon",
        adSpend: 900,
        titleFr: "Salon Coiffure Mile End : liste d'attente en 5 semaines",
        titleEn: "Salon Coiffure Mile End: a waitlist in 5 weeks",
        summaryFr:
          "Un salon qui perdait sa styliste vedette a rebâti sa clientèle autour du reste de l'équipe.",
        summaryEn:
          "A salon losing its star stylist rebuilt its client base around the rest of the team.",
        challengeFr:
          "La styliste la plus populaire du salon partait ouvrir son propre commerce, avec elle une bonne partie de la clientèle régulière. Le salon avait besoin de nouveaux clients pour les deux autres stylistes, rapidement, sans casser son image haut de gamme.",
        challengeEn:
          "The salon's most popular stylist was leaving to open her own shop, taking a chunk of regular clients with her. The salon needed new clients for its two remaining stylists, fast, without cheapening its upscale image.",
        approachFr:
          "Meta Ads avec des vidéos avant/après tournées en salon, ciblées sur les femmes de 25 à 45 ans du Mile End et du Plateau qui suivent des comptes de mode et de beauté locaux. Offre de première visite à prix fixe pour réduire le risque d'essayer un nouveau styliste.",
        approachEn:
          "Meta Ads using before/after videos shot in-salon, targeted at women 25-45 in Mile End and Plateau who follow local fashion and beauty accounts. A fixed-price first-visit offer to lower the risk of trying a new stylist.",
        resultMetricFr: "Liste d'attente pour nouveaux clients après 5 semaines",
        resultMetricEn: "A new-client waitlist after 5 weeks",
        isPublished: true,
        publishedAt: new Date("2026-02-10T00:00:00.000Z"),
      },
    ],
  });

  const passwordHash = await bcrypt.hash("CardoAdmin123!", 10);
  await prisma.user.create({
    data: {
      email: "admin@cardo.agency",
      passwordHash,
      role: "admin",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@cardo.agency / CardoAdmin123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
