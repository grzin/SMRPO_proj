# Dokumentacija

## #1 - Dodajanje uporabnikov

Uporabnik z administratorskimi pravicami ima dostop do zavihka `Users`, kjer mu akcija `Create user` omogoča dodajanje novega uporabnika v sistem. Novemu uporabniku mora določiti unikatno uporabniško ime, ime, priimek, e-poštni naslov, vlogo v sistemu in geslo.

![img/1.png](img/1.png)

## #2 - Vzdrževanje uporabniških računov

Uporabnik z administratorskimi pravicami ima dostop do zavihka `Users`, kjer se prikaže tabela vseh uporabnikov sistema. S klikom na uporabnika lahko administrator vidi in spreminja uporabniške podatke in pravice. Uporabniku lahko nastavi tudi novo geslo ali uporabnika izbriše.

![img/2.png](img/2.png)

## #30 - Prijava v sistem

Uporabnik si lahko ustvari nov uporabniški račun s klikom na `Register`. Izbrati si mora unikatno uporabniško ime, izpolniti podatke o imenu, priimku, e-pošti in dvakrat vpisati izbrano geslo. Geslo mora biti dolgo vsaj 12 znakov.

S klikom na ikono ob polju za geslu lahko uporabnik geslo razkrije.

Po registraciji se lahko v sistem prijavi z izbranim uporabniškim imenom in geslom.

![img/30-1.png](img/30-1.png)
![img/30-2.png](img/30-2.png)

## #3 - Spreminjanje lastnih uporabniških podatkov

Uporabnik v zavihku "Profile Settings" lahko spreminja svoje uporabniško ime, e-poštni naslov in geslo. Za spremembo gesla mora vnesti staro geslo, za katero se preveri, da je pravo. Podvajanje uporabniškega imena se preverja in če pride do kakšne neregularnosti ali napake vmesnik uporabnika obvesti o tem.

![img/3.png](img/3.png)

## #6 - Ustvarjanje novega sprinta

Uporabniku so predstavljeni vsi sprinti na projektu.
Prijavljen uporabnik lahko na projektu doda nov sprint s klikom na gumb `Add sprint`:

![img/6.png](img/6.png)

Uporabnik mora vnesti podatke o sprintu:

![img/6_add.png](img/6_add.png)

Aplikacija preveri ustreznost vnesenih polj:

- Sprint ima unikatno ime (v sklopu projekta);
- Začetni datum ni v preteklosti;
- Končni datum ni pred začetnim;
- Hitrost sprinta mora biti pozitivno število;
- Sprint se ne prekriva s katerimkoli drugim sprintom znotraj projekta.

V primeru zaznane napake aplikacija obvesti uporabnika in onemogoči izdelavo sprinta, dokler napaka ni razrešena.

## #7 - Vzdrževanje obstoječih sprintov

Uporabnik lahko s klikom na ime sprinta v seznamu na projektu uredi ali izbriše sprint:

![img/7.png](img/7.png)

Aplikacija preveri ustreznost vnesenih polj:

- Sprint ima unikatno ime (v sklopu projekta);
- Začetni datum ni v preteklosti;
- Končni datum ni pred začetnim;
- Hitrost sprinta mora biti pozitivno število;
- Sprint se ne prekriva s katerimkoli drugim sprintom v projektu.

V primeru zaznane napake aplikacija obvesti uporabnika in onemogoči izdelavo sprinta, dokler napaka ni razrešena.

## #8 - Dodajanje uporabniških zgodb

Administrator, prodkutni vodja in skrbnik metodologije lahko s klikom na gumb "Add Story" na nadzorni plošči za projekt ustvarjajo nove uporabniške zgodbe. Preverjajo se vsa dovoljenja, povezana z vlogami, tako v uporabniškem vmesniku kot na strežniku.

- Naslov uporabniške zgodbe se ne podvaja.
- Preverja se, da je poslovna vrednost število.
- Preverja se, da je prioriteta ena od 4 zahtevanih opcij.

Za primer, gumb "Add Story" vidijo le pooblaščene osebe (administrator in zgornji vlogi).

![img/8.png](img/8.png)
![img/8-add.png](img/8-add.png)

## #9 - Urejanje in brisanje uporabniških zgodb

Administrator, prodkutni vodja in skrbnik metodologije lahko s klikom na prikazano uporabniško zgodbo urejajo njene parametre, lahko pa jo tudi zbrišejo s klikom na rdeč gumb. Preverjajo se vsa dovoljenja, povezana z vlogami, tako v uporabniškem vmesniku kot na strežniku.

- Naslov uporabniške zgodbe se ne podvaja.
- Preverja se, da je poslovna vrednost število.
- Preverja se, da je prioriteta ena od 4 zahtevanih opcij.

Za primer, če uporabnik nima primernih pravic, sicer vidi seznam nalog, ne more pa s klikom odpreti obrazca za urejanje.

![img/9.png](img/9.png)

## #11 - Ocena časovne zahtevnosti

Skrbnik metodologije lahko uporabniški zgodbi določi in spremeni oceno časovne zahtevnosti.

![img/11.png](img/11.png)

Aplikacija pred shranjevanjem podatkov preveri ustrezne uporabniške pravice in pravilen vnos časovne ocene.
V primeru napačnega vnosa je shranjevanje onemogočeno.
