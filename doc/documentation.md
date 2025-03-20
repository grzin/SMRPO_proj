# Dokumentacija

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

## #11 - Ocena časovne zahtevnosti

Skrbnik metodologije lahko uporabniški zgodbi določi in spremeni oceno časovne zahtevnosti.

![img/11.png](img/11.png)

Aplikacija pred shranjevanjem podatkov preveri ustrezne uporabniške pravice in pravilen vnos časovne ocene.
V primeru napačnega vnosa je shranjevanje onemogočeno.
