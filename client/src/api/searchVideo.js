const api = import.meta.env.VITE_API;

async function searchVideo(query) {
  const response = await fetch(`${api}${query}`);
  const data = await response.json();
  return data;
}

export default searchVideo;
