import { RefObject, useEffect, useRef, useState } from "react";
import { select } from "d3";
import "./App.css";

const UNSPLASH_CLIENT_ID = "9MUAPy3db_ED7Y7KBFfenaSY-FXnMxkCwqqrEg3-s-I";

interface Params {
  [key: string]: string;
}
const encodeQueryData = (data: Params) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

function App() {
  interface Animal {
    name: string;
    z: number;
    imgSrc: string | null;
  }
  interface Taxonomy {
    scientific_name: string;
    genus: string;
    family: string;
    order: string;
    class: string;
    phylum: string;
    kingdom: string;
  }

  const [data, setData] = useState([
    { name: "human", z: 1, imgSrc: null },
    { name: "monkey", z: 0.95, imgSrc: null },
    { name: "dog", z: 0.9, imgSrc: null },
  ] as Animal[]);
  const svgRef = useRef() as RefObject<SVGSVGElement>;

  const getDataFromSearch = async (animals: Animal[]) => {
    let newData: Animal[] = [];
    for (const animal of animals) {
      const params = encodeQueryData({
        query: animal.name,
        client_id: UNSPLASH_CLIENT_ID,
      });
      const result = await fetch(
        `https://api.unsplash.com/search/photos?${params}`
      );
      const json: any = await result.json();
      const src: string = json.results[0].urls.regular;
      newData.push({ ...animal, imgSrc: src });
      console.log(newData);
    }
    setData(newData);
  };

  useEffect(() => {
    getDataFromSearch(data);
    console.log(svgRef);
    const svg = select(svgRef.current);

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
  }, []);

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
        {data
          .sort((a, b) => a.z - b.z)
          .map(({ name, imgSrc }) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img style={{ width: 150, height: 100 }} src={imgSrc!}></img>
              <div style={{ width: 100 }}>{name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
