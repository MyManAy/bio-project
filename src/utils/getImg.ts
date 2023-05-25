interface Params {
  [key: string]: string;
}
const encodeQueryData = (data: Params) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

const UNSPLASH_CLIENT_ID = "9MUAPy3db_ED7Y7KBFfenaSY-FXnMxkCwqqrEg3-s-I";

export const getImg = async (name: string) => {
  const params = encodeQueryData({
    query: name,
    client_id: UNSPLASH_CLIENT_ID,
  });
  const result = await fetch(
    `https://api.unsplash.com/search/photos?${params}`
  );
  const json: any = await result.json();
  const src: string = json.results[0].urls.regular;
  return src;
};
