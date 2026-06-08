const createSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const models = [
  { title: "TV", imageUrl: "/images/Skull.jpg", modelUrl: "/models/Television_01_4k.gltf/Television_01_4k.gltf", description: "A vintage television set — 3D model.", category: "3D Model", year: "2022" },
].map(art => ({
  ...art,
  slug: createSlug(art.title),
}));

export default models;