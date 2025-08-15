const createSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const artworks = [
  { title: "skull", imageUrl: "/images/Skull.jpg", description: "Potrait of Human skull made with both pencil and paint. This was my third attempt with the aim of mixing drawing an painting" },
  { title: "mosaic", imageUrl: "/images/Mosaic-skull.jpg", description: "Potrait of a Human skull Drawn entirely out of paint.This was My Second yearly study of the human skull" },
  { title: "Colored-skull", imageUrl: "/images/Colored-skull.jpg", description: "Potrait of the Human Skull Drawn with both pencil and paint. This is my fourth attempt going for more detail than the third" },
  { title: "still-life", imageUrl: "/images/still life.jpg", description: "Simple still life of a fiew bottles and an apple" },
  { title: "Hanging-branch", imageUrl: "/images/Branch.jpg", description: "A composition consisting of a hanging branch, drawn entirely digitally." },
  { title: "Spots", imageUrl: "/images/Spots.jpg", description: "Spots and patterns." },
  { title: "Rose", imageUrl: "/images/Rose.jpg", description: "A beautiful rose drawn with intricate details." },

].map(art => ({
  ...art,
  slug: createSlug(art.title),
}));


export default artworks;