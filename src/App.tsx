import { RefObject, useEffect, useRef, useState } from "react";
import { select } from "d3";
import "./App.css";
import { type Taxonomy, taxonomySorter } from "./utils/sorter";
import { getTaxonomy } from "./utils/getTaxonomy";
import { getImg } from "./utils/getImg";

function App() {
  interface Animal {
    tax: Taxonomy;
    vernacularName: string;
    imgSrc: string | null;
  }
  type AnimalName = {
    scientific: string;
    vernacular: string;
  };

  const [data, setData] = useState([] as Animal[]);
  const svgRef = useRef() as RefObject<SVGSVGElement>;

  const getDataFromSearch = async (animalNames: AnimalName[]) => {
    let newData: Animal[] = [];
    for (const name of animalNames) {
      const tax = await getTaxonomy(name.scientific);
      console.log(tax);
      const src = await getImg(name.vernacular);
      newData.push({ tax: tax!, imgSrc: src, vernacularName: name.vernacular });
    }
    setData(taxonomySorter(newData).reverse());
  };

  useEffect(() => {
    const animalNames = [
      {
        scientific: "Homo sapiens",
        vernacular: "human",
      },
      {
        scientific: "Pan troglodytes",
        vernacular: "chimpanzee",
      },
      {
        scientific: "Canis lupus familiari",
        vernacular: "dog",
      },
      {
        scientific: "Equus caballus",
        vernacular: "horse",
      },
    ];
    getDataFromSearch(animalNames);
    console.log(svgRef);
    const svg = select(svgRef.current);
    svg.selectAll("line").remove();
    const MAX_HEIGHT = 400;
    svg
      .selectAll("line")
      .data(data)
      .join((enter) =>
        enter
          .append("line")
          .style("stroke", "lightgreen")
          .style("stroke-width", 10)
          .attr("x1", (_, i) => `${i * (1 / (data.length - 1)) * 100}%`)
          .attr("x2", (_, i) =>
            i === data.length - 1
              ? "50%"
              : `${50 + i * (1 / (data.length - 1)) * 50}%`
          )
          .attr("y1", MAX_HEIGHT)
          .attr("y2", (_, i) =>
            i === data.length - 1 || i === 0
              ? 0
              : `${i * (1 / (data.length - 1)) * 100}%`
          )
      );
  }, [data]);

  return (
    <div className="App">
      <div>
        <svg style={{ width: "80%", height: "400px" }} ref={svgRef}></svg>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          left: "10%",
          width: "80%",
        }}
      >
        {data.map(({ vernacularName, imgSrc }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img style={{ width: 150, height: 100 }} src={imgSrc!}></img>
            <div style={{ width: 100 }}>{vernacularName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
