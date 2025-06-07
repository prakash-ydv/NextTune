const api = import.meta.env.VITE_API;

async function searchVideo() {
  const response = await fetch(`api/${query}`);
  const data = await response.json();
  console.log(data)
  return data;
}

export default searchVideo;
