interface Animal {
  tax: Taxonomy;
  vernacularName: string;
  imgSrc: string | null;
}
export interface Taxonomy {
  [key: string]: string;
  scientificName: string;
  genus: string;
  family: string;
  order: string;
  class: string;
  phylum: string;
  kingdom: string;
}
const human = {
  kingdom: "Metazoa",
  phylum: "Chordata",
  class: "Mammalia",
  order: "Primates",
  family: "Hominidae",
  genus: "Homo",
  scientificName: "Homo sapiens",
};
const chimpanzee = {
  kingdom: "Metazoa",
  phylum: "Chordata",
  class: "Mammalia",
  order: "Primates",
  family: "Hominidae",
  genus: "Pan",
  scientificName: "Pan troglodytes",
};
const dog = {
  kingdom: "Animalia",
  phylum: "Chordata",
  class: "Mammalia",
  order: "Carnivora",
  family: "Canidae",
  genus: "Canis",
  scientificName: "Canis lupus familiaris",
};
const priority = ["genus", "family", "order", "class", "phylum", "kingdom"];

export const taxonomySorter = (animals: Animal[]) => {
  let unsorted = animals;
  let sorted = [animals[0]];
  for (const classification of priority) {
    for (let i = 1; i < unsorted.length; i++) {
      if (unsorted[0].tax[classification] === unsorted[i].tax[classification]) {
        sorted.push(unsorted[i]);
        unsorted.splice(i, 1);
      }
    }
  }
  return sorted;
};

export const test = [human, chimpanzee, dog];
