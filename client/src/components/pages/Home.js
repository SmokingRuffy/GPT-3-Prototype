import React, { useEffect, useContext, useState } from "react";
import useSWR from "swr";
import Fuse from "fuse.js";

import axios from "axios";

import {
    Container,
    Col,
    Row,
    InputGroup,
    FormControl,
    Pagination,
    Form,
    Button,
    Spinner,
    Card,
    Modal,
    Tooltip,
    OverlayTrigger,
    Image
  } from "react-bootstrap";


const Home = () => {
  const test_sum = "Mit dem Gesetz werden aufgrund europarechtlicher Vorgaben verschiedene nationale Gesetze angepasst. Die Rechtsakte müssen entweder bis Mitte Juni 2021 umgesetzt sein oder kommen ab Ende 2021 oder Anfang 2022 erstmals zur Anwendung, sodass die nationalen Rechtsvorschriften bis dahin angepasst werden müssen. Von Bedeutung ist hier insbesondere die EU-Verordnung zur Regelung von Schwarmfinanzierungsdienstleistern, die über ihre Plattformen Kredite vermitteln. Neben einer Haftung für die Angaben im Anlageninformationsblatt werden Bußgeldtatbestände eingeführt, die zum Tragen kommen, wenn gegen die Vorgaben der EU-Verordnung verstoßen wird. Im Übrigen sind die inhaltlichen Anforderungen an die Schwarmfinanzierung in der EU-Verordnung selbst enthalten und gelten daher unmittelbar auch im Inland. Das Gesetz trägt weiter zur Umsetzung der Verordnung über ein Paneuropäisches Privates Pensionsprodukt („PEPP“) (PEPP-VO). Aufgrund dieser Verordnung werden insbesondere Sanktionsregelungen bei Verstößen gegen die PEPP-VO in das Wertpapierhandelsgesetz eingefügt, die auch für andere Aufsichtsgesetze gelten. Weiter finden sich im Gesetzentwurf Regelungen zur Umsetzung der EU-Verordnung zur Sanierung und Abwicklung von Zentralen Gegenparteien (Central Counterparties, CCPs). CCPs nehmen eine Schlüsselfunktion auf den Finanzmärkten ein, indem sie bei Transaktionen mit verschiedenen Finanzinstrumenten zwischen die Vertragsparteien treten und somit sowohl Käufer für jeden Verkäufer als auch Verkäufer für jeden Käufer sind.  Schließlich werden vor dem Hintergrund der Erfahrungen aus der Insolvenz eines Factoringinstituts verschiedene Vorschriften im Kreditwesengesetz erweitert. Damit wird u. a. der Instrumentenkasten der Bundesanstalt für Finanzdienstleistungsaufsicht  zur Stärkung der Factoringaufsicht angepasst. Insbesondere sollen künftig immer zwei Geschäftsführer vorhanden sein, um Manipulationen zu erschweren. Außerdem wird das Börsengesetz geändert. Mit der Änderung wird die bislang nur eingeschränkte Anwendbarkeit der in der Abgabenordnung enthaltenen Auskunfts-, Vorlage-, Amtshilfe- und Anzeigepflichten der Börsen gegenüber Steuerbehörden im Bereich des Börsengesetzes so erweitert, dass diese für sämtliche Steuerstrafverfahren gelten. Hierzu wird die bestehende Regelung zum Informationsaustausch mit den Steuerbehörden an entsprechende Regelungen im Bank- und Wertpapieraufsichtsrecht angepasst."
  const test_tos = "Referentenentwurf\n des Bundesministeriums der Finanzen\n Entwurf eines Gesetzes zur begleitenden Ausführung der Verordnung\n (EU) 2020/1503 und der Umsetzung der Richtlinie EU 2020/1504 zur Regelung von Schwarmfinanzierungsdienstleistern (Schwarmfinanzierung-Begleitgesetz)\n\n"
  const test_ammendment = "Paneuropäisches Privates Pensionsprodukt (PEPP)"
  // credentials for openai
  let openai  =  require("openai-node");
  openai.api_key  = "";

  const[law, setLaw] = useState({
    name: "",
    scraper: {
      titel: "",
      hyperlink: "",
      dateOfPublication: "",
    },
    rawContent: "",
    metaData: {
      nameOfthisVersion: "",
      typeOfLaw: "",
      organization: "",
      statusOfLaw: "",
      namesOfCorrespondingLaws: "",
    },
    summary: "",
    existingPolicy: `Produkt-Richtlinie v3.2 - Stand: 16.4.21
    Produkt-Richtlinie
    der
    InvestFix GmbH
    Meisengasse 8, 60313 Frankfurt am Main
    
    I. Vorwort
    Die InvestFix GmbH ("InvestFix") ist ein Finanzanlagenvermittler nach § 34f Absatz 1 der Gewerbeordnung (GewO).
    
    II. Beratungsgrundsätze
    Die InvestFix berät ehrlich, redlich und professionell im bestmöglichen Interesse ihrer Kunden. Sie hat einem Kunden, bevor es Geschäfte für ihn durchführt, die allgemeine Art und Herkunft von Interessenkonflikten und die zur Begrenzung der Risiken der Beeinträchtigung der Kundeninteressen unternommenen Schritte eindeutig darzulegen.
    
    III. Produktportfolio der InvestFix
    Abhängig von der Erfahrung und den Vorkenntnissen des Kunden, empfiehlt die InvestFix dem Kunden nach eingehender Beratung eines der folgenden Produkte:
    1. Anteil einer inländischen Kapitalanlagegesellschaft;
    2. Öffentlich angebotener Anteil an geschlossenem Fonds (z. B. Immobilienfonds, Lebensversicherungsfonds, Medienfonds);
    3. Unternehmensbeteiligung;
    4. Treuhandvermögen;
    5. Genussrecht;
    6. Direktinvestment (z.B. Edelmetall);
    7. Kapitalbildende Lebensversicherung.
    
    IV. Dokumentationspflichten
    Die Darlegung etwaiger Interessenkonflikte nach Ziffer II. sowie die Beratung und Geeignetheitsprüfung im Hinblick auf das vermittelte Anlageprodukt sind hinreichend detailliert in der Kundenkartei zu dokumentieren. Der Kunde hat die Dokumentation nach dem Beratungsgespräch zu unterzeichnen.`,
    amendedPolicy: "",
    
  });

  const updateTOS = (value, attribute) => {
    const firstSplit = value.split(";");
    const newMetaData = law.metaData
    firstSplit.map((type, index) => {
      if (index == 0) {
        newMetaData.nameOfthisVersion = type.split(": ")[1];
      } else if (index == 1) {
        newMetaData.typeOfLaw = type.split(": ")[1];
      } else if (index == 2) {
        newMetaData.organization = type.split(": ")[1];
      } else if (index == 3) {
        newMetaData.statusOfLaw = type.split(": ")[1];
      }
    });
    let updated = {};
    updated[attribute] = newMetaData;
    console.log(updated[attribute]);
    setLaw({ ...law, ...updated });
  };

  //Name of this Version: Referentenentwurf;
  //Type of law: Gesetz;
  //Organization: Bundesministerium der Finanzen;
  //Status of Law: Entwurf;

  const updateLaw = (value, attribute) => {
    let updated = {};
    updated[attribute] = value;
    console.log(value)
    setLaw({ ...law, ...updated });
  };
 
  // summary requ.
  const summary = (scraped_sum) => { 

    openai.Completion.create({
      engine: "davinci",
      prompt: `Mein Anwalt fragte mich was dieses Gesetz bedeuted:\n\n'''\n ${scraped_sum}\n'''\ntl;dr:\n'''`,
      temperature: 0.25,
      max_tokens: 306,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      logprobs: null,
      echo: false,
      best_of: 1,
      stop: "'''",
    }).then((response) => {
      console.log(response);
      updateLaw(response.choices[0].text, "summary")
      //EXAMPLE OUTPUT: She didn't go to the market.
    });
  };

  const amendmendsSum = (text) => { 
    openai.Completion.create({
      engine: "davinci",
      prompt: `Mein Anwalt fragte mich was dieses Gesetz bedeuted:\n\n'''\n ${text}\n'''\ntl;dr:\n'''`,
      temperature: 0.25,
      max_tokens: 306,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      logprobs: null,
      echo: false,
      best_of: 1,
      stop: "'''",
    }).then((response) => {
      console.log(response);
      updateLaw(response.choices[0].text, "summary")
      //EXAMPLE OUTPUT: She didn't go to the market.
    });
  };

  const policyAmmendment = (policy, amendmend) => { 
    openai.Completion.create({
      engine: "davinci",
      prompt: `This is a tool that amends parts of a text
      ###
      Old version:
      I. Einführung
      Das ist eine Beschreibung der Tierwelt der Familie Mayer.
      
      II. Tiersammlung
      Familie Mayer hat die folgenden Tiere:
      1. Hunde
      2. Katzen
      3. Schildkröten.
      
      III. Tierpflege
      Die Tiere werden täglich gepflegt.
      
      IV. Besucher
      Besucher können die Tiere werktags besichtigen.
      ---
      Amend: Füge "Meerschweinchen (Test)" in die Tiersammlung ein.
      ---
      Amended text:
      II. Tiersammlung
      Familie Mayer hat die folgenden Tiere:
      1. Hunde
      2. Katzen
      3. Schildkröten
      4. Meerschweinchen.
      
      ###
      Old version:
      I. Einleitung
      Die toom GmbH ("toom") ist ein Baumarkt.
      
      II. Öffnungszeiten
      toom ist 24 Stunden geöffnet.
      
      III. Lieferung
      Eine Lieferung der Produkte ist nicht möglich.
      
      IV. Bauprodukte
      Toom verkauft die folgenden Baumaterialien:
      1. Pressspanplatten
      2. Ziegelsteine
      3. Holzlatten
      4. Wandfarbe.
      
      V. Anfertigung von Baumaterialien
      Baumaterialien können auch auf Kundenwunsch individuell angefertigt werden.
      ---
      Amend: Füge "Kleister" in die Bauprodukte ein.
      ---
      Amended text:
      II. Bauprodukte
      Toom verkauft die folgenden Baumaterialien:
      1. Pressspanplatten
      2. Ziegelsteine
      3. Holzlatten
      4. Wandfarbe
      5. Kleister.
      
      ###
      Old version: 
      ${policy}
      ---
      Amend: Füge ${amendmend} in das Produktportfolio ein.
      ---
      Amended text:`,
      temperature: 0.25,
      max_tokens: 306,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      logprobs: null,
      echo: false,
      best_of: 1,
      stop: "'''",
    }).then((response) => {
      console.log(response);
      updateLaw(response.choices[0].text, "amendedPolicy")
      //EXAMPLE OUTPUT: She didn't go to the market.
    });
  };
  useEffect(() => {
    summary(test_sum)
  }, []);
  
  // Type of law, Organization, Status of Law
  const tos = (law) => { 
    console.log(law)
    openai.Completion.create({
      engine: "davinci",
      prompt: `Aus dem Text finden wir "Type of law", "Organization", "Status of law", "Name of this Version".\n###\nUnsinnsentwurf\nder Bundesregierung\nEntwurf eines Verordnung zur Umsetzung der Richtlinie 2014/91/EU zur\nÄnderung der Richtlinie 2009/65/EG zur Koordinierung der Rechts- und\nVerwaltungsvorschriften betreffend bestimmte Organismen für gemeinsame Anlagen in Wertpapieren (OGAW) im Hinblick auf die Aufgaben der Verwahrstelle, die Vergütungspolitik und Sanktionen (OGAW-V-Umsetzungsgesetz – OGAW-V-UmsG)\nName of this Version: Unsinnsentwurf;\nType of law: Verordnung;\nOrganization: Bundesregierung;\nStatus of Law: Entwurf;\n###\n
      ${law}`,
      //prompt: `Aus dem Text finden wir "Type of law", "Organization", "Status of law", "Name of this Version".\n
      //###\n
      //Unsinnsentwurf\n
      //der Bundesregierung\n
      //Entwurf eines Verordnung zur Umsetzung der Richtlinie 2014/91/EU zur\n
      //Änderung der Richtlinie 2009/65/EG zur Koordinierung der Rechts- und\n
      //Verwaltungsvorschriften betreffend bestimmte Organismen für gemeinsame Anlagen in Wertpapieren (OGAW) im Hinblick auf die Aufgaben der Verwahrstelle, die Vergütungspolitik und Sanktionen
      //(OGAW-V-Umsetzungsgesetz – OGAW-V-UmsG)\n
      //Name of this Version: Unsinnsentwurf;\n
      //Type of law: Verordnung;\n
      //Organization: Bundesregierung;\n
      //Status of Law: Entwurf;\n
      //###\n
      temperature: 0.06,
      max_tokens: 374,
      top_p: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      logprobs: null,
      n: 1,
      echo: false,
      best_of: 1,
      stop: "###",
    }).then((response) => {
      console.log(response);
      updateTOS(response.choices[0].text, "metaData")
      //EXAMPLE OUTPUT: She didn't go to the market.
    });
  };
    return (
      <>
        <Container  fluid className="text-center pt-3" /*style={{backgroundColor: "#e4d6ff"}}*/>
            <Container>
              <Row>
                {/* Georg */}
                <Col className="w-50">
                  <div>
                    <h2>Human Georg </h2>
                  </div>
                  <Card>
                    <Card.Body>
                      <Card.Title>Titel</Card.Title>
                      <Card.Text>
                        Gesetz zur begleitenden Ausführung der Verordnung (EU) 2020/1503 und der Umsetzung der Richtlinie (EU) 2020/1504 zur Regelung von Schwarmfinanzierungsdienstleistern - Änderung der Verordnung über die Erhebung von Gebühren und die Umlegung von Kosten nach dem Finanzdienstleistungsaufsichtsgesetz
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Hyperlink</Card.Title>
                      <Card.Text>
                      https://www.bundesfinanzministerium.de/Content/DE/Gesetzestexte/Gesetze_Gesetzesvorhaben/Abteilungen/Abteilung_VII/19_Legislaturperiode/2021-03-24-Schwarmfinanzierung-BegleitG/1-Referentenentwurf.pdf?__blob=publicationFile&v=3
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Date of Publication</Card.Title>
                      <Card.Text>
                        24.03.2021
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Name of this Version</Card.Title>
                      <Card.Text>
                        Referentenentwurf
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Type of Law</Card.Title>
                      <Card.Text>
                        Gesetzt
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Organization</Card.Title>
                      <Card.Text>
                        Bundesministerium der Finanzen
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Status of Law</Card.Title>
                      <Card.Text>
                        Entwurf
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Name of corresponding Laws</Card.Title>
                      <Card.Text>
                      Wertpapierhandelsgesetzes, Wertpapierprospektgesetzes, Vermögensanlagengesetzes, Wertpapierinstitutsgesetzes, Kreditwesengesetzes, Kapitalanlagegesetzbuchs, Sanierungs- und Abwicklungsgesetzes, Geldwäschegesetzes, Versicherungsaufsichtsgesetzes, Wertpapiererwerbs- und Übernahmegesetzes, Finanzdienstleistungsaufsichtsgesetzes, WpÜG-Beiratsverordnung, WpÜG-Widerspruchsausschuss-Verordnung, WpÜG-Gebührenverordnung,Verordnung über die Erhebung von Gebühren und die Umlegung  von Kosten nach dem Finanzdienstleistungsaufsichtsgesetz, Verordnung über die Erhebung von Gebühren und die Umlegung von Kosten nach dem Finanzdienstleistungsaufsichtsgesetz
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>Summary</Card.Title>
                      <Card.Text>
                      The German Federal Ministry of Finance (*Bundesfinanzministerium *– BMF) published a Minister’s bill (dated as of 26 November 2020) on a draft law on the accompanying implementation of Regulation (EU) 2020/1503 and the implementation of Directive EU 2020/1504 regulating swarm finance service providers (*Schwarmfinanzierung-Begleitgesetz*). The draft law essentially serves to implement several legal acts of the European Union: (i) [Regulation (EU) 2020/1503](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32020R1503) and [Directive (EU) 2020/1504](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32020L1504) of 7 October 2020 on European Swarm Funding Service Providers; (ii) [Regulation (EU) 2019/1238](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32019R1238) of 20 June 2019 on a Pan-European Private Pension Product - PEPP (PEPP - VO); (iii) Regulation (EU) (to be promulgated in the Official Journal) on a framework for the recovery and resolution of central counterparties; and (iv) [Directive (EU) 2019/2177](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32019L2177) of 18 December 2019 amending rules on data reporting services, and amending [Directive (EU) 2015/849](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32015L0849) on the prevention of the use of the financial system for the purpose of money laundering and terrorist financing.

The legal acts must either be implemented by mid-June 2021 or will apply for the first time from the end of 2021 or the beginning of 2022, so national legislation will have to be adapted by then.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* GeorgPT-3 */}
                  <Col className="w-50">
                    <div>
                      <h2>GeorgPT-3</h2>
                    </div>
                    <Card>
                      <Card.Body>
                        <Card.Title>Titel</Card.Title>
                        <Card.Text>
                          {law.scraper.title}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Hyperlink</Card.Title>
                        <Card.Text>
                          {law.scraper.hyperlink}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Date of Publication</Card.Title>
                        <Card.Text>
                          {law.scraper.dateOfPublication}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Name of this Version</Card.Title>
                        <Card.Text>
                        {law.metaData.nameOfthisVersion}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Type of Law</Card.Title>
                        <Card.Text>
                        {law.metaData.typeOfLaw}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Organization</Card.Title>
                        <Card.Text>
                        {law.metaData.organization}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Status of Law</Card.Title>
                        <Card.Text>
                        {law.metaData.statusOfLaw}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Name of corresponding Laws</Card.Title>
                        <Card.Text>
                        {law.metaData.namesOfCorrespondingLaws}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>Summary</Card.Title>
                        <Card.Text>
                        {law.summary}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            
          </Container>
        </>
    );
};

export default Home;