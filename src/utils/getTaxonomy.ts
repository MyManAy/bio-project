import { type Taxonomy } from "./sorter";
interface Params {
  [key: string]: string;
}

const encodeQueryData = (data: Params) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

export const getTaxonomy = async (animalName: string) => {
  const params = encodeQueryData({
    q: animalName,
  });
  const result = await fetch(
    `https://api.gbif.org/v1/species/search?${params}`
  );
  const json: any = await result.json();
  for (const animalData of json.results) {
    let vernacularName = "";
    for (const vernacular of animalData.vernacularNames) {
      if (vernacular.language === "eng") {
        vernacularName = vernacular.vernacularName;
      }
    }
    if (
      animalData.genus &&
      animalData.class &&
      animalData.order &&
      animalData.kingdom &&
      animalData.phylum &&
      animalData.family &&
      animalData.scientificName &&
      vernacularName.length !== 0
    ) {
      const tax: Taxonomy = {
        genus: animalData.genus,
        class: animalData.class,
        order: animalData.order,
        kingdom: animalData.kingdom,
        phylum: animalData.phylum,
        family: animalData.family,
        scientificName: animalName,
        vernacularName: vernacularName,
      };
      return tax;
    }
  }
};
